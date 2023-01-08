import logo from './logo.svg';
import './App.css';

import { Component } from 'react';
class App extends Component {
render(){
  return (
         <div className="App">
            .......
            .......
         </div>
  );
 }
}


const questionTypes = {
  "LVLT_Practice": {
    instruction: "Listen to the audio once by clicking the button, "
      + "and select the most appropriate answer."
  },
  "LVLT_1000": {
    instruction: "Listen to the audio once by clicking the button, "
      + "and select the most appropriate answer."
  },
  "LVLT_2000": {
    instruction: "Listen to the audio once by clicking the button, "
      + "and select the most appropriate answer."
  },
  "LVLT_AWL": {
    instruction: "Listen to the audio once by clicking the button, "
      + "and select the most appropriate answer."
  },
  "VLT": {
    instruction: "Please read the text below and select the most appropriate answer."
  },
}

const questionList = [
  {
    type: questionTypes.LVLT_Practice,
    audioSrc: "audio/practice/strong.mp3",
    options: ["強壯", "快樂", "吃太多", "親切"],
  },
  {
    type: questionTypes.LVLT_Practice,
    audioSrc: "audio/practice/carry.mp3",
    options: ["談論", "攜帶", "寫上姓名", "搖動"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/time.mp3",
    options: ["錢", "食物", "時間", "朋友"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/stone.mp3",
    options: ["石頭", "板凳", "地毯", "樹枝"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/poor.mp3",
    options: ["窮困", "快樂", "有興趣", "高"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/drive.mp3",
    options: ["遊泳", "學習", "投球", "開車"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/jump.mp3",
    options: ["漂浮", "跳躍", "停車", "跑步"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/shoe.mp3",
    options: ["父親或母親", "皮夾", "筆", "鞋子"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/test.mp3",
    options: ["會議", "旅行", "考試", "計劃"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/nothing.mp3",
    options: ["很糟糕的事", "什麽都沒有", "很好的事", "某件事"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/cross.mp3",
    options: ["穿越", "推", "吃太快", "等待"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/actual.mp3",
    options: ["實際的", "老的", "圓的", "另一個"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/any.mp3",
    options: ["任何的", "沒有", "好的", "老的"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/far.mp3",
    options: ["很長一段時間", "很快地", "遠的", "到你的家"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/game.mp3",
    options: ["食物", "故事", "一群人", "遊戲/運動"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/cause.mp3",
    options: ["造成", "解決", "解釋", "了解"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/many.mp3",
    options: ["沒有", "足夠", "一些", "很多"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/where.mp3",
    options: ["在什麽時間", "為甚麽", "哪里", "用什麽方法"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/school.mp3",
    options: ["銀行", "海中的動物", "學校", "房子"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/grow.mp3",
    options: ["畫圖", "說話", "長大", "痛哭"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/flower.mp3",
    options: ["睡衣", "小時鐘", "花", "面包"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/handle.mp3",
    options: ["打開", "記得", "處理", "相信"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/camp.mp3",
    options: ["海邊", "營地", "醫院", "旅館"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/lake.mp3",
    options: ["湖", "小孩", "領導者", "安靜的地方"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/past.mp3",
    options: ["過去", "令人驚訝的事", "晚上", "夏天"],
  },
  {
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/round.mp3",
    options: ["友善的", "很大的", "很快的", "圓的"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/maintain.mp3",
    options: ["維持", "放大", "改進", "獲得"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/period.mp3",
    options: ["問題", "期間", "要做的事", "書"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/standard.mp3",
    options: ["腳跟", "分數", "價錢", "標準"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/basis.mp3",
    options: ["答案", "休息的地方", "下一步", "基礎，依據"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/upset.mp3",
    options: ["強壯的", "有名的", "富有的", "不高興的"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/drawer.mp3",
    options: ["抽屜", "車庫", "冰箱", "鳥籠"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/pub.mp3",
    options: ["酒吧", "銀行", "購物區", "遊泳池"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/circle.mp3",
    options: ["草稿", "空白處", "圓圈", "大洞"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/pro.mp3",
    options: ["間諜", "愚笨的人", "作家", "專業人士"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/soldier.mp3",
    options: ["商人", "學生", "木匠", "軍人"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/result.mp3",
    options: ["適當的時機", "問題", "金錢", "結果"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/resist.mp3",
    options: ["修理", "仔細檢查", "仔細考慮", "抗拒"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/lend.mp3",
    options: ["借給", "亂畫", "清理", "寫她的名字"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/refuse.mp3",
    options: ["回去", "考慮", "拒絕", "熬夜"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/speech.mp3",
    options: ["演講", "短跑", "音樂", "食物"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/pressure.mp3",
    options: ["錢", "時間", "壓力", "不好的字言"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/refer.mp3",
    options: ["支持", "讓他先來", "查詢打聽", "回答"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/army.mp3",
    options: ["黑白的動物", "書架", "鄰居", "軍隊"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/knee.mp3",
    options: ["小孩子", "膝蓋", "金錢", "所有物"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/rope.mp3",
    options: ["繩子", "鉆子", "皮夾", "梯子"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/brand.mp3",
    options: ["舞會", "初試", "等候室", "品牌"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/seal.mp3",
    options: ["修理", "封起來", "仔細檢查", "打開"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/warn.mp3",
    options: ["被推走", "受邀進來", "被警告", "導致戰爭"],
  },
  {
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/reserve.mp3",
    options: ["庫存", "烤箱", "負債", "受雇者"],
  }*/,
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/concept.mp3",
    options: ["契約", "概念", "方法", "法案"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/similar.mp3",
    options: ["明確的", "極好的", "簡單的", "相似的"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/item.mp3",
    options: ["項目", "調查", "會議", "方面"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/component.mp3",
    options: ["架構", "層", "元素", "夥伴"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/compensate.mp3",
    options: ["補償", "排除", "位於", "聚集"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/professional.mp3",
    options: ["國內的", "專業的", "注冊的", "有名的"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/external.mp3",
    options: ["不明的", "外部的", "客觀的", "隨後的"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/clause.mp3",
    options: ["邏輯", "目標", "圖片", "法條"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/migrate.mp3",
    options: ["合作", "遷移", "聚集", "進化"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/priority.mp3",
    options: ["妥協", "優先的事", "出版品", "成功者"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/reserve.mp3",
    options: ["顛倒", "順序", "調整", "時間"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/arbitrary.mp3",
    options: ["隨意的", "關鍵的", "厲嚴的", "足夠的"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/mutual.mp3",
    options: ["明顯的", "成熟的", "相互的", "拘束的"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/alternative.mp3",
    options: ["變通方法", "任務", "評論", "互動"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/colleague.mp3",
    options: ["主題", "時間表", "同事", "論文"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/legal.mp3",
    options: ["合法的", "可用的", "明顯的", "主要的"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/site.mp3",
    options: ["元素", "估計", "地方", "出口"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/institute.mp3",
    options: ["獲得", "規定", "制定", "尋找"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/retain.mp3",
    options: ["綜合", "升遷", "協調", "保留"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/phase.mp3",
    options: ["系列", "階段", "面項", "範圍"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/pursue.mp3",
    options: ["追求", "改變", "偵測", "促進"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/recover.mp3",
    options: ["透露", "采用", "承認", "恢覆"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/diverse.mp3",
    options: ["準確", "最小的", "有彈性", "多種的"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/hierarchy.mp3",
    options: ["思想", "階層組織", "化學藥品", "流行服飾"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/distort.mp3",
    options: ["模糊的", "相同的", "被扭曲的", "暫時的"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/accumulate.mp3",
    options: ["感激的", "累積的", "補充", "符和"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/abandon.mp3",
    options: ["利用", "操縱", "拋棄", "小化"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/rigid.mp3",
    options: ["質性的", "同時的", "暫時的", "死板的"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/notwithstanding.mp3",
    options: ["不知地", "報答", "藉以", "盡管"],
  },
  {
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/perspective.mp3",
    options: ["循環", "前途", "網絡", "狀態"],
  },
  {
    type: questionTypes.VLT,
    readingText: "",
    options: ["", "", "", ""],
  }
]

/**
 * @param questionProp {{
 *    type: {
 *      instruction: string,
 *    }, 
 *    audioSrc: string, 
 *    options: Array<string>,
 * }}
 * 
 * @return JSX.Element
 */

/*
function Question(questionProp) {
  const questionIndex = (questionProp.index + 1)
  return (
    <div style={{marginBottom: "1em"}}>
      Q{questionIndex}. 
      { <p>
        {questionProp.type.instruction}
      </p> } 
      <audio controls src={questionProp.audioSrc}/>

      <div>
      {questionProp.options.map((option, i) => <label key={i}>
        <input type="radio" name={"Q"+questionIndex} value={option}/>
        {option}
      </label>)}
      </div>
    </div>
  )
}
        {questionList.map((question, i) => <Question {...question} index={i}/>)}
*/

export default App;
