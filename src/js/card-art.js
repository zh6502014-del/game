/* Static local art catalog; identity and special-card mapping are independent of rules. */
window.ND_CARD_ART=Object.freeze(Object.fromEntries([
 ['attack','攻擊','attack','basic'],['defense','防禦','defense','basic'],['dodge','閃躲','dodge','basic'],
 ['swordsman','斬擊','slash','class'],['tank','護盾','shield','class'],['assassin','閃擊','flash','class'],['gunner','爆擊','critical','class'],
 ['spirit','劍氣出竅','spirit','special'],['domain','領域展開','domain','special']
].map(([key,label,icon,category])=>[key,Object.freeze({key,label,icon,category,src:key==='gunner'?'assets/story/actors/gun-unify/gunner-card.webp':`assets/cards/${category==='basic'?'basic-v2/':''}${key}.webp`,position:category==='basic'?'50% 50%':'50% 28%',...(category==='basic'?{fit:'contain'}:{})})])));
