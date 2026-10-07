/* STORY-SECOND-BELL-021: rescue, local shutdown, and second-bell continuation. Stable original IDs remain intact. */
(() => {
  'use strict';
  const chapters = [
    {
      "id": "D2",
      "title": "另一個磷的警告",
      "background": "road",
      "evidence": [
        [
          "未來磷的警告",
          "女子自稱未來磷，口述過往分支的風險；已安排本輪查證，沒有把口述當成現況。"
        ],
        [
          "北側中繼",
          "納爾瓦說明自己被帶到北側中繼站，並由這名女子帶出；站內仍有居民與工人被關押。"
        ]
      ],
      "steps": [
        {
          "type": "narration",
          "frame": 0,
          "text": "納爾瓦與一名女子在五人面前停下，兩個人都在喘氣。女子手腕上的裝置裂損，衣袖下有舊傷。",
          "id": "D2-step-01"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "納爾瓦",
          "text": "磷！妳沒事就好。先離開坑道口，它們還會回來。",
          "id": "D2-reunion-01"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "磷",
          "text": "爸爸……你去哪裡了？我聽了你的錄音，它只錄到一半。",
          "id": "D2-reunion-02"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "納爾瓦",
          "text": "冥淵追到坑道口，我把它們引開，後來被巡邏隊帶去北側中繼站。是她把我帶出來的。",
          "id": "D2-reunion-03"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "納爾瓦",
          "text": "那裡還有人被關著。有的是居民，有的是被扣下的工人。",
          "id": "D2-reunion-04"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "納爾瓦",
          "text": "她說她知道怎麼進去，我沒有理由不信。先聽她說。",
          "id": "D2-reunion-05"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "未來磷",
          "text": "我叫磷。我是長大以後的妳。妳現在不用先相信這一句，但請先聽危險在哪裡。",
          "id": "D2-step-02"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "未來磷",
          "text": "我走過的分支裡，裡面的人沒能全部出來。切掉主供能可能接上備援；提早預警，也可能讓守衛提早封門。管線還相連時，不要砸控制器。這些都是過去的經驗，現在還要查。",
          "id": "D2-step-03"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "磷握住自己袋中的書籤。女子沒有伸手索取，也不要求她立刻共振。",
          "id": "D2-step-04"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "未來磷",
          "text": "我來和妳把人帶出來。妳有想救的人，我也是。",
          "id": "D2-step-05"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "（由後段對話取代）",
          "id": "D2-step-06"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "眾人由納爾瓦帶路離開觀測區，循舊輸電線來到北側中繼站外圍。凜沿當下可見的纜線查去；格蘭與朔勘查接應和出口，伊芙記下尚待確認的供能環節。",
          "id": "D2-step-07"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "未來磷",
          "text": "舊機房在後面。只是以前如此。",
          "id": "D2-step-08"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "磷",
          "text": "那就一起看。",
          "id": "D2-step-09"
        },
        {
          "type": "complete",
          "frame": 2,
          "text": "收錄這段記憶，保存本節點進度。",
          "id": "D2-step-10"
        }
      ]
    },
    {
      "id": "D3",
      "title": "養父這次把去向說清楚",
      "background": "hall",
      "evidence": [
        [
          "留置與接應",
          "留置簿記著近期被扣的居民與工人；側門接應後，納爾瓦與磷一同見到仍被關押的人，納爾瓦說要回去接人。"
        ]
      ],
      "steps": [
        {
          "type": "narration",
          "frame": 0,
          "text": "納爾瓦說出北側中繼的側門與看守室的位置，凜循著他給的路線找到看守室資料。留置簿上有近期被扣的居民與工人，登記地點都是北側中繼。",
          "id": "D3-step-01"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "磷",
          "text": "這次，我們知道要找的人在哪一排了嗎？",
          "id": "D3-step-02"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "朔",
          "text": "記錄吻合。先看人還在不在。",
          "id": "D3-step-03"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "格蘭在側門安排接應，朔確認路線；凜觀察換班間隙，準備開鎖。",
          "id": "D3-step-04"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "（由後段對話取代）",
          "id": "D3-step-05"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "門後，一名腿傷工人靠著牆坐著。納爾瓦先上前扶住他，磷站在他身後，沒有再說話。",
          "id": "D3-step-06"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "納爾瓦",
          "text": "他們輪流把人帶去問話，問完又送回來。我不是最後一個被問的。",
          "id": "D3-step-07"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "納爾瓦",
          "text": "我問能不能帶一句平安出去。他們先問，要送給誰。我不能把妳也交出去。",
          "id": "D3-step-08"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "站內核對之後才確認，被扣下的東西裡，有納爾瓦另帶的那批資料；納爾瓦原本交給磷的文件仍在她身上。",
          "id": "D3-step-09"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "納爾瓦",
          "text": "先把這個人送出去。裡面還有人，我要回去接。妳在能收到回報的地方等；我去哪裡，這次都說清楚。",
          "id": "D3-step-10"
        },
        {
          "type": "complete",
          "frame": 2,
          "text": "收錄這段記憶，保存本節點進度。",
          "id": "D3-step-11"
        }
      ]
    },
    {
      "id": "D4",
      "title": "她記得那些來不及的腳步",
      "background": "hall",
      "evidence": [
        [
          "居民與分工",
          "本次移夜目標與近期居民回報相符；六人救援分工已安排，非已完成隔離。"
        ]
      ],
      "steps": [
        {
          "type": "narration",
          "frame": 0,
          "text": "控制站的移夜控制器正在倒數；倒數結束，夜就會沿供能管線送到目標地區——居民回報顯示，那裡仍有人生活，沒有撤完。",
          "id": "D4-step-01"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "磷",
          "text": "他們知道有人，還是要把夜送過去？",
          "id": "D4-step-02"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "伊芙",
          "text": "所以要阻止。控制器不是供能本身，先把相連的危險拆開。",
          "id": "D4-step-03"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "未來磷",
          "text": "我先帶走過妳。養父還是回去救人，出口卻沒有足夠的人接。",
          "id": "D4-step-04"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "未來磷",
          "text": "我和伊芙切過主供能，備援接了上來；尺烏的人還沒來得及查清另一段。我也提早發過警告，格蘭開始接人，門卻提早關了。朔一直對門後的人說話。",
          "id": "D4-step-05"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "未來磷",
          "text": "他們都在。是每次我們做了不同的事，現場也跟著變。我沒有一張照著走就能救完人的表。",
          "id": "D4-step-06"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "（由後段對話取代）",
          "id": "D4-step-07"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "養父送第一名腿傷工人去接應處，回頭指給磷看她能報位的位置。",
          "id": "D4-step-08"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "磷",
          "text": "我要知道每個人到哪裡了。",
          "id": "D4-step-09"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "格蘭",
          "text": "妳報位置，我記收到的名字。沒收到，就不能劃掉。",
          "id": "D4-step-10"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "眾人按方案分開，各自前往要守住的位置。格蘭收好接應名單，準備把警告送出去。",
          "id": "D4-step-11"
        },
        {
          "type": "complete",
          "frame": 2,
          "text": "收錄這段記憶，保存本節點進度。",
          "id": "D4-step-12"
        }
      ]
    },
    {
      "id": "D5",
      "title": "第一下已經落了下去",
      "background": "hall",
      "evidence": [
        [
          "報位",
          "養父在牆邊守著跌倒的工人；另一名工人在欄杆左側；發亮管線尚不可跨越。已報位，不等於接收。"
        ]
      ],
      "steps": [
        {
          "type": "narration",
          "frame": 0,
          "text": "預警送出後，站方提早封鎖並啟動。朔守住外側出口，改動後的內門卻把眾人分開。凜正趕往備援，未來磷在供能室協助伊芙，主供能仍未隔離。",
          "id": "D5-step-01"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "磷看見移夜標示亮起，想到仍在目標地區的人，情急揮下工具。控制器裂開，能量沿未隔離管線回流。",
          "id": "D5-step-02"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "養父已交出第一名傷者，折返拉起跌倒的工人；第一波回流撞在牆上，把那名工人震倒，養父伸手護住他。",
          "id": "D5-step-03"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "磷再度舉起工具。伊芙守住已隔離的側支；未來磷聽見異響，鑽過內門空隙趕來，一片薄晶擋下第二下。",
          "id": "D5-step-04"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "磷",
          "text": "所以妳回來，就是要我停手？",
          "id": "D5-step-05"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "未來磷",
          "text": "我回來，是想和妳把人救出去。",
          "id": "D5-step-06"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "磷",
          "text": "妳以前也這樣說過嗎？",
          "id": "D5-step-07"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "未來磷",
          "text": "說過。這次，我們把該怎麼做都說清楚。",
          "id": "D5-step-08"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "未來磷",
          "text": "妳看得到維修區。告訴我們人在哪、哪裡不能走。伊芙隔離主供能，尺烏的人處理備援。我只能替這一小段爭取片刻。",
          "id": "D5-step-09"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "磷放下工具，望向牆邊被震倒的工人，和守在他身旁的養父。她把手握緊，開始辨認他們身旁還有哪些人。",
          "id": "D5-step-10"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "（由後段對話取代）",
          "id": "D5-step-11"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "磷",
          "text": "養父在牆邊，守著跌倒的工人。另一個人在欄杆左側。別跨發亮的線。",
          "id": "D5-step-12"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "朔",
          "text": "聽見了。我守著出口。",
          "id": "D5-step-13"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "未來磷往她指出的方向支起薄晶，守住那一小段通路，等候伊芙與接應者的回報。",
          "id": "D5-step-14"
        },
        {
          "type": "complete",
          "frame": 2,
          "text": "收錄這段記憶，保存本節點進度。",
          "id": "D5-step-15"
        }
      ]
    },
    {
      "id": "D6",
      "title": "這次每一個人都在回答",
      "background": "hall",
      "evidence": [
        [
          "指定通路接應",
          "備援與主供能隔離、複測、三位待救者接收及走廊回查完成。傷者仍待轉送；非全站清空。"
        ]
      ],
      "steps": [
        {
          "type": "narration",
          "frame": 0,
          "text": "凜找到本次強制啟動工令，對照實際接線；伊芙仍盯著供能室的讀數。",
          "id": "D6-step-01"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "凜",
          "text": "我鎖住這端。妳那邊收到確認再往下做。",
          "id": "D6-step-02"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "未來磷",
          "text": "這片晶只能穩住走廊這一段。能走之後，請讓他們一個一個過。",
          "id": "D6-step-03"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "格蘭",
          "text": "人要先報到，我才算到達。",
          "id": "D6-step-04"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "（由後段對話取代）",
          "id": "D6-step-05"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "最後一人交到接應者手中，未來磷的手開始發抖。",
          "id": "D6-step-06"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "磷",
          "text": "伊芙說過，不舒服就停。妳也可以說。",
          "id": "D6-step-07"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "未來磷",
          "text": "好。我停。",
          "id": "D6-step-08"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "伊芙確認通路無人後切斷最後局部連結，朔扶住未來磷。格蘭護著擔架上的傷者撤出。",
          "id": "D6-step-09"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "連鎖崩潰被阻止，這段通路的人終於撤出。傷者仍需救治；格蘭的名單上，遠方撤離的接收欄還空著。",
          "id": "D6-step-10"
        },
        {
          "type": "complete",
          "frame": 2,
          "text": "收錄這段記憶，保存本節點進度。",
          "id": "D6-step-11"
        }
      ]
    },
    {
      "id": "D7",
      "title": "留下來的人",
      "background": "road",
      "evidence": [
        [
          "轉送交接卡",
          "幼磷知道救護去向與回報安排；接收仍待確認。未來磷表示留下，當下沒有再啟動裝置。"
        ]
      ],
      "steps": [
        {
          "type": "narration",
          "frame": 0,
          "text": "接應者先處理傷者，準備轉送。格蘭把回報分開擺：「這些收到預警了；這些還沒說撤完。不能放在一起算。」",
          "id": "D7-step-01"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "磷",
          "text": "是我先砸的控制器。",
          "id": "D7-step-02"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "納爾瓦",
          "text": "妳是想攔下移夜，我知道。那波回流傷到了人；後來妳報的位置，也把人帶了出來。兩件事都要記住。",
          "id": "D7-step-03"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "未來磷沒有打開裝置。她說，回溯不會消掉已留下的世界，記憶、傷勢和耗損也不會重置。磷看著她，還有許多事情沒有問。",
          "id": "D7-step-04"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "未來磷",
          "text": "我留下來。爸爸還在這裡。",
          "id": "D7-step-05"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "（由後段對話取代）",
          "id": "D7-step-06"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "伊芙收起本次移夜計畫的核對記錄，凜交出強制啟動工令的副本。她們逐件註明來源與保管人，把抄件和原件分清。",
          "id": "D7-step-07"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "納爾瓦被迫在中繼站讀過這批校準資料，不是第一次看——他答應幫忙繼續查；眾人還要查誰決定把有人居住的地方列為犧牲區。",
          "id": "D7-step-08"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "磷把寫有去向的交接卡收好。未來磷合上裂損裝置的護蓋，跟著撤離的隊伍往前走。",
          "id": "D7-step-09"
        },
        {
          "type": "complete",
          "frame": 2,
          "text": "收錄這段記憶，保存本節點進度。",
          "id": "D7-step-10"
        }
      ]
    },
    {
      "id": "F1",
      "title": "警告與兩份名單",
      "background": "shelter",
      "evidence": [
        [
          "博士警告與王室委託",
          "警告來自博士的研究聯絡管道；中繼站委託附件列路易斯要求研發頭戴裝置，未提供完成驗收結果。"
        ],
        [
          "當前命令與回報",
          "本地強制啟動已阻止，最後通路仍可接應；命令原件及副本分別保管，未裁定所有舊案責任。"
        ]
      ],
      "steps": [
        {
          "type": "narration",
          "frame": 0,
          "text": "納爾瓦請伊芙把中繼站抄件放到桌上。他指向附有來源欄的委託附件，再取出研究聯絡管道留下的警告抄錄。",
          "id": "F1-warning-01"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "納爾瓦",
          "text": "這封警告，是赫爾曼透過研究聯絡人送出的。他說，繼續把裝置接進暮鐘，可能引起災難。",
          "id": "F1-warning-02"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "伊芙",
          "text": "這份王室附件，和警告是一起送來的？",
          "id": "F1-warning-03"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "納爾瓦",
          "text": "不是。被關進中繼站以後，他們要我辨讀鳴者的校準資料，我才見到這份。我記得它的欄位，你們帶出的抄件也能對上。",
          "id": "F1-warning-04"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "委託附件指向國王路易斯要求研製的「暮晶頭戴裝置」：以能量連結暮鐘，集中調度夜域的操作。附件列出委託，沒有本次完成驗收的結果。",
          "id": "F1-warning-05"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "磷",
          "text": "戴著它的人，就可以決定夜要去哪裡？",
          "id": "F1-warning-06"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "納爾瓦",
          "text": "那是他想要的權力。裝置現在做到哪一步，我不知道。博士最後有沒有停下來，我也沒見到。",
          "id": "F1-warning-07"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "伊芙",
          "text": "警告和委託各留一份來源。我們不能拿委託當作完成證明；先核對眼前能接上的暮鐘和管線。",
          "id": "F1-warning-08"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "未來磷站在桌尾，聽完這段交談，沒有補充。",
          "id": "F1-warning-09"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "比對博士警告與王室委託，確認來源及能支持的範圍。",
          "label": "核對警告與委託 →",
          "id": "F1-royal-warning"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "中繼站記錄指向幕城本次移夜的接收與執行流程。伊芙整理能核實的欄位，缺頁仍留白。眾人沿流程找到負責本座鐘的調度端，尚不知道裝置是否完成。",
          "id": "F1-step-05"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "渡垣勘查現階段風險較低的接收地，格蘭已安排照護家庭與工坊分批先行。城裡有人支持停鐘，也有人害怕失去機器、住處與收入。",
          "id": "F1-step-06"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "眾人帶著接收安排進入調度室。桌上一份是城內未搬走的設備清單，另一份是外部目標仍有人居住的回報。",
          "id": "F2-step-01"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "調度負責人",
          "text": "我保住過這座城。機器、醫館、糧庫都在這裡。停了，明年誰給他們飯？",
          "id": "F2-step-02"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "伊芙",
          "text": "所以我們先談工具、糧食和醫療。接收安排在這裡，最後一隊還在路上。",
          "id": "F2-step-03"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "磷",
          "text": "外面那張名單的人，知道你要把夜送給他們嗎？",
          "id": "F2-step-04"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "調度負責人",
          "text": "妳知道替一座城作決定，要失去多少？",
          "id": "F2-step-05"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "磷",
          "text": "我知道弄壞一個東西會傷人。我爸爸才剛從關人的地方走出來。所以這次先接人，再確認怎麼停。",
          "id": "F2-step-06"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "核對當前資料與具名接收回報，再確認下一步。",
          "id": "F2-step-07"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "未來磷",
          "text": "我們能證明這一次還有人在路上。先把時間還給他們。",
          "id": "F2-step-08"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "調度負責人",
          "text": "我的命令不撤。",
          "id": "F2-step-09"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "內門重新鎖閉，傳令者攜來提前啟動要求。凜攔住傳令，對照本次工令，扣住本地已查明的強制啟動控制。",
          "id": "F2-step-10"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "凜",
          "text": "先把手離開。這道命令和它會送到哪裡，都要留下。",
          "id": "F2-step-11"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "朔",
          "text": "出口留給還沒出來的人。",
          "id": "F2-step-12"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "已同意維持撤離的值守人員接管通路，將發令者與控制端分開。原件和命令副本分開保管，責任後續逐項核對，不在鐘室宣判所有舊案。",
          "id": "F2-step-13"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "核對當前資料與具名接收回報，再確認下一步。",
          "id": "F2-step-14"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "王室附件列有接入欄位，本地圖卻沒有對應細目。伊芙把差異圈起來；未來磷指向眼前作業端，說先完成這裡的隔離。",
          "id": "F2-control-note"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "伊芙",
          "text": "先別動機件。格蘭，最後一隊在哪？",
          "id": "F2-step-15"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "格蘭",
          "text": "照護車卡在坡道，護送隊正在推。接收端還沒回報。",
          "id": "F2-step-16"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "鐘室的人留在原位，等外面的人走完那一段路。",
          "id": "F2-step-17"
        },
        {
          "type": "complete",
          "frame": 2,
          "text": "收錄這段記憶，保存本節點進度。",
          "id": "F2-step-18"
        }
      ]
    },
    {
      "id": "F4",
      "title": "鐘聲暫歇",
      "background": "tower",
      "evidence": [
        [
          "本次撤離及設備確認",
          "本次城內平民與清查人員接收已核實，負載隔離、備援解除、複測及機件固定完成。"
        ],
        [
          "撤離後的本地停機",
          "居民接收已完成，本地操縱與現場備援停止；引域核心保留。王室委託未結案。"
        ]
      ],
      "steps": [
        {
          "type": "narration",
          "frame": 0,
          "text": "最後照護車的輪軸卡住，護送隊協力推上勘查過的坡道。朔守鐘塔內圈出口，接應最後清查人員。",
          "id": "F3-step-01"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "未來磷",
          "text": "我只能讓這一小段干擾緩下來，讀值穩了，再照現場順序繼續動作。",
          "id": "F3-step-02"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "伊芙",
          "text": "先核實人，再隔離負載。現在還不能拆。",
          "id": "F3-step-03"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "核對當前資料與具名接收回報，再確認下一步。",
          "id": "F3-step-04"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "核對當前資料與具名接收回報，再確認下一步。",
          "id": "F3-step-05"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "伊芙",
          "text": "眼前這端的負載與備援已確認，工作區可以操作。核心仍留在支架裡；這次先停本地操縱，讓人退出去。",
          "id": "F3-step-06"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "磷站在確認安全的側台。伊芙指給她看外部連桿的定位栓；操作員接手承重和主斷路，伊芙留在磷身旁，等各處確認就緒。",
          "id": "F3-step-07"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "伊芙",
          "text": "妳可以和我一起，也可以在那邊看。我們都能完成它。",
          "id": "F3-step-08"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "磷",
          "text": "我想一起。等妳說可以。",
          "id": "F3-step-09"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "核對當前資料與具名接收回報，再確認下一步。",
          "label": "和伊芙共同完成本地停機 →",
          "id": "F4-step-01"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "伊芙",
          "text": "現在可以。一起。",
          "id": "F4-step-02"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "操作員固定停止的機構，磷與伊芙一同拔下本地操縱端的定位栓。操作員拆下這一端的控制耦合件，傳動停了，現場備援也維持隔離。引域核心仍留在鐘塔內，鐘聲確實沉寂下來。",
          "id": "F4-step-03"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "磷",
          "text": "它真的停了。",
          "id": "F4-step-04"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "未來磷",
          "text": "是。我們該跟上外面的人了。",
          "id": "F4-step-05"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "夜域沒有消失。居民已交到坡道下方的接收點，眾人沿預留路線走出鐘室，到了居民已抵達的接收點；其他城市的鐘並未因此停止，手中的王室委託也還要繼續查。",
          "id": "F4-step-06"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "接收地的會議吵了很久。配糧與搬不走的機具仍有爭執，格蘭把已履行、尚欠和做不到的承諾分開記下。居民沒有返回鐘塔。",
          "id": "F4-step-07"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "格蘭",
          "text": "照護已接上，下一批糧還在路上。缺的留在表上，明天繼續追。",
          "id": "F4-step-08"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "命令、見證與保管來源留下，讓相關的人能繼續接受核對。凜也向伊芙補錄研究室的經過；新事件沒有替她抹去舊行動，同行仍不是原諒。",
          "id": "F4-step-09"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "伊芙",
          "text": "我會把妳說的和讀值放在一起記下來。查不到證據的地方，就留白，不替妳認定。",
          "id": "F4-step-10"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "凜",
          "text": "好。",
          "id": "F4-step-11"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "未來磷在接收地的桌旁把裝置收好，沒有再次啟動。舊傷沒有消失，她也沒有再談那份王室委託。",
          "id": "F4-step-15"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "磷",
          "text": "妳不走了？",
          "id": "F4-step-16"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "未來磷",
          "text": "我會留下。還有事情沒有做完。",
          "id": "F4-step-17"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "朔把下一段護送路線放在桌上，格蘭核對工作人員撤回的名單。磷抬頭望向鐘聲曾響起的方向。",
          "id": "F4-step-18"
        },
        {
          "type": "complete",
          "frame": 2,
          "text": "收錄這段記憶，繼續追查尚未解答的線索。",
          "id": "F4-step-19"
        }
      ]
    },
    {
      "id": "G1",
      "title": "第二次鐘響",
      "background": "tower",
      "evidence": [
        [
          "本地停機仍有效",
          "F4停機紀錄與現地回查相符，本地鎖定與隔離仍在。"
        ],
        [
          "獨立遠端命令",
          "新命令經王室授權的另一條路徑抵達，未經被扣住的本地操縱端。"
        ],
        [
          "既存供能重接",
          "現地讀值與留存管線相符，既存供能接回仍完整的引域核心。"
        ],
        [
          "未來磷承認早知",
          "完成查證後，未來磷親口承認停鐘以前已知道另一條控制仍在；尚未解釋理由。"
        ]
      ],
      "steps": [
        {
          "type": "narration",
          "frame": 0,
          "text": "停用範圍只到本地操縱端與現場備援：居民確已撤離，鐘聲也確實停了，引域核心仍留在塔內。路易斯委託頭戴裝置的下落，還沒有查清。",
          "id": "G1-step-01"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "接收點的紀錄還沒收起，鐘聲又從塔頂傳來。磷先抬頭，格蘭立即透過接應線請現地值守者回查。眾人留在接收點，沒有返回鐘室；已撤走的居民也沒有被叫回。",
          "id": "G1-step-02"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "磷",
          "text": "不是已經停了嗎？",
          "id": "G1-step-03"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "伊芙",
          "text": "先看回報。別讓人往鐘塔裡跑。",
          "id": "G1-step-04"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "同一時間，王室控制室裡，路易斯一直留著這條遠端備援——本地操縱一斷，指示燈隨即轉暗，他立刻戴上完成的暮晶頭戴裝置，指示沿備援線路送出。",
          "id": "G1-step-05",
          "royalCutaway": true
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "路易斯",
          "text": "本地操縱停了。接通另一條控制。",
          "id": "G1-step-06",
          "royalCutaway": true
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "既存供能重新送入未被毀去的引域核心。鏡頭回到接收地。眾人先等到第一輪現地回查：本地操縱端仍鎖定，原停機紀錄有效。朔沿已確認的接應線再索取受令與供能紀錄；過了一段等候時間，第二輪抄報送到，伊芙才把三份來源攤齊。",
          "id": "G1-step-07"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "凜",
          "text": "停機以後的命令，和我們當時扣下的那一份分開對。",
          "id": "G1-step-08"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "未來磷沒有問鐘聲從哪裡來。磷看了她一眼，先跟著伊芙讀資料。",
          "id": "G1-step-09"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "核對本地停機、遠端受令與供能三份來源，確認第二次鐘響如何發生。",
          "label": "核對三份紀錄 →",
          "id": "G1-step-10"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "伊芙",
          "text": "我們關掉的是眼前這一端。另一條控制仍在，供能也沒有消失。",
          "id": "G1-step-11"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "凜",
          "text": "這份新命令沒有經過被我們扣住的控制。不是原來那個人偷偷把手伸回去了。",
          "id": "G1-step-12"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "磷",
          "text": "妳剛才聽見鐘聲，沒有問怎麼會這樣。",
          "id": "G1-step-13"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "未來磷看著那張遠端受令紀錄，沒有回答。",
          "id": "G1-step-14"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "磷",
          "text": "妳早就知道，這裡停了，它還能再響？",
          "id": "G1-step-15"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "未來磷",
          "text": "我知道這條控制還在。",
          "id": "G1-step-16"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "伊芙",
          "text": "在我們停鐘以前？",
          "id": "G1-step-17"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "未來磷",
          "text": "是。",
          "id": "G1-step-18"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "磷",
          "text": "那妳為什麼不說？",
          "id": "G1-step-19"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "未來磷的手停在裝置護蓋上。鐘聲再度越過接收地，沒有人把三份紀錄收起來。",
          "id": "G1-step-20"
        },
        {
          "type": "complete",
          "frame": 2,
          "text": "收錄這段記憶。第二次鐘響——待續。",
          "id": "G1-step-21"
        }
      ]
    },
    {
      "id": "H1",
      "title": "移夜之主",
      "background": "road",
      "evidence": [
        [
          "王室控制室的陷阱",
          "隊伍想切斷本地幕鐘，卻發現這條路徑只認王室授權；隨後遭路易斯與士兵圍堵。"
        ],
        [
          "路易斯的野心",
          "幕鐘只有一座；他要的是決定夜降在誰頭上的權力，藉此讓其他城市臣服。"
        ],
        [
          "神跡是排場",
          "真正驅動幕鐘的是機械與暮晶，祭司的祈禱只是做給人民看的表象；知情者多半換得了位置。"
        ],
        [
          "頭戴裝置的代價",
          "長期近距離操作頭戴裝置引發水晶異變，裝置本身仍連著線路運作。"
        ],
        [
          "路易斯已倒下",
          "王座前的戰鬥結束，頭戴裝置與神跡背後的真相，還沒有人對外說明。"
        ]
      ],
      "steps": [
        {
          "type": "narration",
          "frame": 0,
          "text": "隊伍循著遠端受令紀錄的來源，找到了操作室——就是路易斯戴上完成品那晚，鏡頭曾經照過的地方。這次他們要在源頭把幕鐘切斷。",
          "id": "H1-step-01"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "凜",
          "text": "控制台的線路和紀錄對得上。趁它還沒再響，先切。",
          "id": "H1-step-02"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "伊芙接上控制台，卻在最後一步被擋下。",
          "id": "H1-step-03"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "伊芙",
          "text": "它不聽我們的。這條路徑只認王室授權，跟F2那次不一樣。",
          "id": "H1-step-04"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "話音未落，四周的門同時落下閂鎖。腳步聲從主控台後方傳來——路易斯已經站在那裡，士兵散開，堵住了唯一的出口。",
          "id": "H1-step-05"
        },
        {
          "type": "dialogue",
          "frame": 0,
          "speaker": "路易斯",
          "text": "你們會來，我並不意外。",
          "id": "H1-step-06"
        },
        {
          "type": "narration",
          "frame": 0,
          "text": "士兵散開，堵住每一處出口，卻沒有立刻上前——路易斯抬手示意稍候，自己先開口。",
          "id": "H1-step-07"
        },
        {
          "type": "dialogue",
          "frame": 1,
          "speaker": "路易斯",
          "text": "幕鐘只有一座。你們以為停下這裡的操縱端，就能讓夜安分？夜不會消失，它只會被送去別的地方。",
          "id": "H1-step-08"
        },
        {
          "type": "dialogue",
          "frame": 1,
          "speaker": "路易斯",
          "text": "我決定它降在誰的頭上。順從的城市，得到平靜的夜；不順從的，得到夜域。這比刀劍好用得多。",
          "id": "H1-step-09"
        },
        {
          "type": "dialogue",
          "frame": 1,
          "speaker": "路易斯",
          "text": "你們以為幕鐘是神跡？祭司在鐘塔下跪著祈禱的樣子，是做給人民看的。真正動它的，從來不是神明，是機械和暮晶。",
          "id": "H1-step-10"
        },
        {
          "type": "dialogue",
          "frame": 1,
          "speaker": "伊芙",
          "text": "……所以全城的人跪的，是一場排場。",
          "id": "H1-step-11"
        },
        {
          "type": "dialogue",
          "frame": 1,
          "speaker": "路易斯",
          "text": "排場比真相好統治。信神的人不會去查線路，只會去查自己有沒有做錯什麼、惹神明不高興。",
          "id": "H1-step-12"
        },
        {
          "type": "dialogue",
          "frame": 1,
          "speaker": "磷",
          "text": "那些祭司知道嗎？",
          "id": "H1-step-13"
        },
        {
          "type": "dialogue",
          "frame": 1,
          "speaker": "路易斯",
          "text": "知道的人不多。知道的人，都拿了我給的位置。",
          "id": "H1-step-14"
        },
        {
          "type": "dialogue",
          "frame": 1,
          "speaker": "磷",
          "text": "所以你才要這個裝置——不只是為了停鐘，是為了決定誰該死、還要決定沒人能懷疑你。",
          "id": "H1-step-15"
        },
        {
          "type": "dialogue",
          "frame": 1,
          "speaker": "路易斯",
          "text": "不是決定誰該死。是決定誰該懂事。",
          "id": "H1-step-16"
        },
        {
          "type": "narration",
          "frame": 1,
          "text": "路易斯拔出佩劍，士兵同時逼近——談話結束，戰鬥開始。",
          "id": "H1-step-17"
        },
        {
          "type": "battle",
          "frame": 1,
          "ref": "H1-king",
          "text": "士兵率先出手，路易斯親自壓陣；一旦他的甲冑碎裂，戰局會徹底失控。",
          "id": "H1-step-18"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "水晶碎裂崩落，殘留的老鼠也隨之碎散。路易斯倒在控制台前，不再動彈。操作室裡只剩下鐘聲的餘音，和眾人粗重的呼吸聲。",
          "id": "H1-step-19"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "伊芙",
          "text": "頭戴裝置還連著線路。這東西本身，比他這個人更危險。",
          "id": "H1-step-20"
        },
        {
          "type": "narration",
          "frame": 2,
          "text": "未來磷站在原地，從頭到尾沒有動手，也沒有說話。她看著倒下的路易斯，眼神很難讀出情緒。",
          "id": "H1-step-21"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "伊芙",
          "text": "這件事說出去，城裡會亂。",
          "id": "H1-step-22"
        },
        {
          "type": "dialogue",
          "frame": 2,
          "speaker": "格蘭",
          "text": "已經亂了。只是大家還不知道。",
          "id": "H1-step-23"
        },
        {
          "type": "complete",
          "frame": 2,
          "text": "收錄這段記憶。路易斯倒下，操作室終於安靜下來。",
          "id": "H1-step-24"
        }
      ]
    }
  ];
  for (const chapter of chapters) {
    const { id, title, background, evidence, steps } = chapter;
    window.NDCampaignShared.push([id, title, 'party-road', steps[0].text, steps.at(-2).text, evidence]);
    window.NDStoryPerformances[id] = {
      frames: [0, 1, 2].map(index => ({ id: `${id.toLowerCase()}-stage-${index + 1}`, title, path: background === 'hall' ? 'assets/characters/nightfall-hall.webp' : `assets/story/backgrounds/${background}.webp` })), steps
    };
    // Short authored reading groups never cross a task or commit boundary.
    const groups = []; let pending = []; let royalCutaway = false;
    for (const step of steps) {
      if (Boolean(step.royalCutaway) !== royalCutaway && pending.length) { groups.push(pending); pending = []; }
      royalCutaway = Boolean(step.royalCutaway);
      if (['narration', 'dialogue'].includes(step.type)) {
        pending.push(step.id);
        if (pending.length === 3) { groups.push(pending); pending = []; }
      } else if (pending.length) { groups.push(pending); pending = []; }
    }
    if (pending.length) groups.push(pending);
    window.NDStoryReadingGroups.groups[id] = groups;
  }
  // STORY-C4-ARCHIVE-022: C4 retold as an archive retrieval with two battles and one document.
  // C4 has no mid-node save (begin() restarts at step 0), so renumbering is safe.
  {
    const perf = window.NDStoryPerformances.C4;
    perf.frames = [
      { ...perf.frames[0], title: '前往文件庫' },
      { ...perf.frames[1], title: '內庫取件' },
      { ...perf.frames[2], title: '核對命令正本' }
    ];
    perf.steps = [
     {
      "type": "narration",
      "frame": 0,
      "text": "暫時藏身的屋裡，磷把那張帶封存標記的紙攤在桌上。",
      "id": "C4-step-01"
     },
     {
      "type": "narration",
      "frame": 0,
      "text": "紙張下方寫著庫位與件號，再往下便空了，沒有任何命令內容。",
      "id": "C4-step-02"
     },
     {
      "type": "dialogue",
      "frame": 0,
      "speaker": "磷",
      "text": "這張是爸爸留下的。下面那一行，妳看得懂嗎？",
      "id": "C4-step-03"
     },
     {
      "type": "dialogue",
      "frame": 0,
      "speaker": "凜",
      "text": "是取件的位置。命令沒有抄出來。",
      "id": "C4-step-04"
     },
     {
      "type": "dialogue",
      "frame": 0,
      "speaker": "伊芙",
      "text": "行政文件庫，乙列第四櫃……研究案被封存後，相關命令會送到那裡。我知道路。",
      "id": "C4-step-05"
     },
     {
      "type": "dialogue",
      "frame": 0,
      "speaker": "磷",
      "text": "那就拿去找。找到的東西，也要讓我看。",
      "id": "C4-step-06"
     },
     {
      "type": "dialogue",
      "frame": 0,
      "speaker": "伊芙",
      "text": "可以。尺烏的人，妳跟著我，別離開我的視線。",
      "id": "C4-step-07"
     },
     {
      "type": "dialogue",
      "frame": 0,
      "speaker": "格蘭",
      "text": "我留下守著磷。朔，你跟她們去，退路要有人看。",
      "id": "C4-step-08"
     },
     {
      "type": "narration",
      "frame": 0,
      "text": "凜沒有反駁，等磷把索引交給伊芙，才向門口走去。",
      "id": "C4-step-09"
     },
     {
      "type": "action",
      "frame": 0,
      "label": "前往文件庫",
      "text": "凜、伊芙與朔出發；格蘭留在藏身處保護磷。",
      "id": "C4-step-10"
     },
     {
      "type": "narration",
      "frame": 0,
      "text": "三人沿伊芙熟悉的送件側道接近文件庫，卻發現入口多了一道臨時柵欄。",
      "id": "C4-step-11"
     },
     {
      "type": "narration",
      "frame": 0,
      "text": "看守認出了伊芙，立刻扯響警鈴，另一名守衛抬槍封住側道。",
      "id": "C4-step-12"
     },
     {
      "type": "dialogue",
      "frame": 0,
      "speaker": "外廊看守",
      "text": "研究區跑掉的那個。把她扣下！",
      "id": "C4-step-13"
     },
     {
      "type": "dialogue",
      "frame": 0,
      "speaker": "伊芙",
      "text": "庫門就在他們後面。",
      "id": "C4-step-14"
     },
     {
      "type": "dialogue",
      "frame": 0,
      "speaker": "凜",
      "text": "我開路。",
      "id": "C4-step-15"
     },
     {
      "type": "battle",
      "frame": 0,
      "ref": "C4-outer",
      "text": "擊倒攔住側門的守衛，打通進入文件庫的道路。",
      "id": "C4-step-16"
     },
     {
      "type": "narration",
      "frame": 1,
      "text": "守衛倒下後，凜取下門鑰匙，打開通往庫區的側門。",
      "id": "C4-step-17"
     },
     {
      "type": "narration",
      "frame": 1,
      "text": "朔最後跟進，將門掩上；警鈴仍在更深處的走廊裡回響。",
      "id": "C4-step-18"
     },
     {
      "type": "action",
      "frame": 1,
      "label": "進入文件庫",
      "text": "三人進入庫區，依索引尋找對應的櫃位。",
      "id": "C4-step-19"
     },
     {
      "type": "narration",
      "frame": 1,
      "text": "庫內比研究區整潔，鐵櫃上的封條大多還在，空氣裡只有紙張與金屬的氣味。",
      "id": "C4-step-20"
     },
     {
      "type": "narration",
      "frame": 1,
      "text": "伊芙沿櫃列找到乙列，在第四櫃前停下；櫃門後的封袋依件號排列，沒有任何研究器材。",
      "id": "C4-step-21"
     },
     {
      "type": "dialogue",
      "frame": 1,
      "speaker": "伊芙",
      "text": "第四櫃，二十二號。只拿這一件。",
      "id": "C4-step-22"
     },
     {
      "type": "dialogue",
      "frame": 1,
      "speaker": "凜",
      "text": "其他的別動。",
      "id": "C4-step-23"
     },
     {
      "type": "dialogue",
      "frame": 1,
      "speaker": "朔",
      "text": "後面有人過來。",
      "id": "C4-step-24"
     },
     {
      "type": "narration",
      "frame": 1,
      "text": "伊芙找到對應件號，手剛碰上櫃門，另一端的腳步聲便停了下來。",
      "id": "C4-step-25"
     },
     {
      "type": "action",
      "frame": 1,
      "label": "開櫃取件",
      "text": "第二十二件的位置已經確認，但內庫守衛先趕到了。",
      "id": "C4-step-26"
     },
     {
      "type": "narration",
      "frame": 1,
      "text": "循警鈴趕來的內庫守衛從側廊插入，盾衛擋在文件櫃前，槍手則封住接近櫃位的通道。",
      "id": "C4-step-27"
     },
     {
      "type": "narration",
      "frame": 1,
      "text": "朔越過伊芙站到前方，伊芙退到側門的石柱旁，舉槍替他掩護。",
      "id": "C4-step-28"
     },
     {
      "type": "dialogue",
      "frame": 1,
      "speaker": "內庫盾衛",
      "text": "手離開櫃子。索引也留下。",
      "id": "C4-step-29"
     },
     {
      "type": "dialogue",
      "frame": 1,
      "speaker": "伊芙",
      "text": "後面那個封袋，別打壞了。",
      "id": "C4-step-30"
     },
     {
      "type": "dialogue",
      "frame": 1,
      "speaker": "朔",
      "text": "先退開。等我們。",
      "id": "C4-step-31"
     },
     {
      "type": "battle",
      "frame": 1,
      "ref": "C4-inner",
      "text": "擊倒守住文件櫃的內庫守衛，取得索引所指的封存命令。",
      "id": "C4-step-32"
     },
     {
      "type": "narration",
      "frame": 1,
      "text": "兩名守衛倒下，伊芙才打開櫃門，取出與索引對應的封袋。",
      "id": "C4-step-33"
     },
     {
      "type": "narration",
      "frame": 1,
      "text": "她沒有就地拆閱；凜守住近側通道，朔確認來路，三人循側門退出庫區。",
      "id": "C4-step-34"
     },
     {
      "type": "narration",
      "frame": 1,
      "text": "他們繞回藏身處時，格蘭仍守在門邊，磷的手還按著留在身邊的資料袋。",
      "id": "C4-step-35"
     },
     {
      "type": "narration",
      "frame": 2,
      "text": "伊芙先把借來的索引還給磷，再打開帶回的封袋。",
      "id": "C4-step-36"
     },
     {
      "type": "narration",
      "frame": 2,
      "text": "裡面只有一張封存處置令；紙張下緣的簽署區被沿框裁去，案號、日期與命令正文仍然完整。",
      "id": "C4-step-37"
     },
     {
      "type": "narration",
      "frame": 2,
      "text": "她把文件移到燈下，讓凜也看得清楚。",
      "id": "C4-step-38"
     },
     {
      "type": "narration",
      "frame": 2,
      "text": "（由後段對話取代）",
      "id": "C4-step-39"
     },
     {
      "type": "dialogue",
      "frame": 2,
      "speaker": "伊芙",
      "text": "簽署欄整塊沒了。命令是誰最後簽發的，這張紙還答不出來。",
      "id": "C4-step-40"
     },
     {
      "type": "dialogue",
      "frame": 2,
      "speaker": "朔",
      "text": "看守文件的人，也不一定就是下命令的人。",
      "id": "C4-step-41"
     },
     {
      "type": "dialogue",
      "frame": 2,
      "speaker": "伊芙",
      "text": "這能證明他們也打算處置妳。赫爾曼是怎麼死的，還沒有答案。",
      "id": "C4-step-42"
     },
     {
      "type": "narration",
      "frame": 2,
      "text": "凜沒有辯解，只將那一行簽發日期重新看了一遍。",
      "id": "C4-step-43"
     },
     {
      "type": "dialogue",
      "frame": 2,
      "speaker": "凜",
      "text": "不是事故之後才決定的。",
      "id": "C4-step-44"
     },
     {
      "type": "narration",
      "frame": 2,
      "text": "到這一刻，她才有證據確認，從接下任務起自己就在處置名單裡。",
      "id": "C4-step-45"
     },
     {
      "type": "narration",
      "frame": 2,
      "text": "凜把文件壓平，連同空封袋一起推到磷面前。",
      "id": "C4-step-46"
     },
     {
      "type": "dialogue",
      "frame": 2,
      "speaker": "磷",
      "text": "妳不留著？",
      "id": "C4-step-47"
     },
     {
      "type": "dialogue",
      "frame": 2,
      "speaker": "凜",
      "text": "線索是妳帶來的。這張也放妳那裡，不該只由我拿著。",
      "id": "C4-step-48"
     },
     {
      "type": "dialogue",
      "frame": 2,
      "speaker": "磷",
      "text": "我會收好。妳要再看，先跟我說。",
      "id": "C4-step-49"
     },
     {
      "type": "narration",
      "frame": 2,
      "text": "凜點了一下頭，磷把封袋放在文件旁，沒有立刻將它收起。",
      "id": "C4-step-50"
     },
     {
      "type": "narration",
      "frame": 2,
      "text": "凜鬆開紙角時，纏著繃帶的右手慢了半拍；她用左手按住繃帶邊緣，那道尚未癒合的灼痕仍露在外面。",
      "id": "C4-step-51"
     },
     {
      "type": "narration",
      "frame": 2,
      "text": "伊芙的目光跟著她的動作，從文件移到那隻右手上。",
      "id": "C4-step-52"
     },
     {
      "type": "complete",
      "frame": 2,
      "text": "收錄這段記憶，保存本節點進度。",
      "id": "C4-step-53"
     }
    ];
    const groups = []; let pending = [];
    for (const step of perf.steps) {
      if (['narration', 'dialogue'].includes(step.type)) { pending.push(step.id); if (pending.length === 3) { groups.push(pending); pending = []; } }
      else if (pending.length) { groups.push(pending); pending = []; }
    }
    if (pending.length) groups.push(pending);
    window.NDStoryReadingGroups.groups.C4 = groups;
  }
  // The investigation workbench (mode "task") no longer exists: each former task step is told as
  // narration or dialogue that keeps the same story facts. Step count and IDs are preserved (extra
  // lines only where nothing is position-mapped), so scene art and reading groups stay aligned.
  const told = {
    C4: { 'C4-step-39': [
      ['dialogue', '伊芙', '研字第017號，是赫爾曼那個研究案。收回他調閱權限的通知，用的也是這個案號。'],
      ['dialogue', '伊芙', '這裡寫的是簽發日期，不是入庫日期。九月十六日……妳接到任務，是哪一天？'],
      ['dialogue', '凜', '十七日晚上。確定。這張命令，前一天就簽發了。'],
      ['dialogue', '朔', '未歸建人員。包括還在外面執行任務的人？'],
      ['dialogue', '凜', '包括我。回到據點，在「整體封存」裡；沒回去，就另行處置。'],
      ['narration', null, '凜把指尖停在「未歸建」三個字下，沒有再往下移。']
    ] },
    C8: { 'C8-step-03': [['narration', null, '舊地名、採掘編號與移夜時段三欄對照後，只有候選甲全部吻合，共同指向第一號晶化觀測區。納爾瓦筆記上追查多年的幾條線，也都繞回這一帶。']] },
    D2: { 'D2-step-06': [['narration', null, '未來磷說的三件事——被關的人可能沒能全部出來、切斷主供能後仍可能啟動、提早預警可能讓守衛封門——都只是過往分支的經驗。眾人決定逐項去查，不把警告當成眼前的事實。']] },
    D3: { 'D3-step-05': [['narration', null, '留置簿上值得追的，只有近期登記在北側中繼的那一筆。正門有守衛，儲物通道被箱件堵住，只有側門經朔勘查、由格蘭安排接應。要親眼見到人，才能確認他們還活著。']] },
    D4: { 'D4-step-07': [['narration', null, '本次移夜計畫的目標地區，與近期居民回報是同一處，那裡仍有人生活；空欄不能當成沒有人。分工就此定下：凜核對工令與備援，伊芙在讀數旁隔離供能，朔守出口接人，格蘭管接應名單與預警，未來磷協助局部，磷在看得見的維修區報位。備援與主供能都還沒隔離，預警也還沒送出。']] },
    D5: { 'D5-step-11': [['narration', null, '磷把眼前看見的都報了出去。兩個人的位置已經送出，接收要等下一節。']] },
    D6: { 'D6-step-05': [['narration', null, '凜鎖住強制啟動、斷開備援，伊芙隔離主供能並複測走廊，朔與格蘭在出口就位。牆邊的傷者已上擔架待轉送，欄杆左側的工人也通過了出口；磷再報出管線旁還有一個人，朔動身去找。']] },
    D7: { 'D7-step-06': [['narration', null, '接應單寫明：傷者將送往下一處救護接收點，已有護送人員，後續回報由格蘭核對。接收端還沒有回覆，只能寫成「已安排」，不能寫成已抵達，更不能寫成已康復。']] },
    F1: {
      'F1-royal-warning': [['narration', null, '伊芙把兩份文件並排攤開：一份是納爾瓦經研究聯絡管道收到的博士警告——繼續把裝置接進暮鐘，可能引起災難；另一份是他留置期間辨讀校準資料時見過的王室委託附件，帶出的抄件來源欄相符。附件寫明路易斯要求研製暮晶頭戴裝置，以能量連結暮鐘、集中調度夜域，卻沒有任何完成驗收的結果。能證明的只有這些。']],
      'F2-step-07': [['narration', null, '三份當前回報放上了桌面：外部目標仍有人居住；最後一隊照護車還在路上，接收端尚未回覆抵達；接收處已安排照護、首批配給與部分工具，長期短缺仍在。他們據此只提出一項要求：撤回本地強制啟動，等最後車隊交接，再依程序停止本地操縱。']],
      'F2-step-14': [['narration', null, '凜回報：本地強制啟動已阻止，工令與副本分開保管。朔回報：最後通道仍可接應，最後一輛照護車尚未抵達。眾人繼續守住通路，等最後的回報。']]
    },
    F4: {
      'F3-step-04': [['narration', null, '格蘭一項一項核實：最後照護車與照護人員已抵達；本次城內居民名單相符，最後協商戶已交接；鐘塔清查隊也退出內圈，到了接應點。本次城內平民撤離完成。遠方與長期安置另列，不代表其他地方都安全，接下來要隔離本座設備。']],
      'F3-step-05': [['narration', null, '凜確認本地強制啟動仍受控，伊芙與操作員隔離了現場作業負載、解除本地備援並複測，本地操縱機件也已固定，工作人員的退路保留，允許拆卸這一端的控制耦合件。現在才具備共同停用的條件。']],
      'F4-step-01': [['narration', null, '伊芙看著清單，一項一項核對：居民接收、作業負載隔離、本地備援解除、本地操縱機件固定，全部確認。成人負責承重與主斷路，磷在安全側台，參與共同操作。']]
    },
    G1: { 'G1-step-10': [['narration', null, '三份紀錄並排在桌上。停機紀錄與現地回查顯示，本地操縱確曾停止，拆下的控制耦合件與現場備援隔離仍在，居民接收紀錄也沒有改變。新的命令經王室授權的另一條遠端路徑抵達，沒有經過被扣住的本地操縱端；供能則沿留存管線，重新接上仍完整的引域核心。本地停機是真的，另一路控制利用既存供能，讓鐘重新響了。']] }
  };
  for (const [nodeId, byStep] of Object.entries(told)) {
    const steps = window.NDStoryPerformances[nodeId].steps;
    for (const [stepId, lines] of Object.entries(byStep)) {
      const at = steps.findIndex(item => item.id === stepId);
      if (at < 0) throw new Error('missing former task step ' + stepId);
      const frame = steps[at].frame;
      const made = lines.map(([type, speaker, text], index) => {
        const step = { type, frame, text, id: index ? stepId + '-' + 'bcdefgh'[index - 1] : stepId };
        if (speaker) step.speaker = speaker;
        return step;
      });
      steps.splice(at, 1, ...made);
    }
  }
  // T2/T3 rescue beats are told in dialogue only; there is no task workbench for them.
  for (const [nodeId, stepId, speaker, text] of [
    ['T2', 'T2-step-04', '格蘭', '女孩交給你了，抱穩！我去扶她媽媽。'],
    ['T3', 'T3-step-05', '格蘭', '人接到了嗎？好，我放手！盾撐不住了，拉我出去！']
  ]) {
    const step = window.NDStoryPerformances[nodeId].steps.find(item => item.id === stepId);
    Object.assign(step, { type: 'dialogue', speaker, text });
    delete step.items; delete step.ref; delete step.label;
  }
  const aftermath = (nodeId, stepId) => {
    const step = window.NDStoryPerformances[nodeId].steps.find(item => item.id === stepId);
    step.type = 'narration'; delete step.label;
  };
  aftermath('T2', 'T2-step-05');
  aftermath('T3', 'T3-step-06');
  const end = window.NDStoryPerformances.C9.steps.find(step => step.id === 'C9-step-12');
  end.text = end.text.replace('第二階段結束。', '循著藏身處留下的物資痕跡，追查還在繼續。');
  // STORY-CONDENSE-026 (ND-STORY-CONDENSE-PLAN-01): beats that repeat what the player already
  // knows are dropped or shortened; relationship turns, costs and responsibility stay (K01–K14).
  // Step ids are never renumbered, so id-numbered scene art keeps working; a moved beat keeps
  // its id. Runs before the chapter merges below, while every node still has its own steps.
  {
    const P = window.NDStoryPerformances, groups = window.NDStoryReadingGroups.groups;
    const find = (nodeId, stepId) => {
      const at = P[nodeId].steps.findIndex(item => item.id === stepId);
      if (at < 0) throw new Error('condense: missing ' + stepId + ' in ' + nodeId);
      return at;
    };
    const drop = (nodeId, ids) => { for (const id of ids) P[nodeId].steps.splice(find(nodeId, id), 1); };
    const say = (nodeId, stepId, text) => { P[nodeId].steps[find(nodeId, stepId)].text = text; };
    const move = (from, ids, to, afterId, frame) => {
      const moved = ids.map(id => ({ ...P[from].steps.splice(find(from, id), 1)[0], frame }));
      P[to].steps.splice(find(to, afterId) + 1, 0, ...moved);
      const reading = moved.filter(item => ['narration', 'dialogue'].includes(item.type)).map(item => item.id);
      for (let i = 0; i < reading.length; i += 3) (groups[to] = groups[to] || []).push(reading.slice(i, i + 3));
    };

    // P0 · C4 (C01/C03): one trip to the archive, two guard fights kept (different line-ups),
    // the date reveal asked and answered once. Index → sealed order → Rin on the list → signer unknown.
    say('C4', 'C4-step-01', '暫時藏身的屋裡，磷把那張帶封存標記的紙攤在桌上。紙上只有庫位與件號，再往下便空了。');
    say('C4', 'C4-step-04', '是取件的位置。命令正文沒有抄出來。');
    say('C4', 'C4-step-10', '磷把索引交給伊芙。凜、伊芙與朔出發；格蘭留在藏身處守著磷。');
    say('C4', 'C4-step-11', '三人沿送件側道接近文件庫，入口卻多了一道臨時柵欄。看守認出伊芙，立刻扯響警鈴。');
    say('C4', 'C4-step-17', '守衛倒下。凜取下門鑰匙，三人進入庫區，依索引找到乙列第四櫃。');
    say('C4', 'C4-step-27', '循警鈴趕來的內庫守衛從側廊插入。盾衛擋在文件櫃前，槍手封住通道；朔站到伊芙前方，伊芙退到石柱旁舉槍掩護。');
    say('C4', 'C4-step-33', '兩名守衛倒下，伊芙才打開櫃門，取出與索引對應的封袋。她沒有就地拆閱，三人循側門退回藏身處。');
    say('C4', 'C4-step-36', '伊芙把索引還給磷，打開封袋。裡面只有一張封存處置令：簽署區被沿框裁去，案號、日期與命令正文仍然完整。');
    say('C4', 'C4-step-46', '凜把文件壓平，推到磷面前。');
    say('C4', 'C4-step-51', '凜鬆開紙角時，纏著繃帶的右手慢了半拍，那道尚未癒合的灼痕露在外面。伊芙的目光從文件移到那隻右手上。');
    // STORY-C4-DIALOGUE-032: the first half used to be logistics (where the cabinet is, where to go). Each line now
    // carries a stake instead: Rin's doubt about who sealed the case, Eve's distrust, Phosphor's father.
    say('C4', 'C4-step-01', '暫時藏身的屋裡，磷把父親留下的那張索引攤在桌上。紙上只有庫位與件號，再往下便空了——她看了整夜，仍不知道這張紙要她找什麼。');
    say('C4', 'C4-step-04', '首腦交任務時，只說赫爾曼要洩露技術，沒說這個案子已經被人收走。我想知道，是誰先動的手。');
    say('C4', 'C4-step-05', '封存令不會留在研究區，會送行政文件庫，乙列。我不是為了妳去的；赫爾曼的案號要是在上面，我要知道是誰收的。');
    say('C4', 'C4-step-06', '那就拿去找。這是爸爸留給我的東西，找到什麼，都要讓我看。');
    say('C4', 'C4-step-22', '封條都是新的。拆之前，先確認件號對得上索引。');
    say('C4', 'C4-step-30', '後面那個封袋，別打壞了。');
    drop('C4', ['C4-step-02', 'C4-step-03', 'C4-step-08', 'C4-step-09', 'C4-step-12', 'C4-step-14', 'C4-step-18', 'C4-step-19', 'C4-step-20', 'C4-step-21', 'C4-step-23', 'C4-step-25', 'C4-step-26', 'C4-step-28', 'C4-step-31', 'C4-step-34', 'C4-step-35', 'C4-step-37', 'C4-step-38', 'C4-step-39-f', 'C4-step-41', 'C4-step-43', 'C4-step-44', 'C4-step-50', 'C4-step-52']);

    // STORY-C4-SEARCH-033: the cabinet hand-off is no longer narrated outright; the player
    // searches the drawer itself for the one sealed order among the filed envelopes.
    say('C4', 'C4-step-33', '兩名守衛倒下。伊芙打開櫃門——封存令跟其他件號擺在一起，得自己在裡面翻找。');
    P.C4.steps.splice(find('C4', 'C4-step-33') + 1, 0,
      { id: 'C4-step-33-search', type: 'search', frame: 1, sceneId: 'archive-vault', searchScene: 'archive-vault',
        text: '翻找乙列第四櫃，找出索引對應的封存命令。',
        items: [{ id: 'sealed-order', label: '封存處置令', text: '找到了——件號對得上索引，是這一份。' } ] },
      { id: 'C4-step-34', type: 'narration', frame: 1, text: '她沒有就地拆閱；凜守住近側通路，朔確認來路，三人循側門退回藏身處。' }
    );
    // C4's reading groups were fixed at authoring time and never re-chunked after the drop()/say()
    // edits above; rebuild them from the final step order so the new search beat groups correctly.
    {
      const chunked = []; let pending = [];
      for (const step of P.C4.steps) {
        if (['narration', 'dialogue'].includes(step.type)) { pending.push(step.id); if (pending.length === 3) { chunked.push(pending); pending = []; } }
        else if (pending.length) { chunked.push(pending); pending = []; }
      }
      if (pending.length) chunked.push(pending);
      groups.C4 = chunked;
    }


    // P1 · D2/D4 (C04): the past-branch risks are told once, by future Phosphor at the relay.
    say('D2', 'D2-step-01', '納爾瓦與那名女子在五人面前停下，兩個人都在喘氣。女子的衣袖下有舊傷。');
    say('D2', 'D2-step-06', '未來磷說的都是過往分支的經驗。眾人決定逐項去查，不把警告當成眼前的事實。');
    // D3+D4 (C05): one plan — who went where, then one round of roles and why the warning goes first.
    say('D3', 'D3-step-05', '正門有守衛，儲物通道被箱件堵住，只能走朔勘查過的側門。要親眼見到人，才能確認他們還活著。');
    drop('D3', ['D3-step-04']);
    say('D4', 'D4-step-06', '那些分支，我在外面都說過了。每次我們做了不同的事，現場也跟著變；我沒有一張照著走就能救完人的表。');
    say('D4', 'D4-step-07', '分工就此定下：凜核對工令與備援，伊芙在讀數旁隔離供能，朔守出口接人，格蘭管接應名單與預警，未來磷協助局部，磷在看得見的維修區報位。等切完線再發預警，目標地區的人就來不及撤，所以警告得先送出去。');
    drop('D4', ['D4-step-04', 'D4-step-05']);
    // D5+D6 (C06/C07): the isolation order is stated once; "you can say stop too" stays.
    say('D5', 'D5-step-09', '妳看得到維修區。告訴我們人在哪、哪裡不能走。我只能替這一小段爭取片刻。');
    // STORY-D5-SIMPLIFY-049: D5 opening cut to one event per line (same facts, shorter words); no new explanation added.
    say('D5', 'D5-step-01', '預警送出後，站方提早封鎖，並啟動控制器。內門被改動，眾人被分開：朔守外側出口，凜趕去備援，伊芙在供能室，未來磷在她身邊。');
    say('D5', 'D5-step-02', '磷看見移夜標示亮起，想到那裡還有人，揮下工具砸向控制器。管線還沒隔離，能量倒灌回來。');
    say('D5', 'D5-step-03', '養父剛送走第一名傷者，折回去拉起跌倒的工人。第一波能量撞上牆，震倒了工人；養父撲上去護住他。');
    say('D5', 'D5-step-04', '磷又舉起工具。伊芙守著已隔離的側支；未來磷聽見聲響，從內門的縫隙鑽過來，用一片薄晶擋住第二下。');
    say('D5', 'D5-step-10', '磷放下工具，看向牆邊被震倒的工人，和守在他身旁的養父。她握緊手，開始看他們周圍還有誰。');
    say('D5', 'D5-step-14', '未來磷朝她指的方向支起薄晶，守住那一段通路，等伊芙與接應者回報。');
    drop('D5', ['D5-step-11']);
    say('D6', 'D6-step-05', '凜鎖住強制啟動、斷開備援，伊芙隔離主供能並複測走廊。牆邊的傷者上了擔架，欄杆左側的工人也通過出口；磷再報出管線旁還有一個人，朔動身去找。');
    say('D6', 'D6-step-10', '伊芙確認通路無人後切斷最後一段電路，朔扶住未來磷，格蘭護著傷者撤出。連鎖反應被攔下來了；傷者仍需救治，遠方的人還沒接到。');
    drop('D6', ['D6-step-09']);

    // D7 ← F1 opening (C08): after father and daughter settle responsibility, Narva reads the
    // calibration fields and brings out the royal commission. Warning and commission stay two sources.
    say('D7', 'D7-step-06', '傷者將轉送下一處救護接收點，由格蘭核對後續回報。接收端還沒回覆，只能寫成「已安排」，不能寫成已抵達。');
    say('F1', 'F1-warning-01', '納爾瓦請伊芙把中繼站抄件攤在桌上，指向附有來源欄的委託附件，再取出研究聯絡管道留下的警告抄錄。');
    say('F1', 'F1-warning-09', '伊芙把警告與委託分開註明來源：委託不能當成完成證明。未來磷站在桌尾，聽完這段交談，沒有補充。');
    drop('F1', ['F1-warning-08', 'F1-royal-warning']);
    move('F1', ['F1-warning-01', 'F1-warning-02', 'F1-warning-03', 'F1-warning-04', 'F1-warning-05', 'F1-warning-06', 'F1-warning-07', 'F1-warning-09'], 'D7', 'D7-step-08', 2);
    // F1 (C09/C15): residents, the dispatcher's refusal and the takeover; the last convoy is only
    // left hanging here — why it stalled and how it got through belong to F4.
    say('F1', 'F2-step-07', '三份回報放上桌面：外部目標仍有人居住；最後一隊照護車還在路上；接收處已安排照護與首批配給，長期短缺仍在。他們只提出一項要求：撤回本地強制啟動，等最後車隊交接，再依程序停止本地操縱。');
    say('F1', 'F2-step-13', '同意維持撤離的值守人員接管通路，把發令者與控制端分開。原件和命令副本分開保管，責任留待逐項核對。');
    say('F1', 'F2-step-14', '凜回報：本地強制啟動已阻止，工令與副本分開保管。朔回報：最後通道仍可接應。眾人守住通路，等最後的回報。');
    say('F1', 'F2-step-16', '最後一隊還沒過坡道，接收端也還沒回報。');
    // F4 (C09/C10/C11): one checklist; the settlement cost in one line; "I'll stay" was already said in D7.
    say('F4', 'F3-step-04', '格蘭逐項核實：最後照護車與照護人員已抵達，城內居民名單相符，鐘塔清查隊也退到接應點。本次城內平民撤離完成；遠方與長期安置另列，不代表其他地方都安全。');
    say('F4', 'F3-step-05', '凜確認本地強制啟動仍受控；伊芙與操作員隔離現場負載、解除本地備援並複測，本地操縱機件也已固定，工作人員的退路保留。現在才具備共同停用的條件。');
    say('F4', 'F4-step-06', '夜域沒有消失。眾人循預留路線離開鐘室，回到居民已抵達的接收地；其他城市的鐘並未因此停止，手中的王室委託也還要繼續查。');
    say('F4', 'F4-step-08', '照護已接上，下一批糧還在路上。搬不走的機具和配糧還在吵——人到了，日子還沒回來。缺的留在表上，明天繼續追。');
    drop('F4', ['F4-step-01', 'F4-step-07', 'F4-step-16', 'F4-step-17']);
    // G1 (C12): one field check and one relayed report; the local lock is still valid.
    say('G1', 'G1-step-01', '鐘停了，人也撤完了——這些都已經確認過。沒查清的，是路易斯委託頭戴裝置的下落。');
    say('G1', 'G1-step-07', '既存供能重新送入未被毀去的引域核心。鏡頭回到接收地：第一輪現地回查確認本地操縱端仍鎖定；朔再沿接應線索取受令與供能紀錄，第二輪抄報送到後，伊芙把三份來源攤齊。');
    say('G1', 'G1-step-10', '三份紀錄並排在桌上：本地操縱確曾停止，拆下的耦合件與備援隔離都還在，居民接收紀錄也沒變。新命令經王室授權的另一條遠端路徑抵達，沒有經過被扣住的本地操縱端；供能沿留存管線，重新接上仍完整的引域核心。');
    drop('G1', ['G1-step-12']);
    // H1 (C14): the king no longer re-explains that night is only moved; he speaks of how he uses it.
    say('H1', 'H1-step-04', '它不聽我們的。這條路徑只認王室授權，跟上次在鐘室不一樣。');
    say('H1', 'H1-step-05', '話音未落，四周的門同時落下閂鎖。路易斯從主控台後方走出；士兵散開堵住出口，卻沒有立刻上前。');
    say('H1', 'H1-step-09', '夜不會消失，只會被送去別處。我決定它降在誰的頭上：順從的城市得到平靜的夜，不順從的得到夜域。這比刀劍好用得多。');
    say('H1', 'H1-step-15', '所以你才要這個裝置——決定誰該死，還要讓人沒辦法懷疑你。');
    drop('H1', ['H1-step-07', 'H1-step-08']);

    // P2 · origins and interludes: repeated lines only; no origin chapter is merged
    // (skins and the Phosphor unlock count each origin's third chapter).
    say('A2', 'A2-step-01', '凜沒有回答，向前逼近實驗台。赫爾曼仍在尋找退路；她必須先取得對抗優勢。');
    // STORY-A2-DIALOGUE-035: the memory fragments name what Rin actually saw (a woman researcher, a girl's voice, "basement three"),
    // tie it to Herman's "they didn't tell you" and to the briefing she will question in A3; no line implies a kill.
    drop('A2', ['A2-step-07']); // STORY-A2-DIALOGUE-047: Rin's recap line is cut; step 08 carries the beat.
    say('A2', 'A2-step-08', '畫面只持續了幾次呼吸就散了。凜只確定一件事：赫爾曼那句「他們沒有告訴妳」，不是在拖時間。');
    say('A2', 'A2-step-09', '外面傳來腳步聲。凜用布條纏住右手的灼傷，從維修通道離開。她是為了殺人而來，赫爾曼卻不是死在她手上。');
    drop('A1', ['A1-step-09']);
    say('S2', 'S2-maze-03', '路線定下來了：側門、巷道、換班出口。出口的另一端，卻已經有人在等。');
    say('S3', 'S3-step-02', '換班出口前，朔的師父伊藤攔在通道上，看見了納爾瓦藏著的文件。');
    drop('T2', ['T2-step-03']);
    say('E1', 'E1-step-09', '她與赫爾曼開始把幾份舊紀錄放在一起比對。');
    // STORY-P2-DIALOGUE-036: P2 used to open with "teaching her to find her way", with no reason given. Narva's rule now has a cause
    // (registering a child brings inspections, P1) and the street she "remembers" is tied to the map he keeps staring at.
    // STORY-C3-DIALOGUE-041: after the back-door fight, nobody should "know" Rin from a wound. They can read her: the badge on her uniform
    // was cut off, her right hand is burned, she fights like a professional, and the public notice says 尺烏 betrayed the state with
    // one field operative unaccounted for. Eve says so out loud as a guess; Rin does not confirm it (C5 is where the lab comes out).
    // Step 05 now describes the illustration it sits on (Rin holding the door, beckoning Gran and Phosphor out) instead of Eve's reaction.
    {
      const C3 = P.C3.steps, at = id => C3.findIndex(item => item.id === id);
      say('C3', 'C3-step-05', '後門前的追兵倒下。凜拉開通往小巷的門，向格蘭與磷伸手，要他們先走；伊芙收槍跟上。她出手時右手的繃帶裂開，露出灼傷，制服上被割去標誌的地方也一覽無遺。');
      C3.splice(at('C3-step-05') + 1, 0, { id: 'C3-step-05-b', type: 'dialogue', frame: 1, speaker: '伊芙', text: '標誌是自己割掉的，手上還有灼傷，出手也不像普通人。告示說尺烏叛國，只剩一名外勤沒歸建——很可能就是她。' });
      const g = window.NDStoryReadingGroups.groups.C3, gi = g.findIndex(x => x.length === 1 && x[0] === 'C3-step-05');
      if (gi >= 0) g[gi] = ['C3-step-05', 'C3-step-05-b'];
    }
    // STORY-B1-BATTLE-040: the wolf attack is a real fight (encounter 'B1-wolves', Gran as the hero, two crystal wolves). Step 02 is a battle step; the aftermath opens step 03.
    // STORY-B1-WOLVES-039: B1 is rewritten. Phosphor waits for Shuo outside the city, wolves attack, Gran (tank) drives them off,
    // his deputy asks whether to report the child to the association, Gran says no and takes her into the city to meet Shuo.
    // Interaction steps keep their ids and types; one deputy line is inserted. Art: tank-refusal (a man holding a sealed slip,
    // Gran's palm up, the girl clinging) already fits the "report it?" beat.
    {
      const B1 = P.B1.steps, at = id => B1.findIndex(item => item.id === id);
      say('B1', 'B1-step-01', '磷依納爾瓦的筆記，在城外的路口等朔。天黑了，他還沒來；一群被暮晶侵蝕的野狼循著她身上的氣味，從荒草裡圍了上來。路過的渡垣隊員格蘭聽見喊聲，舉盾衝了過來。');
      say('B1', 'B1-step-02', '格蘭舉盾擋在磷身前，擊退撲上來的晶狼。');
      say('B1', 'B1-step-03', '最前面的兩頭晶狼倒下，其餘的狼退回黑暗。格蘭把磷帶回渡垣隊的臨時營地。副手拿著回報單走來：沒有名冊、沒有來歷的孩子，照規矩要登記後送交協會。磷抓住了格蘭的衣袖。');
      const items = B1[at('B1-step-04')].items;
      items[0].label = '回報單'; items[0].text = '副手已寫上地點與時間，「姓名」「來歷」兩欄是空的，要送協會統一安置。';
      items[1].label = '孩子的行李'; items[1].text = '只有一枚木書籤和一份手寫的路線筆記，最後一頁寫著「去找朔」。';
      B1.splice(at('B1-step-04') + 1, 0, { id: 'B1-step-04-b', type: 'dialogue', frame: 1, speaker: '副手', text: '要把這張單子送上去嗎？協會問起來，我們沒登記就帶走了一個孩子。' });
      say('B1', 'B1-step-05', '不用。她在我們的路上被狼圍住，不是任何名冊上的人。上面問起來，我來答。');
      say('B1', 'B1-step-06', '格蘭讓副手領營地的人照原路線走，自己護送磷進城。副手把那張回報單對折，塞進衣袋，沒有再提。');
      B1[at('B1-step-06')].label = '帶她進城';
      say('B1', 'B1-step-07', '要把妳交給誰，我會先問妳。先進城，去見妳在等的人。');
      const g = window.NDStoryReadingGroups.groups.B1, gi = g.findIndex(x => x.length === 1 && x[0] === 'B1-step-05');
      if (gi >= 0) g[gi] = ['B1-step-04-b', 'B1-step-05'];
      P.B1.frames[0].title = '野狼襲擊'; P.B1.frames[1].title = '不上報'; P.B1.frames[2].title = '進城找朔';
      say('B2', 'B2-step-01', '格蘭帶磷進城，循筆記上的線索找到朔。多年後，他靠護送難民與商隊維生，仍留意失蹤朋友的消息。');
      say('B2', 'B2-step-02', '她在城外等你。這孩子的父親留下了你的線索。');
    }
    // STORY-P1-DIALOGUE-037: the baby's crying now has a cause (alone, cold, the night has just withdrawn) and ties to the crystal.
    say('P1', 'P1-step-01', '被朔放走後，納爾瓦先送出移夜警告，隨後輾轉躲避追捕。一次經過夜域剛退的道路，他在空蕩的廢屋裡聽見哭聲，又細又啞，像是已經哭了很久。');
    say('P1', 'P1-step-03', '四周沒有人回答。孩子裹在被夜氣浸冷的毯子裡，身旁沒有大人，也沒有水和食物。');
    say('P1', 'P1-step-04', '他循聲抱起孩子。她被抱穩後，哭聲才慢慢低下去。官方紀錄卻寫著這裡無人生還。');
    say('P2', 'P2-step-01', '磷在逃亡中長大。每次搬家，納爾瓦都只讓她帶一個包；他沒說為什麼，她也學會了不問。');
    say('P2', 'P2-step-02', '走散了，就去最近的渡垣標誌那裡等我。不要回頭找，也不要告訴任何人妳叫什麼名字。');
    say('P2', 'P2-step-06', '那條街，在你的地圖上嗎？');
    say('P2', 'P2-step-07', '納爾瓦對著舊地圖沉默。那條街真的存在過，就在那片被記成「無人生還」的災區裡。他害怕她被當成研究材料，卻沒有把猜測告訴她。');
    say('P4', 'P4-step-01', '納爾瓦把地圖收起，才終於開口。他要說的不是撿到她那夜的事——磷早就知道、也問過很多次——而是他一直沒說的猜測。');
    say('P4', 'P4-step-02', '跟那份「無人生還」的紀錄有關？');
    say('P4', 'P4-step-03', '我一直沒查清楚，為什麼紀錄跟我看到的不一樣。現在有一條新線索，我得親自去查。');
    say('P4', 'P4-step-05', '我怕妳聽了會想自己查清楚——那太危險，會讓人盯上妳。');
    say('P4', 'P4-step-06', '磷沒有立刻鬆手。她抓住他的袖子，要他別再自己決定把她留在哪裡。');
    say('P4', 'P4-step-09', '他把她送到約定出口，自己轉往線索指的方向——這次沒有追兵，只有他不打算讓她跟的危險。');
    say('C5', 'C5-step-14', '回流讀值支持異常發生，卻不能排除凜的其他行動；伊芙也可能被騙。但她有了不能立刻抹去、必須查證的理由。');
    drop('C5', ['C5-step-11']);
    drop('C6', ['C6-step-04']);
    // STORY-C5-DIALOGUE-033: make the interrogation a real test. Eve states a false detail on purpose, Rin corrects it and
    // gives herself away; Eve reacts to the private memory; Phosphor's later objection quotes something Rin actually said.
    say('C5', 'C5-step-01', '妳右手的傷，是在赫爾曼的研究室留下的？');
    say('C5', 'C5-step-02', '凜沒有回答。伊芙沒有再追問，只故意說錯一個細節，看她會不會更正。');
    say('C5', 'C5-step-03', '實驗銃放在桌子左邊，靠牆。他連碰都沒碰過。');
    say('C5', 'C5-step-04', '他拿在手上。退路被封住以後，是他舉起來對著我的。');
    say('C5', 'C5-step-05', '話一出口，凜就知道自己承認了在場。伊芙舉起槍。');
    say('C5', 'C5-step-06', '最後發生了什麼？一個字都別省。');
    say('C5', 'C5-step-07', '他開槍。我躲開了，右手被擦到。能量反衝回去，他倒下的時候，我已經在地上。');
    say('C5', 'C5-step-08', '接著整個房間變了。我看見另一張桌子，妳站在旁邊。我只看到一段，不能知道全部。');
    say('C5', 'C5-step-09', '我那晚不在研究室。');
    say('C5', 'C5-step-10', '我知道。那不是那一晚的事——我也是看見以後，才明白。');
    say('C5', 'C5-step-13', '伊芙握槍的手停住了。那是她和赫爾曼第一次聽見女孩殘響時，沒有寫進正式報告的對話。');
    say('C6', 'C6-step-01', '她說她只看到一段，不能知道全部。妳現在拿槍指著她，也只看到一段嗎？');
    say('C6', 'C6-step-06', '我還不信妳。但我要查清楚，妳先留下。');
    say('C6', 'C6-step-02', '磷把桌上的文件收回懷裡，沒有替尺烏的人求原諒，也沒有退開。伊芙沒有立刻回答。');
    say('C6', 'C6-step-03', '追兵可能再回來。槍放下，我們得走了。');
    say('C6', 'C6-step-08', '好。我也需要有人認得那些碎片。');
    // STORY-C8-DIALOGUE-042: C8 is about finding Narva (Phosphor's one request since B2); the story does not investigate Phosphor's origin. Eve's line now says why this
    // zone matters for the search; the third frame title no longer refers to the dropped "does Dad know" exchange.
    say('C8', 'C8-step-04', '他追了這麼多年的線，都在這附近交會。那一區被封鎖了，他如果還在查，最可能就在裡面。要找他，只能先去那裡。');
    say('C8', 'C8-step-06', '這些線索不能保證納爾瓦就在那裡，但那是他留下的方向。');
    P.C8.frames[2].title = '決定追查方向';
    say('C9', 'C9-step-20', '坑道另一頭傳來急促的腳步聲。磷認出那個一路喊著她名字的聲音：是納爾瓦。他身旁跟著一名她從沒見過的女子，手腕上的裝置裂損，神情比他還要緊張。');
    drop('C9', ['C9-step-19']);

    // Reading groups: drop removed ids and split any group a deletion or insertion left non-contiguous.
    for (const nodeId of Object.keys(groups)) {
      if (!P[nodeId]) continue;
      const at = new Map(P[nodeId].steps.map((item, index) => [item.id, index])), seen = new Set(), kept = [];
      for (const group of groups[nodeId]) {
        let run = [];
        for (const id of group) {
          if (!at.has(id) || seen.has(id)) continue;
          if (run.length && at.get(id) !== at.get(run.at(-1)) + 1) { kept.push(run); run = []; }
          run.push(id); seen.add(id);
        }
        if (run.length) kept.push(run);
      }
      groups[nodeId] = kept;
    }
    // Map-card intro/outro of continuation chapters follow their (edited) first and closing lines.
    for (const entry of window.NDCampaignShared) {
      const perf = P[entry[0]];
      if (perf && chapters.some(chapter => chapter.id === entry[0])) { entry[3] = perf.steps[0].text; entry[4] = perf.steps.at(-2).text; }
    }
  }
  // STORY-REWRITE-050 (docs/design/STORY-REWRITE-050*.md): the new main storyline.
  // No future Phosphor, no relay rescue, no evacuation/second bell. Shared line: P1(+P2) → P3(+P4) → B1(+B2) → C4 → C5 → C8(+C9) → G1 (truth) → H1.
  // Rewritten nodes get new step ids "<node>-rNN" (their number does not parse, so the old step-number art rules never fire on them);
  // interactive steps are copied from the old ones so every battle, search and puzzle keeps its mechanics.
  {
    const P = window.NDStoryPerformances, groups = window.NDStoryReadingGroups.groups;
    const idx = (n, id) => { const i = P[n].steps.findIndex(s => s.id === id); if (i < 0) throw new Error('STORY-REWRITE-050: missing ' + id); return i; };
    const get = (n, id) => P[n].steps[idx(n, id)];
    const say = (n, id, text, speaker) => { const s = get(n, id); s.text = text; if (speaker !== undefined) s.speaker = speaker; };
    const drop = (n, ids) => { for (const id of ids) P[n].steps.splice(idx(n, id), 1); };
    const after = (n, afterId, items) => P[n].steps.splice(idx(n, afterId) + 1, 0, ...items);
    const before = (n, beforeId, items) => P[n].steps.splice(idx(n, beforeId), 0, ...items);
    const N = (id, frame, text) => ({ id, type: 'narration', frame, text });
    const D = (id, frame, speaker, text) => ({ id, type: 'dialogue', frame, speaker, text });
    const copy = (n, id, frame, patch) => ({ ...JSON.parse(JSON.stringify(get(n, id))), frame, ...patch });
    // rows: [frame, 'n', text] | [frame, 'd', speaker, text] | [frame, 'a', text] | [frame, 'c', text] | [frame, 'x', stepObject]
    const build = (n, rows) => rows.map((r, i) => {
      const id = n + '-r' + String(i + 1).padStart(2, '0'), [frame, kind] = r;
      if (kind === 'n') return N(id, frame, r[2]);
      if (kind === 'd') return D(id, frame, r[2], r[3]);
      if (kind === 'a') return { id, type: 'action', frame, text: r[2] };
      if (kind === 'c') return { id, type: 'complete', frame, text: r[2] };
      return { ...r[2], id, frame };
    });
    const frames = (n, list) => { P[n].frames = list.map(([art, title], i) => ({ id: art || n.toLowerCase() + '-r-' + i, title, path: (window.NDStoryArt.scenes.find(s => s.id === art) || {}).path || 'assets/story/backgrounds/road.webp' })); };
    const rewritten = [];
    const replace = (n, rows, frameList) => { const steps = build(n, rows); frames(n, frameList); P[n].steps = steps; rewritten.push(n); return steps; };

    // ── Prologue: opens S1, the earliest point of the timeline. Frame 3 is the empty bell tower.
    P.S1.frames.push({ id: 's1-prologue', title: '維斯珀蘭', path: 'assets/story/backgrounds/tower.webp' });
    before('S1', P.S1.steps[0].id, [
      N('S1-prologue-01', 3, '維斯珀蘭在大陸的西側。北方是諾德馬克的高地，東方是艾許莫爾的荒原。'),
      N('S1-prologue-02', 3, '這片土地上有八座城市。人們在城與城之間耕種、採礦、運貨，也在城與城之間躲避夜域。'),
      N('S1-prologue-03', 3, '夜域來的時候，天會先暗，接著是冷。被它罩住的地方，作物枯死，人會迷失方向，留得太久的人再也走不出來。'),
      N('S1-prologue-04', 3, '夜域退去後，地上會留下暮晶。它能發光、能儲存能量，城市靠它照明、取暖、驅動機械。'),
      N('S1-prologue-05', 3, '八座城市裡，只有暮城不怕夜域。城中央的暮鐘一響，祭司在鐘下祈福，逼近的夜域就會退去。'),
      N('S1-prologue-06', 3, '所以人們相信，只要暮鐘還在，維斯珀蘭就還有明天。'),
      N('S1-prologue-07', 3, '然而實際上……')
    ]);

    // ── S2: Herman is the one who warns Narva; the new coordinates point at Morwell.
    say('S2', 'S2-step-01', '曜火研究所的赫爾曼私下寄來一封短信：新的引域座標指向莫爾威爾，那裡還有人住。納爾瓦以確認詠唱參數為由，取得封存紀錄。');
    say('S2', 'S2-step-04', '得先確認莫爾威爾的人有沒有離開。儀式必須延後。');
    say('S2', 'S2-step-05', '回覆沒有提到居民，只要求按時準備。鐘樓增加了守衛。');

    // ── P1(+P2): Morwell's fate, no resonance, then ten years.
    say('P1', 'P1-step-01', '被朔放走後，納爾瓦送出了警告，卻沒能攔下儀式。另一名祭司在鐘下詠唱，夜域落在莫爾威爾。');
    after('P1', 'P1-step-01', [N('P1-step-01-b', get('P1', 'P1-step-01').frame, '幾天後，夜域退去。納爾瓦穿過空蕩的街道，在路旁的廢屋裡聽見哭聲，又細又啞，像是已經哭了很久。')]);
    say('P1', 'P1-step-04', '他抱起孩子，她的哭聲才慢慢低下去。後來的官方紀錄寫著：莫爾威爾，無人生還。');
    say('P1', 'P1-step-06', '登記孩子會引來查驗。一個被通緝的祭司，不能帶著孩子去任何官府。他決定自己養大她。');
    say('P2', 'P2-step-01', '十年過去。磷在逃亡中長大。每次搬家，納爾瓦都只讓她帶一個包；他沒說為什麼，她也學會了不問。');
    after('P2', 'P2-step-01', [N('P2-step-01-b', get('P2', 'P2-step-01').frame, '赫爾曼的信每隔幾個月寄來一封，這是納爾瓦和暮城唯一的聯繫。')]);
    drop('P2', ['P2-step-02', 'P2-step-04', 'P2-step-05', 'P2-step-06', 'P2-step-07', 'P2-step-08']);

    // ── T1/T3: Gran is a recruit of the capital's soldier corps.
    say('T1', 'T1-step-01', '暮城士兵團新兵格蘭第一次出任務：撤離蘭維爾。上頭說，那裡可能被夜域波及。');
    say('T1', 'T1-step-04', '夜域比預估更早到。消息還沒沿道路傳來，光先暗了。');
    say('T1', 'T1-step-05', '原集合點不能用了！走高地！', '隊長');
    say('T1', 'T1-step-06', '格蘭依剛確認的路線引導人群。高地只是暫時在夜域外，不是永遠安全。');
    say('T3', 'T3-step-08', '報告寫著「撤離部分成功」。撤離令為什麼來得這麼晚，沒有人回答他。');

    // ── S3: master and apprentice actually speak before the standoff; Ito does not chase afterwards.
    after('S3', 'S3-step-04', [
      D('S3-step-04-b', 0, '伊藤', '讓開。你知道自己在護著誰。'),
      D('S3-step-04-c', 0, '朔', '知道。所以不能讓。'),
      D('S3-step-04-d', 0, '伊藤', '我教你劍，不是教你違抗。'),
      D('S3-step-04-e', 0, '朔', '您教過我，看見了，就不能假裝沒看見。')
    ]);
    after('S3', 'S3-step-07', [N('S3-step-07-b', 1, '伊藤看著出口的方向，沒有追上去。')]);
    groups.S3 = [['S3-step-01', 'S3-step-02', 'S3-step-03'], ['S3-step-04', 'S3-step-04-b', 'S3-step-04-c'], ['S3-step-04-d', 'S3-step-04-e', 'S3-step-05'], ['S3-step-07', 'S3-step-07-b'], ['S3-step-09']];

    // ── A1: Rin overhears Herman sending Eve away. Frame 1 is now the lab with Eve and Herman.
    say('A1', 'A1-step-02', '凜，這次的目標是曜火研究所的赫爾曼。他準備洩露暮鐘技術。');
    say('A1', 'A1-step-03', '通行安排都在這裡。今晚就動手。');
    say('A1', 'A1-step-05', '當晚，凜避開巡查，從維修通道潛入研究所。研究室的燈還亮著，裡面有兩個人。');
    after('A1', 'A1-step-05', [
      N('A1-step-05-b', 1, '她躲在通道的暗處，聽不清他們在爭什麼，只聽見博士最後那一句。'),
      D('A1-step-05-c', 1, '赫爾曼', '妳走吧。走了，就別再回來！'),
      N('A1-step-05-d', 1, '一名紅髮女子奪門而出，從凜藏身的通道口跑過，沒有回頭。'),
      N('A1-step-05-e', 1, '凜等到腳步聲遠了，研究室裡只剩下一個人。')
    ]);
    say('A1', 'A1-step-06', '凜推門進去，站到唯一的出口前。赫爾曼看見她，沒有喊衛兵。');
    say('A1', 'A1-step-07', '是國王派你們來的吧。');
    say('A1', 'A1-step-08', '我只負責你的命。', '凜');
    // A2: the accident, without the shared-memory fragments.
    say('A2', 'A2-step-01', '凜向前逼近實驗台。赫爾曼還在找退路。');
    say('A2', 'A2-step-05', '壓縮的能量爆開，沿著管線反衝回槍身。');
    say('A2', 'A2-step-06', '握著槍的赫爾曼承受了大部分的反衝，倒下就沒再起來。凜摔在牆邊，右手留下灼傷。');
    say('A2', 'A2-step-09', '外面傳來腳步聲。凜用布條纏住右手，從維修通道離開。她是為了殺他而來，他卻不是死在她手上。');
    drop('A2', ['A2-step-08']);
    // A3: framed and wanted; she goes after the woman who left the lab.
    say('A3', 'A3-step-01', '凜回到尺烏，想問首腦為什麼博士會說出國王。門前卻沒有守衛。');
    say('A3', 'A3-step-06', '尺烏沒有其他生還者。凜在據點外割去制服標誌。');
    say('A3', 'A3-step-07', '隔天，告示貼滿暮城：尺烏叛國，暗殺博士，餘黨一名在逃。告示上畫的是她的臉。');
    after('A3', 'A3-step-07', [N('A3-step-07-b', get('A3', 'A3-step-07').frame, '她不能再用自己的名字走在街上。那晚研究室裡還有另一個人，那個被趕出去的紅髮女子。凜決定先找到她。')]);

    // ── E1/E2: the secret, and the same line Rin overheard.
    say('E1', 'E1-step-07', '伊芙查看眼前的線索。這批暮晶出自數十年前毀滅的村莊；舊名冊裡，有年紀相符的孩子。');
    say('E1', 'E1-step-08', '博士，這不是設備的聲音。');
    say('E1', 'E1-step-09', '赫爾曼沒有回答。他把樣本收回櫃子，鎖上了。');
    say('E2', 'E2-step-01', '伊芙把礦床、死亡人數、夜域停留的時間和晶體純度排在同一張表上。純度越高的暮晶，越常出自死人越多的地方。');
    say('E2', 'E2-step-02', '暮晶不是自己長出來的。是有人死在夜域裡，它才慢慢長成的，對嗎？');
    say('E2', 'E2-step-03', '這只是相關，還不是證明。');
    say('E2', 'E2-argue-01', '那就驗證！讓所有人都能查。');
    say('E2', 'E2-argue-02', '一旦公開，只會有人搶著往死人最多的地方挖。這件事妳別再碰。');
    say('E2', 'E2-step-04', '妳走吧。走了，就別再回來！');
    say('E2', 'E2-argue-04', '伊芙想再說些什麼，話卻卡在喉嚨。她摔門而出，跑過走廊，沒有回頭。');
    after('E2', 'E2-argue-04', [N('E2-argue-04-b', get('E2', 'E2-argue-04').frame, '她沒有看見，維修通道的暗處有人在看著她離開。')]);
    drop('E2', ['E2-argue-05', 'E2-step-05', 'E2-step-06', 'E2-step-07', 'E2-step-08', 'E2-step-09']);
    // E3: the safe behind the painting, Herman's letter, the gun, the escape; Rin watches.
    {
      const f0 = get('E3', 'E3-step-01').frame;
      before('E3', 'E3-step-01', [
        N('E3-step-00-a', f0, '隔天，伊芙聽說博士死了。告示說是尺烏的刺客幹的。'),
        N('E3-step-00-b', f0, '那天夜裡，她從博士帶她走過的維修通道潛回研究所。'),
        N('E3-step-00-c', f0, '研究室像被什麼震過一樣：玻璃碎了一地，櫃子倒在牆邊。士兵翻過每一個抽屜，紙張散滿地面。'),
        D('E3-step-00-d', f0, '伊芙', '他們在找東西。'),
        N('E3-step-00-e', f0, '牆上那幅畫還掛著。畫後面有一個保險箱，只有她知道。她小心移開畫框，轉開密碼鎖。'),
        N('E3-step-00-f', f0, '保險箱裡有一封信、一份設計圖，還有一包槍的零件。信封上寫著她的名字。'),
        D('E3-letter-a', f0, '赫爾曼的信', '伊芙：如果妳讀到這封信，我大概已經不在了。'),
        D('E3-letter-b', f0, '赫爾曼的信', '這幾年，我一直替國王做一套頭戴裝置。戴上它的人，能借暮晶的能量連上暮鐘，決定夜域落在哪裡。'),
        D('E3-letter-c', f0, '赫爾曼的信', '測試品完成那天，我才明白自己做的是武器。之後我一直找理由拖延，不讓它再強化下去。'),
        D('E3-letter-d', f0, '赫爾曼的信', '國王不會一直等。我趕妳走，是不想把妳一起拖下去。'),
        D('E3-letter-e', f0, '赫爾曼的信', '箱子裡有我替妳做的槍。帶著它，離開暮城。'),
        N('E3-letter-f', f0, '伊芙把信讀了兩遍，才把它和設計圖收進懷裡。')
      ]);
      drop('E3', ['E3-step-01', 'E3-step-02']);
      const search = get('E3', 'E3-search-parts');
      search.text = '布包裡的零件散開了。找齊五件，再開始組裝。';
      search.items = [['gun-0', '機匣', '槍的主體。其餘零件都裝在它上面。'], ['gun-1', '銃管', '博士親手車出來的銃管。'], ['gun-2', '握柄', '握柄的尺寸，剛好合她的手。'], ['gun-3', '暮晶核心', '小小的暮晶核心，組好之後才能蓄能。'], ['gun-4', '保險片', '過載時會碎裂、切斷能量的保險片，不能省略。']].map(([id, label, text]) => ({ id, label, text }));
      say('E3', 'E3-step-03', '把零件放入對應的輪廓，組裝博士留下的槍。');
      say('E3', 'E3-step-04', '槍組好了。伊芙還不熟悉它，但這是博士留給她的。');
      after('E3', 'E3-step-04', [
        N('E3-step-04-b', get('E3', 'E3-step-04').frame, '走廊傳來腳步聲。一名士兵的燈照進研究室。'),
        D('E3-step-04-c', get('E3', 'E3-step-04').frame, '士兵', '誰在裡面！')
      ]);
      say('E3', 'E3-step-05', '伊芙開了第一槍，擊碎門邊的燈。反作用力震得她手臂發麻。');
      say('E3', 'E3-step-06', '出口有更多士兵。伊芙護住信和設計圖，必須突破。');
      say('E3', 'E3-step-07', '戰勝阻路的士兵，帶著信與設計圖離開。');
      say('E3', 'E3-step-08', '伊芙衝出研究所，大衣被火燒破，懷裡的信還在。');
      after('E3', 'E3-step-08', [N('E3-step-08-b', get('E3', 'E3-step-08').frame, '對面屋頂上，凜看著她跑進夜色裡，沒有出聲。')]);
    }

    // ── P3(+P4): the farewell on the outskirts.
    replace('P3', [
      [0, 'n', '赫爾曼的信停了。納爾瓦在城外的告示板上，看見博士的死訊。告示說，兇手是尺烏的刺客。'],
      [0, 'd', '納爾瓦', '十年來，他是暮城裡唯一還會寫信給我的人。'],
      [0, 'd', '磷', '你要進城嗎？'],
      [0, 'd', '納爾瓦', '我進不去。城門口的通緝令上，還畫著我的臉。'],
      [0, 'n', '他攤開最後一封信。博士提到，有些研究用的物資被送往礦區，要查清去向，可以從文件庫的運送紀錄找起。'],
      [0, 'x', { type: 'inspect', text: '查看眼前的線索。', items: [{ id: 'item-1', label: '最後一封信', text: '博士在信中提到研究物資被送往礦區，建議查找文件庫的運送紀錄。' }, { id: 'item-2', label: '迪普霍姆', text: '博士在前一封信提過：他在查暮晶從哪裡來，線索指向迪普霍姆的礦坑。' }] }],
      [0, 'd', '納爾瓦', '博士在查暮晶從哪裡來。他最後提到的地方，是迪普霍姆的礦坑。我得先去那裡。'],
      [0, 'd', '磷', '那文件庫呢？'],
      [0, 'd', '納爾瓦', '磷，我需要拜託妳去調查。'],
      [1, 'n', '天還沒亮，納爾瓦陪磷走到暮城外的郊區。山丘那頭，看得見暮鐘的塔頂。'],
      [1, 'd', '納爾瓦', '沿這條路走，過了兩座石橋就是城門。不要說妳叫什麼名字，只說來找親戚。'],
      [1, 'a', '納爾瓦把一枚木書籤放進磷的手心。背面有幾道刻得歪歪扭扭的刀痕。'],
      [1, 'd', '納爾瓦', '這是一個朋友很久以前送我的。害怕的時候，就握著它。'],
      [1, 'd', '磷', '那你呢？'],
      [1, 'd', '納爾瓦', '查完了，就到迪普霍姆來找我。我會在那裡等妳。'],
      [2, 'n', '磷走了一段路，回頭時，納爾瓦還站在原地。她握緊書籤，沒有再回頭。']
    ], [['p3-stage-1', '告示上的死訊'], ['phosphor-parting', '郊區送別'], ['p4-stage-3', '一個人進城']]);
    replace('P4', [[0, 'c', '收錄這段記憶，保存本節點進度。']], [['p4-stage-3', '一個人進城']]);

    // ── B1(+B2): the wolves, the soldier corps, the knife marks.
    const wolves = get('B1', 'B1-step-02'), knife = get('B2', 'B2-step-03');
    replace('B1', [
      [0, 'n', '傍晚，磷還沒走到第二座石橋，天就暗了。路旁的草叢裡亮起幾雙眼睛。一群被暮晶侵蝕的野狼圍了上來，背上的晶刺在暮色裡發白。'],
      [0, 'd', '磷', '走開……走開！'],
      [0, 'n', '一道人影從路邊衝出來，拔刀擋在她前面。'],
      [0, 'x', { ...JSON.parse(JSON.stringify(wolves)), text: '朔擋在磷身前，擊退撲上來的晶狼。' }],
      [1, 'n', '最後一頭晶狼退回草叢。朔收刀，回頭看那個孩子。她兩手緊緊握著一樣東西。'],
      [1, 'd', '朔', '受傷了嗎？……妳手上拿的是什麼？'],
      [1, 'a', '磷把手藏到身後。朔還是看見了：一枚木書籤，背面有刀痕。'],
      [1, 'd', '朔', '那枚書籤，妳從哪裡——'],
      [1, 'n', '馬蹄聲打斷了他。一隊暮城士兵沿著大路過來，領頭的人舉著盾。'],
      [2, 'd', '格蘭', '剛才是狼群？你們有沒有受傷？'],
      [2, 'd', '朔', '沒事。孩子嚇到了而已。'],
      [2, 'd', '格蘭', '天黑了，這段路不安全。你，護送他們進城。'],
      [2, 'd', '士兵', '隊長，城外撿到沒有登記的孩子，要不要回報國王？'],
      [2, 'x', { type: 'inspect', text: '查看眼前的線索。', items: [{ id: 'item-1', label: '回報單', text: '士兵已寫上地點與時間，「姓名」「來歷」兩欄是空的。' }, { id: 'item-2', label: '士兵團的行軍令', text: '格蘭腰間的命令筒封著王室的蠟印。目的地：迪普霍姆。' }] }],
      [2, 'd', '格蘭', '不用。她只是在路上被狼圍住。'],
      [2, 'd', '士兵', '可是規定……'],
      [2, 'd', '格蘭', '我來負責。我們要趕在天亮前到迪普霍姆。'],
      [2, 'n', '士兵團的燈往礦區的方向遠去。一名士兵領著朔和磷走向城門。'],
      [2, 'c', '收錄這段記憶，保存本節點進度。']
    ], [['b1-stage-1', '野狼襲擊'], ['swordsman-return', '書籤'], ['tank-refusal', '士兵團']]);
    replace('B2', [
      [0, 'n', '護送的士兵把兩人留在城門內，就轉身回去了。'],
      [0, 'd', '朔', '現在可以告訴我了。那枚書籤，是誰給妳的？'],
      [0, 'd', '磷', '……爸爸說，不能告訴別人我的名字。'],
      [0, 'd', '朔', '那就不說名字。只說書籤。'],
      [0, 'x', { ...JSON.parse(JSON.stringify(knife)), text: '磷取出書籤。朔把它翻過來，指著背面的刀痕。' }],
      [0, 'd', '朔', '這是我刻的。刻得很爛，對吧？十年前，我把它送給一個在鐘樓的朋友。'],
      [0, 'd', '磷', '……納爾瓦？'],
      [0, 'n', '朔沒有回答，只是很久沒說話。'],
      [0, 'd', '朔', '他還活著？'],
      [0, 'd', '磷', '嗯。他在迪普霍姆等我。他要我先來文件庫，查赫爾曼博士留下的東西。'],
      [0, 'd', '朔', '赫爾曼……城裡說，他被尺烏殺了。'],
      [0, 'd', '磷', '爸爸說，答案在文件庫裡。'],
      [0, 'd', '朔', '文件庫晚上有守衛。妳一個人進不去。我陪妳去。'],
      [0, 'c', '收錄這段記憶，保存本節點進度。']
    ], [['b2-stage-1', '暮城']]);

    // ── C4: the archive.
    const vault = get('C4', 'C4-step-33-search'), outer = get('C4', 'C4-step-16'), inner = get('C4', 'C4-step-32');
    replace('C4', [
      [0, 'n', '深夜，朔帶著磷從側門溜進文件庫。架子高到看不見頂，燈只點到第三層。'],
      [0, 'n', '磷攤開博士寄給父親的信。'],
      [1, 'n', '他們轉過乙列的架子，迎面撞上一個紅髮女人。她的手已經按在腰間的槍上。'],
      [1, 'd', '伊芙', '別動。你們是誰？'],
      [1, 'd', '朔', '這句話，該我們問。'],
      [1, 'd', '磷', '我們在找赫爾曼博士的東西。'],
      [1, 'n', '伊芙的手停住了。'],
      [1, 'd', '伊芙', '妳認識博士？'],
      [1, 'd', '磷', '博士說，有些研究用的東西被送去了礦區。爸爸要我來找運送紀錄。'],
      [1, 'd', '伊芙', '我是他的學生。研究所的東西？給我看看。'],
      [1, 'n', '伊芙讀完信，望向一排排卷宗。最上層的走廊裡，凜蹲在欄杆的陰影後面，看著他們。'],
      [1, 'x', { ...JSON.parse(JSON.stringify(vault)), text: '查找研究物資送往礦區的紀錄。', items: [{ id: 'sealed-order', label: '運送紀錄', text: '研究所的測試品、暮晶和實驗物資，全部運往迪普霍姆的礦坑。' }] }],
      [1, 'd', '伊芙', '暮晶、實驗物資……還有測試品。收貨地點是迪普霍姆。'],
      [1, 'd', '磷', '爸爸去的就是那裡。'],
      [1, 'd', '朔', '這裡還附著王室命令，要士兵團看守礦坑。'],
      [2, 'n', '朔正要往下看，門外傳來了腳步聲。走廊的燈一盞接一盞亮起。'],
      [2, 'd', '士兵', '裡面有人！封住出口！'],
      [2, 'x', { ...JSON.parse(JSON.stringify(outer)), text: '伊芙與朔擋下第一批士兵。' }],
      [2, 'n', '更多士兵從另一頭圍過來。朔把磷拉到身後，伊芙的槍只剩兩發。'],
      [3, 'n', '一道人影從上層落下，刀光掃過帶頭士兵的盾。是凜。'],
      [3, 'x', { ...JSON.parse(JSON.stringify(inner)), text: '凜、伊芙與朔一起擊退圍上來的士兵。' }],
      [3, 'c', '收錄這段記憶，保存本節點進度。']
    ], [['c4-stage-1', '文件庫'], ['c4-stage-1', '乙列'], ['c4-outer-corridor', '封鎖'], ['c4-inner-vault', '凜現身']]);

    after('C4', 'C4-r11', [D('C4-r11-a', 1, '伊芙', '找物資運送的紀錄。看看送了什麼，又送去了哪裡。')]);

    // ── C5: the gun.
    replace('C5', [
      [0, 'n', '最後一名士兵倒下。散落的紙張還在地上飄。伊芙轉身，槍口對準了凜。'],
      [0, 'd', '伊芙', '我在告示上看過妳的臉。妳是殺博士的刺客。'],
      [0, 'd', '凜', '我是去殺他的。但他不是死在我手上。'],
      [0, 'd', '伊芙', '每個兇手都會這麼說。'],
      [0, 'd', '凜', '那天晚上，我在研究室外面，看著妳跑出來。'],
      [0, 'd', '凜', '妳走之前，他對妳說：「妳走吧。走了，就別再回來。」'],
      [0, 'n', '伊芙握槍的手停住了。那句話，只有她和博士知道。'],
      [0, 'd', '伊芙', '……然後呢？'],
      [0, 'd', '凜', '他問我，是不是國王派我們來的。他拿起一把沒做完的槍，開了一槍。槍炸了。'],
      [0, 'd', '凜', '隔天，我的組織全死了。告示上說我叛國。'],
      [0, 'n', '伊芙想起信上的那一句：國王不會一直等。'],
      [0, 'd', '磷', '她如果要殺我們，剛才就不用跳下來了。'],
      [0, 'd', '朔', '追兵還會再來。要問，路上問。'],
      [0, 'n', '伊芙慢慢放下槍。'],
      [0, 'd', '伊芙', '我還不相信妳。但妳知道的事，我需要。'],
      [0, 'd', '凜', '我也一樣。'],
      [1, 'n', '設計圖上的頭戴裝置、運往礦坑的測試品、看守礦坑的命令，指向同一個地方。'],
      [1, 'd', '伊芙', '答案在迪普霍姆。'],
      [1, 'd', '磷', '爸爸也在那裡。'],
      [1, 'n', '天亮之前，四個人離開了暮城。'],
      [1, 'c', '收錄這段記憶，保存本節點進度。']
    ], [['party-gun', '槍口'], ['c4-stage-3', '離開暮城']]);

    // ── C8(+C9): the recorder, the abyss, Narva; the griffin and the lab.
    const mapPuzzle = get('C8', 'C8-step-02'), recorder = get('C9', 'C9-step-07'), abyss = get('C9', 'C9-step-17');
    replace('C8', [
      [0, 'n', '迪普霍姆的礦坑口沒有守衛。地上留著士兵團的腳印，一路往裡面去。'],
      [0, 'd', '磷', '爸爸的筆記裡有一張礦坑地圖，被撕成了好幾塊。'],
      [0, 'd', '伊芙', '拼回去，就知道他往哪條坑道走了。'],
      [0, 'x', { ...JSON.parse(JSON.stringify(mapPuzzle)), text: '把納爾瓦筆記裡的礦坑地圖拼回去，找出他走的坑道。' }],
      [0, 'n', '坑道兩側的岩壁裡，嵌著一條條發著冷光的暮晶。'],
      [1, 'd', '伊芙', '這裡的暮晶純度很高。……高得不正常。'],
      [1, 'n', '翻倒的礦車旁，磷看見一台半埋在土裡的錄音機。'],
      [1, 'd', '磷', '這是爸爸的！'],
      [1, 'n', '錄音機摔壞了，接頭鬆脫，按下去只有雜音。'],
      [1, 'x', { ...JSON.parse(JSON.stringify(recorder)), text: '伊芙把三個接頭放進相同形狀的插槽，修好錄音機。' }],
      [1, 'd', '納爾瓦的錄音', '磷，如果妳聽到這段，就別再往裡面走。'],
      [1, 'd', '納爾瓦的錄音', '礦坑深處有人在做實驗。士兵團剛剛往下面去了，他們不知道裡面是什麼。'],
      [1, 'd', '納爾瓦的錄音', '我在裡面遇見一個東西，走路的樣子像人，身上一半已經變成晶體。我叫它冥淵。'],
      [1, 'd', '納爾瓦的錄音', '不只一個。它們在坑道裡……等一下，有聲音——'],
      [1, 'n', '錄音在這裡斷了。'],
      [1, 'c', '收錄這段記憶，保存本節點進度。']
    ], [['c8-stage-1', '迪普霍姆'], ['party-recorder', '錄音機']]);
    replace('C9', [
      [0, 'n', '坑道深處傳來低沉的咆哮，像有人被硬生生拉長了喉嚨。'],
      [0, 'd', '朔', '是冥淵。'],
      [0, 'd', '凜', '三個。伊芙，顧好孩子。'],
      [0, 'x', { ...JSON.parse(JSON.stringify(abyss)), text: '凜、朔與伊芙聯手擊退冥淵，守住磷。' }],
      [0, 'n', '最後一隻冥淵倒下，身上的晶體像碎玻璃一樣散落。磷沒有走近去看。'],
      [1, 'n', '坑道轉角，有人靠著岩壁坐著，斗篷被血染黑了一片。'],
      [1, 'd', '磷', '爸爸！'],
      [1, 'd', '納爾瓦', '磷……我不是叫妳別進來嗎。'],
      [1, 'n', '朔在他身旁蹲下。兩人看著彼此，都沒有先開口。'],
      [1, 'd', '朔', '十年了。'],
      [1, 'd', '納爾瓦', '書籤……還在她手上？'],
      [1, 'd', '朔', '在。'],
      [1, 'd', '納爾瓦', '士兵團在下面遇襲了。我看見一個很大的東西，有翅膀……他們撐不了多久。'],
      [1, 'd', '伊芙', '他的傷口要先止血。'],
      [1, 'd', '磷', '我留下來陪爸爸。'],
      [1, 'd', '凜', '我們下去。'],
      [2, 'n', '越往下走，暮晶的光越亮。坑道盡頭是一個被挖空的大洞窟。'],
      [2, 'n', '洞窟裡躺滿了士兵，沒有一個在動。只有一個人還舉著盾，單膝跪在中間。'],
      [2, 'd', '朔', '是那個隊長。'],
      [2, 'd', '格蘭', '別過來！……它還在上面。'],
      [2, 'n', '黑暗裡展開一對巨大的翅膀，羽毛有一半是晶體。一頭獅鷲從洞頂落下，脖子上掛著斷掉的鐵鍊。兩隻冥淵跟著從暗處爬出來。'],
      [2, 'd', '伊芙', '那條鐵鍊……它是被養在這裡的。'],
      [2, 'd', '格蘭', '我的人全倒了。你們快走。'],
      [2, 'd', '凜', '你一個人撐不住。'],
      [2, 'd', '朔', '一起上。'],
      [2, 'x', { type: 'battle', ref: 'C9-griffin', text: '格蘭與眾人聯手擊倒獅鷲和冥淵。' }],
      [3, 'n', '獅鷲倒下，晶體碎了一地。格蘭的盾也裂開了。'],
      [3, 'n', '洞窟後方有一道鐵門。門裡是籠子、裝著暮晶的玻璃槽，和一張張綁著皮帶的檯子。'],
      [3, 'x', { type: 'inspect', text: '查看實驗室裡留下的紀錄。', items: [{ id: 'item-1', label: '實驗紀錄', text: '用暮晶侵蝕活物，觀察變化。獅鷲是成功的一個；冥淵，是失敗的那些人。' }, { id: 'item-2', label: '士兵團名冊', text: '每個名字旁邊只寫著兩個字：看守。另一欄是：可作為人體實驗。' }] }],
      [3, 'd', '格蘭', '……可作為人體實驗。'],
      [3, 'n', '格蘭把那一頁撕下來，摺好，放進胸口。'],
      [3, 'c', '收錄這段記憶，保存本節點進度。']
    ], [['c9-stage-1', '冥淵'], ['c9-stage-3', '納爾瓦'], ['c9-abyss-emergence', '洞窟'], ['c9-stage-3', '實驗室']]);

    // ── G1: the truth. H1: the bell's control room.
    replace('G1', [
      [0, 'n', '他們把納爾瓦帶回暮城，躲進城南一間廢棄的倉庫。格蘭也跟來了。'],
      [0, 'n', '桌上攤著博士的信、頭戴裝置的設計圖、運送紀錄、錄音機，和那一頁名冊。'],
      [0, 'd', '納爾瓦', '我當了十二年祭司。每一次在鐘下祈福，我都相信夜域是被我們趕走的。'],
      [0, 'd', '納爾瓦', '直到赫爾曼寄信給我。他說，鐘響的時候，夜域沒有消失，只是被送去了別的地方。'],
      [0, 'd', '納爾瓦', '要送去哪裡，由王室決定。十年前，他們選了莫爾威爾。'],
      [0, 'n', '磷抬起頭。她知道那個名字。'],
      [0, 'd', '伊芙', '而暮晶，是有人死在夜域裡才長出來的。'],
      [0, 'd', '伊芙', '被送去夜域的城，死的人越多，長出的暮晶越多。'],
      [0, 'd', '凜', '那些暮晶，就運進迪普霍姆。'],
      [0, 'd', '伊芙', '拿去做實驗，也拿去做這個。博士說，戴上它的人，能決定夜域落在哪裡。'],
      [0, 'd', '朔', '所以不聽話的城，就會被選中。'],
      [0, 'd', '納爾瓦', '祭司跪在鐘下，是做給人看的。真正讓鐘動的，從來不是祈禱。'],
      [0, 'n', '格蘭一直沒有說話。他從胸口拿出那一頁名冊，放在桌上。'],
      [0, 'd', '格蘭', '我的人以為自己在守城。'],
      [0, 'd', '格蘭', '我當新兵的時候，撤離令也是晚了一步才來。我那時候以為，只是上面算錯了。'],
      [0, 'd', '格蘭', '我跟你們走。'],
      [0, 'd', '納爾瓦', '暮鐘的操控室在鐘樓底下。只要關掉主閥，鐘就送不出夜域。我知道路。'],
      [0, 'c', '收錄這段記憶，保存本節點進度。']
    ], [['g1-stage-1', '真相']]);
    const king = get('H1', 'H1-step-18');
    replace('H1', [
      [0, 'n', '深夜，納爾瓦帶著眾人從鐘樓的維修入口潛入。十年前他逃出去的那條路，現在走了回來。'],
      [0, 'n', '操控室裡，粗大的銅管沿著牆壁爬上鐘樓。正中間是一座刻著王室紋章的主閥。'],
      [0, 'd', '納爾瓦', '就是它。'],
      [0, 'a', '格蘭和朔一起轉動主閥。齒輪一格一格卡住，銅管裡的聲音慢慢低了下去。'],
      [0, 'n', '然後，那個聲音又回來了。比剛才更穩。'],
      [0, 'd', '伊芙', '不對……閥門關了，能量還在走。它沒有經過這裡，有另一條線路。'],
      [0, 'n', '四周的門同時落下了閂鎖。操控室上方的走廊，有人慢慢走了出來。他頭上戴著一圈發光的銅環，暮晶在額前亮著。'],
      [0, 'd', '伊芙', '……頭戴裝置。'],
      [1, 'd', '路易斯', '你們會來，我並不意外。關掉那個閥門，是祭司教你們的吧。可惜，暮鐘早就不需要祭司了。'],
      [1, 'd', '納爾瓦', '你把莫爾威爾送進了夜域。'],
      [1, 'd', '路易斯', '夜不會消失，只會被送去別處。我決定它落在誰的頭上：順從的城市得到平靜的夜，不順從的得到夜域。這比刀劍好用得多。'],
      [1, 'd', '磷', '那些人做錯了什麼？'],
      [1, 'd', '路易斯', '不是做錯了什麼。是不夠懂事。'],
      [1, 'd', '格蘭', '我的士兵呢？他們夠懂事了吧。'],
      [1, 'd', '路易斯', '所以他們死得有用。'],
      [1, 'n', '士兵從四周的門後湧進來。路易斯拔出佩劍。'],
      [1, 'x', { ...JSON.parse(JSON.stringify(king)), text: '擊敗路易斯與王室士兵。' }],
      [2, 'n', '操控室安靜了下來，只剩下眾人粗重的呼吸聲。'],
      [2, 'c', '收錄這段記憶，保存本節點進度。']
    ], [['h1-stage-1', '暮鐘操控室'], ['h1-stage-2', '路易斯'], ['h1-stage-3', '路易斯倒下']]);
    const g1 = chapters.find(c => c.id === 'G1'), h1 = chapters.find(c => c.id === 'H1');
    if (g1) { g1.title = '真相'; g1.background = 'table'; }
    if (h1) { h1.title = '暮鐘操控室'; }

    // ── H2「硬幣」(docs/design/STORY-H2-coin.md): the ending after the King. A random coin picks one of two branches
    // (steps carry branch 'sun' | 'night'); story-campaign.js keeps only the rolled branch while the chapter is played.
    {
      P.H2 = { frames: [], steps: [] };
      const common = [
        [0, 'n', '路易斯倒在主控台前。額前的暮晶閃了兩下，暗了。'],
        [0, 'n', '伊藤收起劍。他是循著鐘樓的騷動趕來的；路易斯說的每一句話，他都聽見了。'],
        [0, 'd', '朔', '……師父。'],
        [0, 'd', '伊藤', '十年前我問你，鐘停了，城裡的人怎麼辦。'],
        [0, 'd', '伊藤', '原來城裡的人，一直都在被挑選。'],
        [0, 'n', '鐘樓底下傳來號角，一聲接著一聲。'],
        [0, 'd', '格蘭', '是士兵團的集合號。全團都來了。'],
        [0, 'd', '納爾瓦', '維修通道還能走。我帶路。'],
        [0, 'd', '凜', '通道太窄，走不快。得有人留下來擋。'],
        [0, 'd', '伊藤', '我留下。'],
        [0, 'd', '凜', '我也是。'],
        [0, 'd', '朔', '凜——'],
        [0, 'd', '凜', '帶孩子走。'],
        [0, 'n', '伊芙經過凜身邊時停了一下，什麼也沒說，轉身跟上。'],
        [1, 'n', '門一扇接一扇被撞開，士兵湧進操控室。'],
        [1, 'n', '伊藤守左邊，凜守右邊。兩人背對背，不讓任何人靠近維修通道。'],
        [1, 'n', '不知道過了多久，伊藤的劍越來越慢。'],
        [2, 'n', '他單膝跪下。一名槍兵走到他面前，舉起了槍。'],
        [2, 'n', '伊藤來不及躲。'],
        [3, 'n', '槍響。凜擋在他身前，右手迎向子彈。'],
        [3, 'n', '震盪從她掌心炸開，子彈偏了出去，打進牆裡。'],
        [3, 'n', '右邊的袖子裂開，繃帶散落一地。'],
        [3, 'n', '那隻手已經不像手了。暮晶從那晚的傷口長出來，一路爬上手臂。'],
        [3, 'd', '伊藤', '妳……'],
        [3, 'd', '凜', '那晚的傷，一直沒好。'],
        [3, 'd', '凜', '這樣下去，不知道還能撐多久。'],
        [3, 'd', '凜', '我要毀掉暮鐘。你走。'],
        [3, 'd', '伊藤', '妳一個人——'],
        [3, 'd', '凜', '總得有人活著，告訴他們這裡發生了什麼。'],
        [3, 'a', '凜擋下追上來的士兵，把伊藤推進維修通道。'],
        [3, 'n', '伊藤回頭時，通道的門已經在她身後關上。'],
        [4, 'n', '操控室裡只剩凜一個人。士兵從每一扇門湧進來，把她圍在中間。'],
        [4, 'd', '士兵', '放下武器！'],
        [4, 'n', '凜從口袋拿出一枚硬幣。一面是太陽，一面是夜襲，中間鑲著一小片暮晶。'],
        [4, 'd', '凜', '太陽朝上，我就自首。'],
        [4, 'd', '凜', '夜襲朝上，擋路的人，一個都不留。'],
        [4, 'x', { type: 'coin', text: '凜把硬幣彈上半空。', label: '擲出硬幣' }],
        [4, 'n', '硬幣轉到最高點，停了一瞬。']
      ];
      const flashback = [
        [6, 'n', '（倒敘）撤離分頭的那一刻。'],
        [6, 'n', '伊芙在凜身邊停下，把槍塞進她手裡。'],
        [6, 'd', '伊芙', '也許妳會用到它。'],
        [6, 'n', '那是博士留給伊芙的槍。她沒等凜回答，就轉身走了。']
      ];
      const sun = [
        [5, 'n', '太陽。'],
        [14, 'd', '士兵', '她拔槍了！'],
        [14, 'n', '凜的左手伸向後背，抽出一把槍。'],
        ...flashback,
        [14, 'd', '凜', '我說了，我會自首。'],
        [14, 'd', '凜', '……向那些死在夜域裡的人。'],
        [7, 'a', '凜開槍。震盪波擊中半空的硬幣。'],
        [7, 'n', '硬幣上的暮晶亮起，裂開。'],
        [7, 'n', '白光吞沒了操控室，接著又往回收，縮進那片碎掉的晶體裡。'],
        [7, 'n', '銅管一根接一根亮起，能量沿著管線倒灌回暮鐘。'],
        [7, 'n', '就像那晚，博士的那一槍。']
      ];
      const night = [
        [8, 'n', '夜襲。'],
        [9, 'n', '硬幣還沒落地，凜已經衝了出去。'],
        [9, 'x', { type: 'battle', ref: 'H2-night', text: '凜獨自迎戰湧進操控室的士兵。擊倒 15 名士兵。' }],
        [10, 'n', '倒下的士兵越來越多。剩下的人握著武器，一步一步往後退。'],
        [10, 'd', '士兵', '那……那還是人嗎？'],
        [10, 'n', '有人先轉身跑了，接著是第二個、第三個。士兵爭著逃出鐘樓。'],
        [10, 'n', '凜站在操控室中間。晶體已經爬上她的臉頰。'],
        [10, 'n', '右手在發抖。那隻手，快要不聽她的了。'],
        [10, 'd', '凜', '……還不行。'],
        [10, 'n', '她的左手伸向後背。'],
        ...flashback,
        [11, 'n', '凜抽出那把槍。硬幣滾到腳邊，她沒有去撿。'],
        [15, 'n', '暮鐘的核心晶石就在操控室中央，每一根銅管都連著它。'],
        [15, 'n', '右手撐在銅管上，已經抬不起來。她用左手舉槍，槍口對準那顆晶石。'],
        [15, 'd', '凜', '博士那一槍是意外。這一槍，是我自己開的。'],
        [15, 'a', '凜扣下扳機。'],
        [15, 'n', '能量沿著管線，倒灌回暮鐘。']
      ];
      const ending = [
        [12, 'n', '城外的山坡上，眾人停下腳步，回過頭。'],
        [12, 'n', '伊藤是最後一個爬上來的。他身後沒有別人。'],
        [12, 'n', '暮鐘亮了。不是鐘聲，是光。'],
        [12, 'n', '一道能量從鐘樓衝上天空，把夜色撕開。'],
        [12, 'n', '震盪一圈一圈掃過暮城，掃過山坡，掃向更遠的地方。'],
        [12, 'n', '等一切停下，鐘樓已經不在了。'],
        [13, 'n', '伊芙攤開手。她一直帶在身上的暮晶樣本失去了光澤，成了一塊黑炭。'],
        [13, 'n', '那一夜，維斯珀蘭所有的暮晶都熄滅了。'],
        [13, 'c', '收錄這段記憶。']
      ];
      const steps = replace('H2', [...common, ...sun, ...night, ...ending], [
        ['h2-ito-arrives', '撤離'], ['h2-frontline', '前線'], ['h2-ito-gunpoint', '前線'], ['h2-rin-blocks', '前線'], ['h2-coin-toss', '硬幣'],
        ['h2-coin-sun', '太陽'], ['h2-flashback-eve-gun', '分頭的那一刻'], ['h2-sun-shot', '太陽'],
        ['h2-coin-night', '夜襲'], ['h2-night-battle', '夜襲'], ['h2-soldiers-flee', '夜襲'], ['h2-night-last-shot', '夜襲'],
        ['h2-bell-explosion', '鐘'], ['h2-crystal-charcoal', '鐘'], ['h2-sun-draw', '太陽'], ['h2-night-aim', '夜襲']
      ]);
      steps.slice(common.length, common.length + sun.length).forEach(item => { item.branch = 'sun'; });
      steps.slice(common.length + sun.length, common.length + sun.length + night.length).forEach(item => { item.branch = 'night'; });
      P.H2.allSteps = steps.slice();
    }

    // Map cards of the origin chapters.
    {
      const O = window.NDStoryOrigins, set = (job, i, intro, after) => { const n = O[job].nodes[i]; if (intro) n[3] = intro; if (after) n[4] = after; };
      set('assassin', 0, '凜從小在尺烏長大，首腦是唯一會叫她名字的人。第一次正式暗殺的目標，是曜火研究所的赫爾曼。任務說他準備洩露暮鐘技術。', '凜潛入研究所，聽見博士趕走一名紅髮女子。她推門進去，赫爾曼只問：「是國王派你們來的吧。」');
      set('assassin', 1, '赫爾曼拿起尚未完成的實驗銃開槍。子彈擦過凜的右手，撞上金屬設施。', '能量反衝回槍身，赫爾曼死於反噬。凜帶著右手的灼傷，從維修通道離開。');
      set('assassin', 2, null, '尺烏沒有其他生還者。告示指控尺烏叛國，畫的是凜的臉。她隱藏身分，開始去找那晚被趕出研究室的紅髮女子。');
      set('tank', 0, '暮城士兵團新兵格蘭第一次出任務：撤離蘭維爾。廣場上卻還貼著無須撤離，居民不肯拋下家業。', '夜域比預估更早到，光先暗了。隊伍放棄集合點，轉向高地。高地只是暫時在夜域外，不是永遠安全。');
      set('tank', 2, null, '母女活了下來，隊員在盾崩裂前把格蘭拖出通道。報告寫著「撤離部分成功」。撤離令為什麼來得這麼晚，沒有人回答他。');
      set('gunner', 0, null, '舊名冊裡有年紀相符的孩子。伊芙說這不是設備的聲音，赫爾曼沒有回答，把樣本鎖進櫃子。');
      set('gunner', 1, null, '赫爾曼要她走，別再回來。伊芙摔門而出，沒有看見暗處有人在看著她。');
      set('gunner', 2, '隔天，博士死了。伊芙潛回被翻過的研究室，移開畫框，打開只有她知道的保險箱。', '博士在信裡說出頭戴裝置的事，留給她一把槍。伊芙組好槍，擊退士兵逃出研究所。屋頂上，凜看著她離開。');
      const S = window.NDCampaignSpecs;
      if (S.E2) S.E2 = [['那句話', '「妳走吧。走了，就別再回來！」'], ['暮晶的來源', '純度越高的暮晶，越常出自死人越多的地方。']];
      if (S.E3) S.E3 = [['博士的信', '他替國王做頭戴裝置；他趕伊芙走，是不想把她拖下去。'], ['設計圖', '頭戴裝置的設計圖。'], ['博士的槍', '保險箱裡的零件，組成一把能自保的槍。']];
      if (S.A1) S.A1 = [['國王', '赫爾曼一看到凜，就問是不是國王派她來的。'], ['紅髮女子', '博士趕走的研究員，奪門而出。']];
      if (S.A3) S.A3 = [['通緝告示', '尺烏叛國，畫的是凜的臉。'], ['清洗者', '清洗者使用只向內部開放的入口。']];
    }
    // Reading groups: rewritten chapters read one beat at a time; the edited ones lose the ids that were dropped.
    for (const n of rewritten) delete groups[n];
    for (const n of Object.keys(groups)) {
      if (!P[n]) { delete groups[n]; continue; }
      const at = new Map(P[n].steps.map((s, i) => [s.id, i])), kept = [];
      for (const group of groups[n]) {
        let run = [];
        for (const id of group) { if (!at.has(id)) continue; if (run.length && at.get(id) !== at.get(run.at(-1)) + 1) { kept.push(run); run = []; } run.push(id); }
        if (run.length) kept.push(run);
      }
      groups[n] = kept;
    }

    // Shared line: drop the cut chapters; retitle the rest. [id, title, image, intro, after, evidence]
    const CUT = new Set(['B3', 'C1', 'C2', 'C3', 'C6', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'F1', 'F4']);
    const shared = window.NDCampaignShared;
    for (let i = shared.length - 1; i >= 0; i--) if (CUT.has(shared[i][0])) shared.splice(i, 1);
    if (!shared.some(entry => entry[0] === 'H2')) shared.push(['H2', '硬幣', 'party-road', '', '', []]);
    const card = {
      P1: ['路旁的嬰兒', 'p1-morwell-ruins', '夜域落在莫爾威爾。逃亡中的納爾瓦，在廢屋裡聽見哭聲。', '十年過去。赫爾曼的信，是納爾瓦和暮城唯一的聯繫。', [['莫爾威爾', '官方紀錄寫著無人生還，納爾瓦卻在那裡抱起一個孩子。'], ['赫爾曼的信', '每隔幾個月一封，是他和暮城唯一的聯繫。']]],
      P3: ['送別', 'phosphor-parting', '赫爾曼的信停了。被通緝的納爾瓦進不了城。', '磷帶著書籤一個人走向暮城；納爾瓦往迪普霍姆去。', [['博士的來信', '研究物資被送往礦區，文件庫的運送紀錄可能留下了它們的去向。'], ['木書籤', '一個朋友很久以前送給納爾瓦的書籤，背面有刀痕。']]],
      P4: ['送別', 'phosphor-parting', '', '磷帶著書籤一個人走向暮城；納爾瓦往迪普霍姆去。', []],
      B1: ['野狼與士兵團', 'swordsman-return', '磷在城外遇上狼群，一名劍客出手相救。', '朔認出書籤背面的刀痕，決定陪磷去文件庫。', [['回報單', '格蘭沒有把磷回報給國王。'], ['行軍令', '士兵團奉王室命令前往迪普霍姆。'], ['刀痕', '十年前朔親手刻的書籤。']]],
      B2: ['刀痕', 'swordsman-return', '', '朔認出書籤背面的刀痕，決定陪磷去文件庫。', []],
      C4: ['文件庫', 'c4-inner-vault', '朔帶磷潛進文件庫，撞見同樣在找博士遺物的伊芙。', '運送紀錄指向迪普霍姆。士兵包圍時，凜從上層現身。', [['運送紀錄', '測試品、暮晶和實驗物資，全部運往迪普霍姆。'], ['王室命令', '派士兵團看守迪普霍姆的礦坑。']]],
      C5: ['槍口', 'party-gun', '伊芙舉槍對準告示上的刺客。', '凜說出只有在場的人才知道的那句話。四人離開暮城，前往迪普霍姆。', [['那句話', '「妳走吧。走了，就別再回來。」凜那晚在研究室外。']]],
      C8: ['錄音機', 'c9-abyss-emergence', '迪普霍姆的礦坑口沒有守衛，只有士兵團的腳印。', '格蘭的士兵團被當成看守和犧牲品；礦坑深處的實驗室證實了這一切。', [['納爾瓦的錄音', '礦坑深處有人在做實驗；冥淵走路的樣子像人。'], ['實驗紀錄', '獅鷲是成功的一個；冥淵，是失敗的那些人。'], ['士兵團名冊', '名字旁寫著：看守、可作為人體實驗。']]],
      C9: ['礦坑深處', 'c9-abyss-emergence', '', '格蘭的士兵團被當成看守和犧牲品；礦坑深處的實驗室證實了這一切。', []],
      G1: ['真相', 'party-road', '博士的信、設計圖、錄音機與名冊攤在同一張桌上。', '格蘭決定加入。納爾瓦知道通往暮鐘操控室的路。', [['暮鐘', '鐘響時夜域沒有消失，只是被送去別處。'], ['暮晶', '被送去夜域的城死的人越多，長出的暮晶越多。'], ['頭戴裝置', '戴上它的人，能決定夜域落在哪裡。']]],
      H2: ['硬幣', 'h2-coin-toss', '國王倒下了，士兵團卻湧進了暮鐘。凜和伊藤留下來斷後。', '那一夜，暮鐘被夷為平地，維斯珀蘭所有的暮晶都熄滅了。', [['凜的右手', '暮晶從那晚的傷口長出來，一路爬上手臂。'], ['伊芙的槍', '分頭時，伊芙把博士留給她的槍塞給了凜。'], ['暮鐘', '鐘樓已經不在了。暮晶失去光澤，成了炭。']]],
      H1: ['暮鐘操控室', 'h1-louis-showdown', '眾人潛入鐘樓底下的操控室，要關掉暮鐘。', '主閥關了，鐘卻沒有停。戴著頭戴裝置的路易斯出現了。', [['另一條線路', '主閥關閉後，能量仍從別處送進暮鐘。']]]
    };
    for (const entry of shared) {
      const c = card[entry[0]]; if (!c) continue;
      entry[1] = c[0]; if (window.NDStoryArt.scenes.some(s => s.id === c[1])) entry[2] = c[1]; entry[3] = c[2]; entry[4] = c[3]; entry[5] = c[4];
    }
  }
  // A1 + A2 are a single chapter. A1's own completion step goes; A2's frames and steps follow A1's.
  {
    const P = window.NDStoryPerformances, groups = window.NDStoryReadingGroups.groups, first = P.A1, second = P.A2;
    const offset = first.frames.length;
    first.frames = [...first.frames, ...second.frames];
    first.steps = [...first.steps.filter(item => item.id !== 'A1-step-10'), ...second.steps.map(item => ({ ...item, frame: item.frame + offset }))];
    groups.A1 = [...(groups.A1 || []), ...(groups.A2 || [])];
    delete groups.A2; delete P.A2;
  }
  // Continuous shared-line beats told as one chapter: the second chapter's frames and steps follow the first's.
  // Step ids keep their original prefix and stage art resolves through NDStoryMergedNodes, so scenes are unchanged.
  {
    const P = window.NDStoryPerformances, groups = window.NDStoryReadingGroups.groups, merged = {};
    // STORY-CONDENSE-026 adds B1+B2, B3(+C1)+C2, D3+D4 and D5+D6; a chapter may absorb more than one.
    for (const [a, b] of [['P1', 'P2'], ['P3', 'P4'], ['B1', 'B2'], ['C8', 'C9']]) {
      const first = P[a], second = P[b], offset = first.frames.length;
      const own = (item, id) => item.id.startsWith(id + '-') || merged[item.id.split('-')[0]]?.into === id;
      if (!first.steps.every(item => own(item, a)) || !second.steps.every(item => item.id.startsWith(b + '-'))) throw new Error('unexpected step ids in ' + a + '/' + b);
      merged[b] = { into: a, offset };
      first.frames = [...first.frames, ...second.frames];
      first.steps = [...first.steps.filter(item => item.type !== 'complete'), ...second.steps.map(item => ({ ...item, frame: item.frame + offset }))];
      groups[a] = [...(groups[a] || []), ...(groups[b] || [])];
      delete groups[b]; delete P[b];
    }
    window.NDStoryMergedNodes = Object.freeze(merged);
  }
  // SCENE-AUDIT-20261005: dialogue polish agreed with the user (continuity, repeated lines, wording). Text-only except one added beat in C9.
  {
    const P = window.NDStoryPerformances;
    const find = id => { for (const n in P) { const i = P[n].steps.findIndex(s => s.id === id); if (i >= 0) return [P[n], i]; } throw new Error('SCENE-AUDIT: missing ' + id); };
    const set = (id, text) => { const [p, i] = find(id); p.steps[i].text = text; };
    const rep = (id, from, to) => { const [p, i] = find(id); if (!p.steps[i].text.includes(from)) throw new Error('SCENE-AUDIT: ' + id + ' lacks ' + from); p.steps[i].text = p.steps[i].text.replace(from, to); };
    const drop = id => { const [p, i] = find(id); p.steps.splice(i, 1); };
    rep('G1-r02', '、錄音機，和那一頁名冊。', '和錄音機。');
    set('P3-r07', '博士之前的信提過，線索指向迪普霍姆的礦坑。我得先去那裡。');
    rep('P3-r12', '刀痕。', '刀痕。他把博士的最後一封信和礦坑筆記也塞給她。');
    set('G1-r12', '祭司在鐘下詠唱，是障眼法。祈福，從來只是說給人聽的。');
    set('T2-step-01', '隊伍尾端的人接近接應點。母親抱不動女孩，女孩自己也走不穩。');
    set('T2-step-04', '前面的士兵，接住女孩！我去扶她媽媽。');
    rep('S3-step-08', '他沒有擊敗伊藤。', '');
    set('S2-step-04', '他們還住在那裡。儀式必須延後。');
    set('G1-r07', '暮晶是有人死在夜域裡才長出來的，死得越多，長得越多。'); drop('G1-r08');
    set('E1-step-01', '伊芙在曜火研究所研究暮晶。今天的高純度樣本，傳出了不該出現的聲音。');
    rep('E1-step-07', '伊芙查看眼前的線索。', '伊芙查了樣本的來源。');
    set('H1-r12', '莫爾威爾的人，做錯了什麼？');
    set('C5-r05', '那天晚上，我躲在研究室外的通道裡，看著妳跑出來。');
    rep('E3-step-05', '擊碎門邊的燈。', '擊碎門邊的燈，火油濺上簾子。');
    { const [p, i] = find('C9-r15'); p.steps.splice(i + 1, 0, { id: 'C9-r15-b', type: 'narration', frame: p.steps[i].frame, text: '伊芙替納爾瓦壓住傷口、纏好繃帶，才提槍跟上。' }); }
    rep('B1-r13', '撿到', '遇到');
    rep('P2-step-03', '木書籤。', '木書籤。磷只知道，爸爸從前是鐘樓的祭司。');
    set('P1-step-07', '就叫妳磷。在黑暗裡也會亮的東西。');
    // Evidence cards that repeated the same wording.
    const S = window.NDCampaignSpecs, fix = t => t.replace('共振前兆', '夜域前兆').replace('緩衝幾秒共振', '擋住夜域幾秒').replace('同一段共振', '同一段錄音');
    for (const k of ['T1', 'T3', 'E1']) if (S[k]) S[k] = S[k].map(row => row.map(fix));
  }
  window.NDStoryChapters = Object.freeze(chapters.map(({ id, title, background }) => ({ id, title, background })));
})();
