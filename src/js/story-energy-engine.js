(function (root, factory) {
  "use strict";
  const engine = factory();
  if (typeof module === "object" && module.exports) module.exports = engine;
  if (root) root.NDStoryEnergyEngine = engine;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  // The story trial is intentionally independent of game.js, storage and UI.
  const JOB_NAMES = Object.freeze({
    swordsman: "劍客", tank: "坦克", assassin: "刺客", gunner: "槍客"
  });
  const SKILLS = Object.freeze({
    tank: Object.freeze({name: "地遁", cost: 3, target: "enemy", description: "造成 1 傷害；命中後使目標下一次己方回合無法主動行動。"}),
    assassin: Object.freeze({name: "殘影", cost: 2, target: "self", description: "閃避下一次直接攻擊後消失；非遠距攻擊有 50% 機率反擊，直接扣攻擊者生命 1。"}),
    swordsman: Object.freeze({name: "人劍合一", cost: 3, target: "self", description: "自己的下一個回合起，下一次普攻傷害 +1；未出手保留，被閃仍消耗。"}),
    gunner: Object.freeze({name: "共振彈", cost: 3, target: "enemy", description: "遠距造成 1 傷害；命中後目標接下來兩次回合開始各受 1 傷害。再次命中刷新，不疊層。"})
  });
  const RULES = Object.freeze({
    version: 1,
    hp: 10,
    attack: 1,
    tankShield: 2,
    maxRounds: 50,
    energy: Object.freeze({initial: 0, max: 3, gain: 1, firstGainTurn: 2, scope: "team"}),
    costs: Object.freeze({tank: 3, assassin: 2, swordsman: 3, gunner: 3}),
    shadowCounterChance: 0.5,
    criticalChance: 0.1,
    criticalEvery: 4,
    trialDefaults: Object.freeze([
      "雙方暮晶各自全隊共用；每人每己方回合普攻與常駐技能各最多一次，可任意先後。",
      "只有技能明示反擊；殘影反擊穿盾，遠距不遭反擊。",
      "武士魂在每次己方回合開始生命為 1 或 2 時取得，同名不堆疊。",
      "槍客只計普攻出手，第 4 次判定爆擊後重新累積。",
      "共振彈暫定 3 費，立即 1 加兩次持續傷害各 1；再次命中刷新。",
      "restrained 敵方僅使用自身增益，普攻須確保目標至少保留 3 HP，且避開殘影。"
    ])
  });

  function skill(job) {
    return SKILLS[job] ? {...SKILLS[job]} : null;
  }
  // The skill as this unit has it now (an awakened unit's 殘影 always counters).
  function skillFor(entry) {
    const base = entry && skill(entry.job);
    if (base && entry.job === "assassin" && entry.counterChance >= 1) base.description = "閃避下一次直接攻擊後消失；必定反擊（遠距也會），直接扣攻擊者生命 1。";
    return base;
  }
  const CONE = Object.freeze({name: "晶錐", target: "all", description: "對所有敵人造成 1 傷害；命中後震盪，目標接下來兩次回合開始各受 1 傷害。"});

  function number(value, fallback, minimum, label, integer) {
    if (value === undefined) return fallback;
    if (typeof value !== "number" || !Number.isFinite(value) || value < minimum || (integer && !Number.isInteger(value))) {
      throw new TypeError(label + " 數值無效");
    }
    return value;
  }

  function unit(spec, side, id, isHero) {
    const job = spec.job || "swordsman";
    if (!Object.prototype.hasOwnProperty.call(JOB_NAMES, job)) throw new TypeError("未知職業：" + job);
    const hp = isHero ? RULES.hp : number(spec.hp, RULES.hp, 1, "HP", false);
    const result = {
      id, job, name: spec.name || JOB_NAMES[job], side, isHero,
      hp, maxHp: hp,
      attack: isHero ? RULES.attack : number(spec.attack, RULES.attack, 0, "攻擊", false),
      // Story encounters may tune a tank's shield per unit; the default stays RULES.tankShield.
      shield: job === "tank" ? (isHero ? RULES.tankShield : number(spec.shield, RULES.tankShield, 0, "護盾", true)) : 0,
      attacked: false, skillUsed: false, shots: 0,
      statuses: {shadow: false, stun: 0, spirit: false, unityReadyTurn: null, resonance: null}
    };
    if (spec.portrait !== undefined) result.portrait = spec.portrait;
    // Optional trap unit (e.g. story rats): see strike()/detonateSelf() for
    // the two distinct triggers (its own attack vs. dying to a melee hit).
    if (spec.trap) result.trap = true;
    // Optional plain unit (H2 reinforcements): ordinary attacks only, no skill and no 武士魂.
    if (spec.plain) result.plain = true;
    // Optional phase transform (e.g. a boss's second life): consumed by
    // performTransform() the instant this unit's HP reaches 0.
    if (spec.transform) result.transformTo = spec.transform;
    return result;
  }

  function emit(state, events, type, text, details) {
    const event = {type, ...details, text};
    events.push(event);
    state.log.push(text);
    return event;
  }

  // Presentation copies only: never attach traces to gameplay state or replay
  // a rule to animate it. Each frame spans a complete action or turn phase.
  function presentationSnapshot(state) {
    const {round, side, status, reason, teams, units} = state;
    const snap = JSON.parse(JSON.stringify({round, side, status, reason, teams, units}));
    if (state.reinforce) snap.kills = state.reinforce.kills;
    return snap;
  }

  function recordFrame(state, events, frames, kind, side, apply) {
    const before = presentationSnapshot(state);
    const firstEvent = events.length;
    apply();
    frames.push({
      kind, side, before, after: presentationSnapshot(state),
      // Events contain only scalar data. Copies keep UI playback independent
      // from the existing result.events / state.events references.
      events: events.slice(firstEvent).map(event => ({...event}))
    });
  }

  function finish(state, events, status, reason) {
    if (state.status !== "playing") return;
    state.status = status;
    state.reason = reason;
    emit(state, events, "result", reason);
  }

  function checkOutcome(state, events) {
    if (state.status !== "playing") return true;
    // Rescue: once awakened, when exactly one player-side unit is left, the listed units join our side (one time).
    if (state.rescue && !state.rescue.used && state.units.filter(entry => entry.side === "player" && entry.hp > 0).length === 1) {
      state.rescue.used = true;
      if (state.rescue.text) emit(state, events, "rescue", state.rescue.text, {});
      for (const r of state.rescue.units) {
        if (!r || typeof r.id !== "string" || state.units.some(entry => entry.id === r.id)) throw new TypeError("救援角色 ID 必須唯一且非空");
        const joined = unit(r, "player", r.id, false);
        state.units.push(joined);
        emit(state, events, "summon", joined.name + " 加入戰場。", {targetId: joined.id});
      }
    }
    // Story battles are lost only when every player-side unit has fallen.
    if (!state.units.some(entry => entry.side === "player" && entry.hp > 0)) {
      finish(state, events, "lost", "我方全數倒下，戰鬥失敗。");
    } else if (state.objective.type === "survive" && state.objective.requireBothAlive && state.units.some(entry => entry.hp <= 0)) {
      finish(state, events, "lost", "牽制失敗：本場所有參戰角色都必須存活。");
    } else if (state.reinforce) {
      if (reinforceDone(state)) finish(state, events, "won", "擊倒 " + state.reinforce.goal + " 名士兵，戰鬥勝利。");
    } else if (!state.units.some(entry => entry.side === "enemy" && entry.hp > 0)) {
      finish(state, events, "won", "敵方全數倒下，戰鬥勝利。");
    }
    return state.status !== "playing";
  }

  // Damage has no implicit evade/counter behavior. Direct attacks opt into
  // those once in strike(); DOT and counter cannot cause recursive counters.
  function damage(state, target, amount, events, sourceId, label, bypassShield) {
    const before = target.hp;
    const absorbed = bypassShield ? 0 : Math.min(target.shield, amount);
    target.shield -= absorbed;
    const hpLoss = Math.min(target.hp, Math.max(0, amount - absorbed));
    target.hp = Math.max(0, target.hp - hpLoss);
    if (absorbed > 0) {
      emit(state, events, "shield", target.name + " 的護盾吸收 " + absorbed + " 傷害。", {actorId: sourceId, targetId: target.id, amount: absorbed});
    }
    emit(state, events, "damage", label + "：" + target.name + " 生命 −" + hpLoss + "。", {actorId: sourceId, targetId: target.id, amount: hpLoss});
    if (before > 0 && target.hp <= 0) {
      if (target.transformTo) {
        performTransform(state, target, events);
      } else {
        emit(state, events, "defeat", target.name + " 倒下。", {targetId: target.id});
        countKill(state, target);
      }
    }
  }

  // Optional reinforcement waves (H2): at the end of each enemy turn the enemy field is refilled from a pool until `goal` enemies have fallen.
  // Fallen slots are reused (same ids), so the roster never grows past its starting size.
  function countKill(state, target) {
    if (state.reinforce && target.side === "enemy" && !target.trap) state.reinforce.kills += 1;
  }
  function reinforceDone(state) {
    const r = state.reinforce;
    if (!r || r.kills < r.goal) return false;
    return !r.requireAwakened || state.units.some(entry => entry.isHero && entry.awakened);
  }
  function reinforceWave(state, events) {
    const r = state.reinforce;
    if (!r || state.status !== "playing") return;
    const alive = state.units.filter(entry => entry.side === "enemy" && entry.hp > 0).length;
    const open = r.requireAwakened && !state.units.some(entry => entry.isHero && entry.awakened) ? Infinity : r.goal - r.kills - alive;
    let room = Math.max(0, Math.min(open, r.size - alive));
    for (const slot of state.units.filter(entry => entry.side === "enemy" && entry.hp <= 0 && r.slots.includes(entry.id))) {
      if (room <= 0) break;
      const spec = r.pool[r.next % r.pool.length];
      r.next += 1;
      const fresh = unit({...spec, id: slot.id}, "enemy", slot.id, false);
      Object.keys(slot).forEach(key => delete slot[key]);
      Object.assign(slot, fresh);
      emit(state, events, "summon", "又一名" + slot.name + "衝進操控室。", {targetId: slot.id});
      room -= 1;
    }
  }

  // A boss's second life. Fires the instant its HP reaches 0 (from any damage
  // source, not only a direct strike), so its own defeat is replaced by this
  // instead: anyone still alive on its own side named in purgeIds is swept
  // away by its rampage, the unit itself is rebuilt in place from the new
  // stats (same id, so targeting/UI keep tracking the same slot), and any
  // summon specs join the fight as brand-new units from the next round on.
  function performTransform(state, target, events) {
    const spec = target.transformTo;
    target.transformTo = null;
    if (spec.awakenText) emit(state, events, "narrate", spec.awakenText, {targetId: target.id});
    for (const id of (spec.purgeIds || [])) {
      const ally = state.units.find(entry => entry.id === id && entry.side === target.side && entry.hp > 0);
      if (ally) {
        ally.hp = 0;
        emit(state, events, "purge", ally.name + " 被暴走的" + (spec.name || target.name) + "當場擊殺。", {actorId: target.id, targetId: ally.id});
      }
    }
    if (spec.job !== undefined) target.job = spec.job;
    target.hp = number(spec.hp, RULES.hp, 1, "HP", false);
    target.maxHp = target.hp;
    target.attack = number(spec.attack, RULES.attack, 0, "攻擊", false);
    target.shield = target.job === "tank" ? number(spec.shield, RULES.tankShield, 0, "護盾", true) : (spec.shield === undefined ? 0 : number(spec.shield, 0, 0, "護盾", true));
    if (spec.name !== undefined) target.name = spec.name;
    // Optional awakened extras (H2: 凜): a guaranteed shadow counter and the all-enemy 晶錐 skill.
    if (spec.counterChance !== undefined) target.counterChance = number(spec.counterChance, RULES.shadowCounterChance, 0, "反擊機率", false);
    if (spec.cone) target.cone = {cost: number(spec.cone.cost, 1, 0, "晶錐消耗", true), damage: number(spec.cone.damage, 1, 0, "晶錐傷害", true), ticks: number(spec.cone.ticks, 2, 0, "晶錐震盪", true)};
    target.coneUsed = false;
    target.awakened = true;
    if (spec.portrait !== undefined) target.portrait = spec.portrait;
    // Optional rat-king rules (see kingRatPlay / ratRespawn). Free actions never use the unit's attack or skill.
    if (spec.ratRules) target.ratRules = {devourBelow: number(spec.ratRules.devourBelow, 5, 0, "吞鼠門檻", true), heal: number(spec.ratRules.heal, 2, 0, "吞鼠回復", true), respawnEvery: number(spec.ratRules.respawnEvery, 2, 1, "補鼠間隔", true), respawnCount: number(spec.ratRules.respawnCount, 1, 1, "補鼠數量", true), turns: 0};
    target.statuses = {shadow: false, stun: 0, spirit: false, unityReadyTurn: null, resonance: null};
    target.attacked = false;
    target.skillUsed = false;
    target.shots = 0;
    emit(state, events, "transform", target.name + " 異變覺醒，戰鬥仍在繼續。", {targetId: target.id});
    if (spec.afterText) emit(state, events, "narrate", spec.afterText, {targetId: target.id});
    // Optional one-time rescue (awakened phase only): see checkOutcome().
    if (spec.rescue) state.rescue = {units: spec.rescue.units || [], text: spec.rescue.text || "", used: false};
    let sumIndex = 0;
    for (const s of (spec.summon || [])) {
      if (!s || typeof s !== "object" || typeof s.id !== "string" || !s.id) throw new TypeError("召喚角色設定無效");
      if (state.units.some(entry => entry.id === s.id)) throw new TypeError("角色 ID 必須唯一且非空：" + s.id);
      const spawned = unit(s, target.side, s.id, false);
      state.units.push(spawned);
      sumIndex += 1;
      emit(state, events, "summon", spawned.name + " 加入戰場。", {targetId: spawned.id});
    }
    // Optional (H1 路易斯): the summoned units flank the transformed unit so the king stands in the middle of the line.
    if (spec.summonAround && sumIndex > 0) {
      const added = state.units.splice(state.units.length - sumIndex, sumIndex);
      const at = state.units.indexOf(target);
      state.units.splice(at, 0, ...added.slice(0, Math.ceil(added.length / 2)));
      state.units.splice(state.units.indexOf(target) + 1, 0, ...added.slice(Math.ceil(added.length / 2)));
    }
  }

  // A trap unit's own attack detonates instead of dealing its (usually 0)
  // listed damage: an unavoidable 1-damage burst against every living
  // player-side unit, consuming the trap itself. Distinct from the melee-
  // death trigger in strike() below — this one fires from the trap's own
  // turn, not from someone killing it.
  function detonateSelf(state, actor, events, thrower) {
    actor.trapTriggered = true;
    emit(state, events, "trap", thrower ? actor.name + "被擲入我方陣中，當場自爆，波及我方全體。" : actor.name + "撲向我方時當場自爆，波及我方全體。", {actorId: actor.id, ...(thrower ? {thrown: true} : {})});
    for (const ally of state.units.filter(entry => entry.side === "player" && entry.hp > 0)) {
      damage(state, ally, 1, events, actor.id, "自爆波及", true);
    }
    const before = actor.hp;
    actor.hp = 0;
    if (before > 0) emit(state, events, "defeat", actor.name + " 倒下。", {targetId: actor.id});
  }

  // Rat king: free actions at the start of his own turn. They never consume his attack/skill and are skipped while
  // he is stunned (legalActions is empty then). Order: devour first (low HP), then throw one rat at the player side.
  function ratsAlive(state, king) {
    return state.units.filter(entry => entry.side === king.side && entry.trap && entry.hp > 0);
  }

  function kingRatPlay(state, king, rng, events, frames) {
    const rules = king.ratRules;
    if (!rules || king.hp <= 0 || king.statuses.stun > 0 || state.status !== "playing") return;
    let rats = ratsAlive(state, king);
    if (rats.length && king.hp <= rules.devourBelow) {
      const rat = rats[Math.floor(rng() * rats.length)];
      recordFrame(state, events, frames, "action", state.side, () => {
        rat.hp = 0;
        rat.trapTriggered = true;
        const before = king.hp;
        king.hp = Math.min(king.maxHp, king.hp + rules.heal);
        emit(state, events, "devour", king.name + " 吞下 " + rat.name + "，回復 " + (king.hp - before) + " 生命。", {actorId: king.id, targetId: rat.id, amount: king.hp - before});
      });
      rats = ratsAlive(state, king);
    }
    if (rats.length && state.status === "playing") {
      const rat = rats[Math.floor(rng() * rats.length)];
      recordFrame(state, events, frames, "action", state.side, () => {
        emit(state, events, "throw", king.name + " 抓起 " + rat.name + " 擲向我方。", {actorId: king.id, targetId: rat.id});
        detonateSelf(state, rat, events, king);
        checkOutcome(state, events);
      });
    }
  }

  // A fallen rat returns to the field every rules.respawnEvery enemy turns (the pool is the original rat units, so
  // the field can never exceed its starting count).
  function ratRespawn(state, events) {
    for (const king of state.units.filter(entry => entry.ratRules && entry.hp > 0)) {
      const rules = king.ratRules;
      rules.turns += 1;
      if (rules.turns % rules.respawnEvery !== 0) continue;
      const fallen = state.units.filter(entry => entry.side === king.side && entry.trap && entry.hp <= 0).slice(0, rules.respawnCount);
      for (const rat of fallen) {
        rat.hp = rat.maxHp;
        rat.trapTriggered = false;
        rat.attacked = false;
        rat.skillUsed = false;
        rat.statuses = {shadow: false, stun: 0, spirit: false, unityReadyTurn: null, resonance: null};
        emit(state, events, "summon", "新的" + rat.name + "從水晶裂縫爬了出來。", {targetId: rat.id});
      }
    }
  }

  function beginTurn(state, side, events) {
    state.side = side;
    const team = state.teams[side];
    team.turn += 1;
    emit(state, events, "turn", "第 " + state.round + " 回合・" + (side === "player" ? "我方" : "敵方") + "行動。");
    // Every living unit's scheduled tick belongs to the same start phase.
    // Do not end the battle midway through the unit array.
    for (const current of state.units.filter(entry => entry.side === side && entry.hp > 0)) {
      const resonance = current.statuses.resonance;
      if (!resonance || resonance.ticks <= 0) continue;
      damage(state, current, 1, events, resonance.sourceId, "共振彈持續傷害", false);
      resonance.ticks -= 1;
      if (resonance.ticks <= 0) current.statuses.resonance = null;
    }
    if (checkOutcome(state, events)) return;
    if (team.turn >= RULES.energy.firstGainTurn && team.energy < RULES.energy.max) {
      team.energy = Math.min(RULES.energy.max, team.energy + RULES.energy.gain);
      emit(state, events, "energy", (side === "player" ? "我方" : "敵方") + "暮晶 +1（" + team.energy + "/3）。", {amount: 1});
    }
    for (const current of state.units.filter(entry => entry.side === side && entry.hp > 0)) {
      current.attacked = false;
      current.skillUsed = false;
      current.coneUsed = false;
      if (current.statuses.unityReadyTurn === team.turn) {
        emit(state, events, "unity", current.name + " 的人劍合一已可用，保留至下一次普攻。", {actorId: current.id});
      }
      if (current.job === "swordsman" && !current.plain && current.hp > 0 && current.hp < 3 && !current.statuses.spirit) {
        current.statuses.spirit = true;
        emit(state, events, "spirit", current.name + " 取得武士魂：下一次普攻 +1。", {actorId: current.id});
      }
      if (current.statuses.stun > 0) emit(state, events, "stun", current.name + " 本回合暈眩，無法主動行動。", {targetId: current.id});
    }
  }

  function create(config) {
    config = config || {};
    const playerJob = config.player || "swordsman";
    const hero = unit({job: playerJob, name: config.heroName, portrait: config.heroPortrait}, "player", "hero", true);
    const units = [hero];
    const ids = new Set(["hero"]);
    function add(specs, side) {
      if (!Array.isArray(specs)) throw new TypeError("角色清單必須為陣列");
      specs.forEach((spec, index) => {
        if (!spec || typeof spec !== "object") throw new TypeError("角色設定無效");
        const id = spec.id === undefined ? (side === "player" ? "ally-" : "enemy-") + (index + 1) : spec.id;
        if (typeof id !== "string" || !id || ids.has(id)) throw new TypeError("角色 ID 必須唯一且非空：" + id);
        ids.add(id);
        units.push(unit(spec, side, id, false));
      });
    }
    add(config.allies === undefined ? [] : config.allies, "player");
    add(config.enemies === undefined ? [{id: "enemy", job: config.enemy || "tank"}] : config.enemies, "enemy");
    const originalObjective = config.objective || (config.mode === "surviveBoth50" ? {type: "survive", rounds: 50, requireBothAlive: true} : {type: "defeat"});
    if (!["defeat", "survive"].includes(originalObjective.type)) throw new TypeError("戰鬥目標無效");
    const objective = {type: originalObjective.type};
    if (objective.type === "survive") {
      objective.rounds = number(originalObjective.rounds, RULES.maxRounds, 1, "牽制回合", true);
      objective.requireBothAlive = originalObjective.requireBothAlive === true;
    }
    const maxRounds = number(config.maxRounds, objective.type === "survive" ? objective.rounds : RULES.maxRounds, 1, "回合上限", true);
    if (config.enemyPolicy !== undefined && !["standard", "restrained"].includes(config.enemyPolicy)) throw new TypeError("敵方策略無效");
    const state = {
      version: 1, round: 1, side: "player", status: "playing",
      name: config.name || "暮晶戰鬥", description: config.description || "",
      maxRounds, enemyPolicy: config.enemyPolicy || "standard",
      teams: {player: {energy: 0, turn: 0}, enemy: {energy: 0, turn: 0}},
      units, objective, log: [], events: []
    };
    if (config.heroTransform) hero.transformTo = JSON.parse(JSON.stringify(config.heroTransform));
    if (config.reinforce) {
      const r = config.reinforce;
      if (!Array.isArray(r.pool) || !r.pool.length) throw new TypeError("增援清單必須為非空陣列");
      const slots = units.filter(entry => entry.side === "enemy").map(entry => entry.id);
      state.reinforce = {goal: number(r.goal, slots.length, 1, "擊倒目標", true), kills: 0, size: slots.length, slots, pool: JSON.parse(JSON.stringify(r.pool)), next: 0, requireAwakened: r.requireAwakened === true};
    }
    beginTurn(state, "player", state.events);
    return state;
  }

  function legalActions(state, actorId) {
    if (!state || state.status !== "playing") return [];
    const actor = state.units.find(entry => entry.id === actorId);
    if (!actor || actor.side !== state.side || actor.hp <= 0 || actor.statuses.stun > 0) return [];
    const targets = state.units.filter(entry => entry.side !== actor.side && entry.hp > 0);
    const actions = [];
    if (!actor.attacked) {
      for (const target of targets) actions.push({type: "attack", actorId: actor.id, targetId: target.id});
    }
    if (actor.cone && !actor.coneUsed && state.teams[actor.side].energy >= actor.cone.cost && targets.length) actions.push({type: "cone", actorId: actor.id});
    const ability = actor.plain ? null : SKILLS[actor.job];
    if (actor.skillUsed || !ability || state.teams[actor.side].energy < ability.cost) return actions;
    if (actor.job === "assassin" && actor.statuses.shadow) return actions;
    if (actor.job === "swordsman" && actor.statuses.unityReadyTurn !== null) return actions;
    if (ability.target === "self") actions.push({type: "skill", actorId: actor.id});
    else for (const target of targets) actions.push({type: "skill", actorId: actor.id, targetId: target.id});
    return actions;
  }

  function attackDamage(state, actor) {
    let amount = actor.attack;
    if (actor.job === "swordsman") {
      if (actor.statuses.spirit) amount += 1;
      if (actor.statuses.unityReadyTurn !== null && actor.statuses.unityReadyTurn <= state.teams[actor.side].turn) amount += 1;
    }
    return amount;
  }

  function strike(state, actor, target, amount, ranged, events, rng, label) {
    if (target.statuses.shadow) {
      target.statuses.shadow = false;
      emit(state, events, "evade", target.name + " 以殘影閃避「" + label + "」，殘影消失。", {actorId: actor.id, targetId: target.id});
      const chance = target.counterChance === undefined ? RULES.shadowCounterChance : target.counterChance;
      if ((!ranged || target.counterChance >= 1) && (chance >= 1 || rng() < chance)) {
        emit(state, events, "counter", target.name + " 發動殘影反擊，直接扣對方生命 1。", {actorId: target.id, targetId: actor.id, amount: 1});
        damage(state, actor, 1, events, target.id, "殘影反擊", true);
      }
      return false;
    }
    damage(state, target, amount, events, actor.id, label, false);
    if (target.trap && !target.trapTriggered && target.hp <= 0) {
      target.trapTriggered = true;
      if (!ranged) {
        emit(state, events, "trap", target.name + "死亡瞬間自爆，波及近距離出手的" + actor.name + "。", {actorId: target.id, targetId: actor.id});
        damage(state, actor, 1, events, target.id, "自爆波及", true);
      }
    }
    return true;
  }

  function performAction(state, action, rng, events) {
    const actor = state.units.find(entry => entry.id === action.actorId);
    const target = action.targetId === undefined ? null : state.units.find(entry => entry.id === action.targetId);
    if (action.type === "attack") {
      actor.attacked = true;
      if (actor.trap) {
        emit(state, events, "attack", actor.name + " 撲向 " + target.name + "。", {actorId: actor.id, targetId: target.id, amount: 0});
        detonateSelf(state, actor, events);
        checkOutcome(state, events);
        return;
      }
      let amount = attackDamage(state, actor);
      if (actor.job === "swordsman") {
        actor.statuses.spirit = false;
        if (actor.statuses.unityReadyTurn !== null && actor.statuses.unityReadyTurn <= state.teams[actor.side].turn) actor.statuses.unityReadyTurn = null;
      }
      if (actor.job === "gunner") {
        actor.shots += 1;
        if (actor.shots >= RULES.criticalEvery) {
          actor.shots = 0;
          if (rng() < RULES.criticalChance) {
            amount += 1;
            emit(state, events, "critical", actor.name + " 第 4 次普攻爆擊，傷害 +1。", {actorId: actor.id, amount: 1});
          }
        }
      }
      emit(state, events, "attack", actor.name + " 對 " + target.name + " 普攻（" + amount + " 傷害）。", {actorId: actor.id, targetId: target.id, amount});
      strike(state, actor, target, amount, actor.job === "gunner", events, rng, "普通攻擊");
    } else if (action.type === "cone") {
      const cone = actor.cone;
      state.teams[actor.side].energy -= cone.cost;
      actor.coneUsed = true;
      emit(state, events, "skill", actor.name + " 使用「晶錐」，消耗 " + cone.cost + " 暮晶。", {actorId: actor.id, amount: cone.cost, skill: "cone"});
      for (const foe of state.units.filter(entry => entry.side !== actor.side && entry.hp > 0)) {
        if (state.status !== "playing") break;
        const hit = strike(state, actor, foe, cone.damage, true, events, rng, "晶錐");
        if (hit && foe.hp > 0 && cone.ticks > 0) {
          foe.statuses.resonance = {ticks: cone.ticks, sourceId: actor.id};
          emit(state, events, "resonance", foe.name + " 被晶錐的震盪擊中，接下來兩次回合開始各受 1 傷害。", {actorId: actor.id, targetId: foe.id, amount: cone.ticks});
        }
      }
    } else {
      const ability = SKILLS[actor.job];
      state.teams[actor.side].energy -= ability.cost;
      actor.skillUsed = true;
      emit(state, events, "skill", actor.name + " 使用「" + ability.name + "」，消耗 " + ability.cost + " 暮晶。", {actorId: actor.id, ...(target ? {targetId: target.id} : {}), amount: ability.cost});
      if (actor.job === "assassin") {
        actor.statuses.shadow = true;
      } else if (actor.job === "swordsman") {
        actor.statuses.unityReadyTurn = state.teams[actor.side].turn + 1;
      } else {
        const hit = strike(state, actor, target, 1, actor.job === "gunner", events, rng, ability.name);
        if (hit && target.hp > 0) {
          if (actor.job === "tank") {
            target.statuses.stun = 1;
            emit(state, events, "stun", target.name + " 將在下一次己方回合暈眩。", {actorId: actor.id, targetId: target.id});
          } else {
            target.statuses.resonance = {ticks: 2, sourceId: actor.id};
            emit(state, events, "resonance", target.name + " 接下來兩次回合開始各受共振傷害 1。", {actorId: actor.id, targetId: target.id, amount: 2});
          }
        }
      }
    }
    checkOutcome(state, events);
  }

  function framedAction(state, action, rng, events, frames) {
    recordFrame(state, events, frames, "action", state.side, () => performAction(state, action, rng, events));
  }

  function act(state, action, rng = Math.random) {
    const valid = action && legalActions(state, action.actorId).some(candidate =>
      candidate.type === action.type && candidate.actorId === action.actorId && candidate.targetId === action.targetId
    );
    if (!valid) return {ok: false, error: "目前無法執行此行動；請檢查回合、角色、目標與暮晶。", events: [], frames: []};
    if (typeof rng !== "function") return {ok: false, error: "隨機來源必須為函式。", events: [], frames: []};
    const events = [], frames = [];
    framedAction(state, action, rng, events, frames);
    state.events = events;
    return {ok: true, events, frames};
  }

  function finishSide(state, side, events) {
    for (const current of state.units.filter(entry => entry.side === side && entry.statuses.stun > 0)) {
      current.statuses.stun = 0;
      emit(state, events, "stun-end", current.name + " 的暈眩解除。", {targetId: current.id});
    }
  }

  function orderedTargets(state, actor, actions, type) {
    return actions.filter(action => action.type === type && action.targetId).map(action => ({
      action, target: state.units.find(entry => entry.id === action.targetId)
    })).sort((left, right) => {
      // A known shadow is publicly visible and cannot be a guaranteed kill.
      if (!!left.target.statuses.shadow !== !!right.target.statuses.shadow) return left.target.statuses.shadow ? 1 : -1;
      return (left.target.hp + left.target.shield) - (right.target.hp + right.target.shield);
    });
  }

  function runEnemy(state, rng, events, frames) {
    const restrained = state.enemyPolicy === "restrained";
    const actors = state.units.filter(entry => entry.side === "enemy");
    // H1 keeps the king centered visually, but his turn precedes the flanking rats.
    const kingIndex = actors.findIndex(entry => entry.id === "louis-armored" && entry.ratRules && entry.hp > 0);
    if (kingIndex > 0 && actors.some(entry => entry.trap && entry.hp > 0 && entry.id.startsWith("crystal-rat-"))) {
      actors.unshift(actors.splice(kingIndex, 1)[0]);
    }
    for (const actor of actors) {
      if (state.status !== "playing") break;
      kingRatPlay(state, actor, rng, events, frames);
      if (state.status !== "playing") break;
      let actions = legalActions(state, actor.id);
      if (!actions.length) continue;
      // Take a certain kill before spending a shared resource.
      if (!restrained) {
        const lethal = orderedTargets(state, actor, actions, "attack").find(({target}) =>
          !target.statuses.shadow && target.hp + target.shield <= attackDamage(state, actor)
        );
        if (lethal) framedAction(state, lethal.action, rng, events, frames);
      }
      if (state.status !== "playing") break;
      actions = legalActions(state, actor.id);
      const abilities = actions.filter(action => action.type === "skill");
      if (abilities.length) {
        let ability = null;
        if (SKILLS[actor.job].target === "self") {
          ability = abilities[0];
        } else if (!restrained) {
          const targets = orderedTargets(state, actor, abilities, "skill");
          if (actor.job === "tank") {
            ability = (targets.find(({target}) => !target.statuses.shadow && target.hp + target.shield <= 1)
              || targets.filter(({target}) => !target.statuses.stun && !target.statuses.shadow).sort((a, b) => b.target.attack - a.target.attack)[0]
              || targets[0]).action;
          } else ability = targets[0].action;
        }
        if (ability) framedAction(state, ability, rng, events, frames);
      }
      if (state.status !== "playing") break;
      actions = legalActions(state, actor.id);
      const targets = orderedTargets(state, actor, actions, "attack");
      const choice = restrained ? targets.find(({target}) => {
        const maximumDamage = attackDamage(state, actor) + (actor.job === "gunner" && actor.shots === 3 ? 1 : 0);
        return !target.statuses.shadow && target.hp - Math.max(0, maximumDamage - target.shield) >= 3;
      }) : targets[0];
      if (choice) framedAction(state, choice.action, rng, events, frames);
    }
  }

  function endTurn(state, rng = Math.random) {
    if (!state || state.status !== "playing" || state.side !== "player") return {ok: false, error: "目前無法結束我方回合。", events: [], frames: []};
    if (typeof rng !== "function") return {ok: false, error: "隨機來源必須為函式。", events: [], frames: []};
    const events = [], frames = [];
    recordFrame(state, events, frames, "turn-end", "player", () => finishSide(state, "player", events));
    recordFrame(state, events, frames, "turn-start", "enemy", () => beginTurn(state, "enemy", events));
    if (state.status === "playing") runEnemy(state, rng, events, frames);
    if (state.status === "playing") {
      recordFrame(state, events, frames, "turn-end", "enemy", () => {
        finishSide(state, "enemy", events);
        ratRespawn(state, events);
        reinforceWave(state, events);
        if (state.objective.type === "survive" && state.round >= state.objective.rounds) {
          finish(state, events, "won", "完成 " + state.objective.rounds + " 個完整回合的牽制目標。");
        } else if (state.round >= state.maxRounds) {
          finish(state, events, "draw", "已達 " + state.maxRounds + " 個完整回合，平手，可重試。");
        }
      });
      if (state.status === "playing") {
        recordFrame(state, events, frames, "turn-start", "player", () => {
          state.round += 1;
          beginTurn(state, "player", events);
        });
      }
    }
    state.events = events;
    return {ok: true, events, frames};
  }

  // Attack value the unit would deal right now (includes 人劍合一 and 武士魂 bonuses); for display.
  return Object.freeze({create, legalActions, act, endTurn, skill, skillFor, cone: entry => entry && entry.cone ? {...CONE, cost: entry.cone.cost} : null, attackValue: attackDamage, RULES});
});
