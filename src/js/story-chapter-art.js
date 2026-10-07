/* STORY-ART-020: presentation-only assets. Consumers retain story reveal timing. */
(()=>{
 'use strict';
 const catalog={
  "version": 1,
  "chapters": {
    "A1": {
      "path": "assets/story/chapters-020/a1.webp",
      "title": "研究室對峙",
      "objectPosition": "50% 50%",
      "artId": "assassin-lab"
    },
    "A3": {
      "path": "assets/story/chapters-020/a3.webp",
      "title": "尺烏據點清洗",
      "objectPosition": "50% 50%",
      "artId": "assassin-home"
    },
    "S1": {
      "path": "assets/story/narva-025/swordsman-bookmark.webp",
      "title": "鐘樓贈書籤",
      "objectPosition": "50% 50%",
      "artId": "swordsman-bookmark"
    },
    "S2": {
      "path": "assets/story/narva-025/swordsman-records.webp",
      "title": "核對未撤離城市",
      "objectPosition": "50% 50%",
      "artId": "swordsman-records"
    },
    "S3": {
      "path": "assets/story/narva-025/swordsman-master.webp",
      "title": "擋住伊藤掩護逃亡",
      "objectPosition": "50% 50%",
      "artId": "swordsman-master"
    },
    "T1": {
      "path": "assets/story/chapters-020/t1.webp",
      "title": "暮鐘提前與撤離",
      "objectPosition": "50% 50%",
      "artId": "tank-bell"
    },
    "T2": {
      "path": "assets/story/chapters-020/t2.webp",
      "title": "折返接應母女",
      "objectPosition": "50% 50%",
      "artId": "tank-return"
    },
    "T3": {
      "path": "assets/story/chapters-020/t3.webp",
      "title": "第一面盾崩裂前的救援",
      "objectPosition": "50% 50%",
      "artId": "tank-shield"
    },
    "E1": {
      "path": "assets/story/chapters-020/e1.webp",
      "title": "聽見女孩殘響",
      "objectPosition": "50% 50%",
      "artId": "gunner-echo"
    },
    "E2": {
      "path": "assets/story/chapters-020/e2.webp",
      "title": "地下三層取回資料",
      "objectPosition": "50% 50%",
      "artId": "gunner-basement"
    },
    "E3": {
      "path": "assets/story/chapters-020/e3.webp",
      "title": "第一槍逃離",
      "objectPosition": "50% 50%",
      "artId": "gunner-first-shot"
    },
    "P1": {
      "path": "assets/story/complete-020/chapters/p1-morwell-ruins.webp",
      "title": "莫爾威爾廢墟抱起嬰兒",
      "objectPosition": "50% 50%",
      "artId": "p1-morwell-ruins"
    },
    "P3": {
      "path": "assets/story/complete-020/chapters/farewell-outskirts.webp",
      "title": "郊區送別",
      "objectPosition": "50% 50%",
      "artId": "farewell-outskirts"
    },
    "B1": {
      "path": "assets/story/complete-020/chapters/b1-shuo-wolves.webp",
      "title": "朔擊退晶狼",
      "objectPosition": "50% 50%",
      "artId": "b1-shuo-wolves"
    },
    "C4": {
      "path": "assets/story/complete-020/chapters/c4-archive-meeting.webp",
      "title": "文件庫相遇",
      "objectPosition": "50% 50%",
      "artId": "c4-archive-meeting"
    },
    "C5": {
      "path": "assets/story/complete-020/chapters/c5-eve-gun-rin.webp",
      "title": "伊芙舉槍質問",
      "objectPosition": "50% 50%",
      "artId": "c5-eve-gun-rin"
    },
    "C8": {
      "path": "assets/story/complete-020/chapters/mine-recorder.webp",
      "title": "礦坑",
      "objectPosition": "50% 50%",
      "artId": "mine-recorder"
    },
  },
  "actors": {
    "father-wounded": {
      "id": "father-wounded",
      "name": "納爾瓦",
      "state": "wounded",
      "path": "assets/story/actors/narva-025/father-wounded.webp"
    }
  },
  "backgrounds": {
  },
  "props": {
    "relay-documents": {
      "id": "relay-documents",
      "title": "中繼站文書",
      "path": "assets/story/complete-020/props/relay-documents.webp"
    },
    "relay-plan": {
      "id": "relay-plan",
      "title": "站內平面圖",
      "path": "assets/story/complete-020/props/relay-plan.webp"
    },
    "relay-device": {
      "id": "relay-device",
      "title": "腕部裝置",
      "path": "assets/story/complete-020/props/relay-device.webp"
    }
  }
};
 catalog.byArtId=Object.fromEntries(Object.values(catalog.chapters).map(chapter=>[chapter.artId,chapter]));
 function freeze(value){if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
 window.NDStoryChapterArt=freeze(catalog);
})();
