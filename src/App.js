//import logo from './logo.svg';
import './App.css';
import { Component, createRef, useRef, useState, useEffect } from "react";
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
//import Replay from '@material-ui/icons/Replay';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from "@material-ui/lab/Alert";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGfbT6UCafFI-78G-0KU_3liczlPOtZIQ",
  authDomain: "vlts-93d00.firebaseapp.com",
  projectId: "vlts-93d00",
  storageBucket: "vlts-93d00.appspot.com",
  messagingSenderId: "649465830666",
  appId: "1:649465830666:web:3713367359855e5e09eef3",
  measurementId: "G-ECZMPRS3DM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


class App extends Component {
  constructor(props){
    super(props)
    this.questionAudio = createRef();
    this.state = {
      activeStep:0,
      questionList : questionList,
      booleanonsubmit : false,
      Total:0,
      open:false,
      catchmsg:"",
      errormsg:""
    }
  }

  handleNext=()=>{
    this.setState({activeStep:this.state.activeStep+1})
  }

  handleBack=()=>{
    this.setState({activeStep:this.state.activeStep-1})
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({open : false})
  }

  onInputChange = (e) => {
    const { questionList } = this.state;
    const nexState = questionList.map(card => {
      if (card.question_number !== e.target.name) return card;
      return { ...card, options: card.options.map(opt => {
        const checked = opt.que_options === e.target.value;
        return {...opt, selected: checked}
      })}
    })
    this.setState({ questionList: nexState })
  }

  onsubmit = () =>{
    let list = this.state.questionList ;
    let count = 0;
    let notattempcount = 0;
    list.map((item,key)=>{
      item.options.map((anslist,key)=>{
        if(anslist.selected === true){  //for the selected item
          if(anslist.que_options === item.ans){ //count++ if correct
            count = count + 1;
          }
        }else{
          notattempcount = notattempcount + 1
        }
      })
    })
    if(notattempcount<=(list.length * list.options.length) && notattempcount>(list.length * (list.options.length - 1))){ //depends on option list (notattempcount<= no. of possible options && notattempcount> no. of question * (no. of options - 1))
      this.setState({Total:count, catchmsg:"Please attempt all questions", errormsg:"error", open:true})
    }else{
      this.setState({Total:count})
    }
  }

  Snackbarrender =() =>{
    return(
      this.state.open? 
        <Snackbar 
          open={this.state.open} 
          autoHideDuration={5000}  
          onClose={this.handleClose} 
          style={{marginTop:'0px',width:'100%'}}>
            <MuiAlert elevation={6} variant="filled" onClose={this.handleClose} severity={this.state.errormsg}> {this.state.catchmsg} </MuiAlert>
        </Snackbar> 
      : null
    )
  }

  render(){
    return (
      <div className="App">
        <div className="Quiz_render_container">
          <div className="Quiz_container_display">
            {this.state.questionList.map((item,index)=>{
              if( Math.abs(this.state.activeStep - index)<=0)
              {
                return (
                  <div>
                    <div>{item.type.instruction}</div>
                    <div><AudioControl src={item.audioSrc}/></div>
                    <div> Options are : </div>
                      {item.options.map((ans,index_ans)=>{
                        index_ans = index_ans + 1
                          return (
                            <div key = {index_ans} className="Quiz_multiple_options">
                            <input
                              key={index_ans}
                              type="radio"
                              name={item.question_number}
                              value={ans.que_options}
                              checked={!!ans.selected}
                              onChange={this.onInputChange} />
                              {index_ans}) {ans.que_options}
                            </div>
                          )
                      })}
                  </div>
                )
              }else{
                return null
              }
            })}
          </div>
        </div>
        <div className="Quiz-MobileStepper">
          <MobileStepper variant="dots" steps={this.state.questionList.length} position="static" activeStep={this.state.activeStep}  
            nextButton={this.state.activeStep === (questionList.length - 1) ?
              <Button size="small" onClick={this.onsubmit}>Submit</Button> //Submit button
                :
              <Button size="small" onClick={this.handleNext} disabled={this.state.activeStep === this.state.questionList.length}>Next</Button> //Next button
            }
            backButton={<Button size="small" onClick={this.handleBack} disabled={this.state.activeStep === 0}>Back</Button>} //Back button
            />
        </div>
      </div>
    );
  }
}

function AudioControl(props) {
  const audioRef = useRef()
  const [audioPlaying, setAudioPlaying] = useState(false)

  useEffect(() => {
    const audioEl = audioRef.current

    if (audioPlaying) 
      audioEl.play()
    else 
      audioEl.pause()
  }, [audioRef, audioPlaying])

  return <>
    <audio ref={audioRef} src={props.src} /*controls*//>
    {audioPlaying ? 
      <button onClick={() => setAudioPlaying(false)}>Pause</button> : 
      <button onClick={() => setAudioPlaying(true)}>Play</button>}
  </>
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
    question_number: "Practice 1",
    type: questionTypes.LVLT_Practice,
    audioSrc: "audio/practice/strong.mp3",
    options: [{que_options : "強壯" , selected: false}, {que_options : "快樂" , selected: false}, {que_options : "吃太多" , selected: false}, {que_options : "親切" , selected: false}],
    ans: "強壯" 
  },
  {
    question_number: "Practice 2",
    type: questionTypes.LVLT_Practice,
    audioSrc: "audio/practice/carry.mp3",
    options: [{que_options : "談論" , selected: false}, {que_options : "攜帶" , selected: false}, {que_options : "寫上姓名" , selected: false}, {que_options : "搖動" , selected: false}],
    ans: "攜帶",
  },
  {
    question_number: "1",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/time.mp3",
    options: [{que_options : "錢" , selected: false}, {que_options : "食物" , selected: false}, {que_options : "時間" , selected: false}, {que_options : "朋友" , selected: false}],
    ans: "時間" 
  },
  {
    question_number: "2",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/stone.mp3",
    options: [{que_options : "石頭" , selected: false}, {que_options : "板凳" , selected: false}, {que_options : "地毯" , selected: false}, {que_options : "樹枝" , selected: false}],
    ans: "石頭"
  },
  {
    question_number: "3",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/poor.mp3",
    options: [{que_options : "窮困" , selected: false}, {que_options : "快樂" , selected: false}, {que_options : "有興趣" , selected: false}, {que_options : "高" , selected: false}],
    ans: "窮困"
  },
  {
    question_number: "4",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/drive.mp3",
    options: [{que_options : "遊泳" , selected: false}, {que_options : "學習" , selected: false}, {que_options : "投球" , selected: false}, {que_options : "開車" , selected: false}],
    ans: "開車"
  },
  {
    question_number: "5",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/jump.mp3",
    options: [{que_options : "漂浮" , selected: false}, {que_options : "跳躍" , selected: false}, {que_options : "停車" , selected: false}, {que_options : "跑步" , selected: false}],
    ans: "跳躍"
  },
  {
    question_number: "6",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/shoe.mp3",
    options: [{que_options : "父親或母親" , selected: false}, {que_options : "皮夾" , selected: false}, {que_options : "筆" , selected: false}, {que_options : "鞋子" , selected: false}],
    ans: "鞋子"
  },
  {
    question_number: "7",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/test.mp3",
    options: [{que_options : "會議" , selected: false}, {que_options : "旅行" , selected: false}, {que_options : "考試" , selected: false}, {que_options : "計劃" , selected: false}],
    ans: "考試"
  },
  {
    question_number: "8",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/nothing.mp3",
    options: [{que_options : "很糟糕的事" , selected: false}, {que_options : "什麽都沒有" , selected: false}, {que_options : "很好的事" , selected: false}, {que_options : "某件事" , selected: false}],
    ans: "什麽都沒有"
  },
  {
    question_number: "9",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/cross.mp3",
    options: [{que_options : "穿越" , selected: false}, {que_options : "推" , selected: false}, {que_options : "吃太多" , selected: false}, {que_options : "等待" , selected: false}],
    ans: "穿越"
  },
  {
    question_number: "10",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/actual.mp3",
    options: [{que_options : "實際的" , selected: false}, {que_options : "老的" , selected: false}, {que_options : "圓的" , selected: false}, {que_options : "另一個" , selected: false}],
    ans: "實際的"
  },
  {
    question_number: "11",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/any.mp3",
    options: [{que_options : "任何的" , selected: false}, {que_options : "沒有" , selected: false}, {que_options : "好的" , selected: false}, {que_options : "老的" , selected: false}],
    ans: "任何的"
  },
  {
    question_number: "12",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/far.mp3",
    options: [{que_options : "很長一段時間" , selected: false}, {que_options : "很快地" , selected: false}, {que_options : "遠的" , selected: false}, {que_options : "到你的家" , selected: false}],
    ans: "遠的"
  },
  {
    question_number: "13",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/game.mp3",
    options: [{que_options : "食物" , selected: false}, {que_options : "故事" , selected: false}, {que_options : "一群人" , selected: false}, {que_options : "遊戲/運動" , selected: false}],
    ans: "遊戲/運動"
  },
  {
    question_number: "14",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/cause.mp3",
    options: [{que_options : "造成" , selected: false}, {que_options : "解決" , selected: false}, {que_options : "解釋" , selected: false}, {que_options : "了解" , selected: false}],
    ans: "造成"
  },
  {
    question_number: "15",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/many.mp3",
    options: [{que_options : "沒有" , selected: false}, {que_options : "足夠" , selected: false}, {que_options : "一些" , selected: false}, {que_options : "很多" , selected: false}],
    ans: "很多"
  },
  {
    question_number: "16",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/where.mp3",
    options: [{que_options : "在什麽時間" , selected: false}, {que_options : "為甚麽" , selected: false}, {que_options : "哪里" , selected: false}, {que_options : "用什麽方法" , selected: false}],
    ans: "哪裡"
  },
  {
    question_number: "17",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/school.mp3",
    options: [{que_options : "銀行" , selected: false}, {que_options : "海中的動物" , selected: false}, {que_options : "學校" , selected: false}, {que_options : "房子" , selected: false}],
    ans: "學校"
  },
  {
    question_number: "18",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/grow.mp3",
    options: [{que_options : "畫圖" , selected: false}, {que_options : "說話" , selected: false}, {que_options : "長大" , selected: false}, {que_options : "痛哭" , selected: false}],
    ans: "長大"
  },
  {
    question_number: "19",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/flower.mp3",
    options: [{que_options : "睡衣" , selected: false}, {que_options : "小時鐘" , selected: false}, {que_options : "花" , selected: false}, {que_options : "面包" , selected: false}],
    ans: "花"
  },
  {
    question_number: "20",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/handle.mp3",
    options: [{que_options : "打開" , selected: false}, {que_options : "記得" , selected: false}, {que_options : "處理" , selected: false}, {que_options : "相信" , selected: false}],
    ans: "處理"
  },
  {
    question_number: "21",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/camp.mp3",
    options: [{que_options : "海邊" , selected: false}, {que_options : "營地" , selected: false}, {que_options : "醫院" , selected: false}, {que_options : "旅館" , selected: false}],
    ans: "營地"
  },
  {
    question_number: "22",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/lake.mp3",
    options: [{que_options : "湖" , selected: false}, {que_options : "小孩" , selected: false}, {que_options : "領導者" , selected: false}, {que_options : "安靜的地方" , selected: false}],
    ans: "湖"
  },
  {
    question_number: "23",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/past.mp3",
    options: [{que_options : "過去" , selected: false}, {que_options : "令人驚訝的事" , selected: false}, {que_options : "晚上" , selected: false}, {que_options : "夏天" , selected: false}],
    ans: "過去"
  },
  {
    question_number: "24",
    type: questionTypes.LVLT_1000,
    audioSrc: "audio/1k/round.mp3",
    options: [{que_options : "友善的" , selected: false}, {que_options : "很大的" , selected: false}, {que_options : "很快的" , selected: false}, {que_options : "圓的" , selected: false}],
    ans: "圓的"
  },
  {
    question_number: "1",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/maintain.mp3",
    options: [{que_options : "維持" , selected: false}, {que_options : "放大" , selected: false}, {que_options : "改進" , selected: false}, {que_options : "獲得" , selected: false}],
    ans: "維持"
  },
  {
    question_number: "2",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/period.mp3",
    options: [{que_options : "問題" , selected: false}, {que_options : "期間" , selected: false}, {que_options : "要做的事" , selected: false}, {que_options : "書" , selected: false}],
    ans: "期間"
  },
  {
    question_number: "3",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/standard.mp3",
    options: [{que_options : "腳跟" , selected: false}, {que_options : "分數" , selected: false}, {que_options : "價錢" , selected: false}, {que_options : "標準" , selected: false}],
    ans: "標準"
  },
  {
    question_number: "4",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/basis.mp3",
    options: [{que_options : "答案" , selected: false}, {que_options : "休息的地方" , selected: false}, {que_options : "下一步" , selected: false}, {que_options : "基礎，依據" , selected: false}],
    ans: "基礎，依據"
  },
  {
    question_number: "5",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/upset.mp3",
    options: [{que_options : "強壯的" , selected: false}, {que_options : "有名的" , selected: false}, {que_options : "富有的" , selected: false}, {que_options : "不高興的" , selected: false}],
    ans: "不高興的"
  },
  {
    question_number: "6",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/drawer.mp3",
    options: [{que_options : "抽屜" , selected: false}, {que_options : "車庫" , selected: false}, {que_options : "冰箱" , selected: false}, {que_options : "鳥籠" , selected: false}],
    ans: "抽屜"
  },
  {
    question_number: "7",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/pub.mp3",
    options: [{que_options : "酒吧" , selected: false}, {que_options : "銀行" , selected: false}, {que_options : "購物區" , selected: false}, {que_options : "遊泳池" , selected: false}],
    ans: "酒吧"
  },
  {
    question_number: "8",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/circle.mp3",
    options: [{que_options : "草稿" , selected: false}, {que_options : "空白處" , selected: false}, {que_options : "圓圈" , selected: false}, {que_options : "大洞" , selected: false}],
    ans: "圓圈"
  },
  {
    question_number: "9",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/pro.mp3",
    options: [{que_options : "間諜" , selected: false}, {que_options : "愚笨的人" , selected: false}, {que_options : "作家" , selected: false}, {que_options : "專業人士" , selected: false}],
    ans: "專業人士"
  },
  {
    question_number: "10",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/soldier.mp3",
    options: [{que_options : "商人" , selected: false}, {que_options : "學生" , selected: false}, {que_options : "木匠" , selected: false}, {que_options : "軍人" , selected: false}],
    ans: "軍人"
  },
  {
    question_number: "11",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/result.mp3",
    options: [{que_options : "適當的時機" , selected: false}, {que_options : "問題" , selected: false}, {que_options : "金錢" , selected: false}, {que_options : "結果" , selected: false}],
    ans: "結果"
  },
  {
    question_number: "12",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/resist.mp3",
    options: [{que_options : "修理" , selected: false}, {que_options : "仔細檢查" , selected: false}, {que_options : "仔細考慮" , selected: false}, {que_options : "抗拒" , selected: false}],
    ans: "抗拒"
  },
  {
    question_number: "13",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/lend.mp3",
    options: [{que_options : "借給" , selected: false}, {que_options : "亂畫" , selected: false}, {que_options : "清理" , selected: false}, {que_options : "寫她的名字" , selected: false}],
    ans: "借給"
  },
  {
    question_number: "14",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/refuse.mp3",
    options: [{que_options : "回去" , selected: false}, {que_options : "考慮" , selected: false}, {que_options : "拒絕" , selected: false}, {que_options : "熬夜" , selected: false}],
    ans: "拒絕"
  },
  {
    question_number: "15",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/speech.mp3",
    options: [{que_options : "演講" , selected: false}, {que_options : "短跑" , selected: false}, {que_options : "音樂" , selected: false}, {que_options : "食物" , selected: false}],
    ans: "演講"
  },
  {
    question_number: "16",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/pressure.mp3",
    options: [{que_options : "錢" , selected: false}, {que_options : "時間" , selected: false}, {que_options : "壓力" , selected: false}, {que_options : "不好的字言" , selected: false}],
    ans: "壓力"
  },
  {
    question_number: "17",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/refer.mp3",
    options: [{que_options : "強壯" , selected: false}, {que_options : "快樂" , selected: false}, {que_options : "吃太多" , selected: false}, {que_options : "親切" , selected: false}],
    ans: "查詢"
  },
  {
    question_number: "18",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/army.mp3",
    options: [{que_options : "黑白的動物" , selected: false}, {que_options : "書架" , selected: false}, {que_options : "鄰居" , selected: false}, {que_options : "軍隊" , selected: false}],
    ans: "軍隊"
  },
  {
    question_number: "19",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/knee.mp3",
    options: [{que_options : "小孩子" , selected: false}, {que_options : "膝蓋" , selected: false}, {que_options : "金錢" , selected: false}, {que_options : "所有物" , selected: false}],
    ans: "膝蓋"
  },
  {
    question_number: "20",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/rope.mp3",
    options: [{que_options : "繩子" , selected: false}, {que_options : "鉆" , selected: false}, {que_options : "皮夾" , selected: false}, {que_options : "梯子" , selected: false}],
    ans: "繩子"
  },
  {
    question_number: "21",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/brand.mp3",
    options: [{que_options : "舞會" , selected: false}, {que_options : "初試" , selected: false}, {que_options : "等候室" , selected: false}, {que_options : "品牌" , selected: false}],
    ans: "品牌"
  },
  {
    question_number: "22",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/seal.mp3",
    options: [{que_options : "修理" , selected: false}, {que_options : "封起來" , selected: false}, {que_options : "仔細檢查" , selected: false}, {que_options : "打開" , selected: false}],
    ans: "封起來"
  },
  {
    question_number: "23",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/warn.mp3",
    options: [{que_options : "被推走" , selected: false}, {que_options : "受邀進來" , selected: false}, {que_options : "被警告" , selected: false}, {que_options : "導致戰爭" , selected: false}],
    ans: "被警告"
  },
  {
    question_number: "24",
    type: questionTypes.LVLT_2000,
    audioSrc: "audio/2k/reserve.mp3",
    options: [{que_options : "庫存" , selected: false}, {que_options : "烤箱" , selected: false}, {que_options : "負債" , selected: false}, {que_options : "受雇者" , selected: false}],
    ans: "reserve"
  },
  {
    question_number: "1",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/concept.mp3",
    options: [{que_options : "契約" , selected: false}, {que_options : "概念" , selected: false}, {que_options : "方法" , selected: false}, {que_options : "法案" , selected: false}],
    ans: "概念"
  },
  {
    question_number: "2",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/similar.mp3",
    options: [{que_options : "明確的" , selected: false}, {que_options : "極好的" , selected: false}, {que_options : "簡單的" , selected: false}, {que_options : "相似的" , selected: false}],
    ans: "相似的"
  },
  {
    question_number: "3",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/item.mp3",
    options: [{que_options : "項目" , selected: false}, {que_options : "調查" , selected: false}, {que_options : "會議" , selected: false}, {que_options : "方面" , selected: false}],
    ans: "項目"
  },
  {
    question_number: "4",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/component.mp3",
    options: [{que_options : "架構" , selected: false}, {que_options : "層" , selected: false}, {que_options : "元素" , selected: false}, {que_options : "夥伴" , selected: false}],
    ans: "元素"
  },
  {
    question_number: "5",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/compensate.mp3",
    options: [{que_options : "補償" , selected: false}, {que_options : "排除" , selected: false}, {que_options : "位於" , selected: false}, {que_options : "聚集" , selected: false}],
    ans: "補償"
  },
  {
    question_number: "6",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/professional.mp3",
    options: [{que_options : "國內的" , selected: false}, {que_options : "專業的" , selected: false}, {que_options : "注冊的" , selected: false}, {que_options : "有名的" , selected: false}],
    ans: "專業的"
  },
  {
    question_number: "7",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/external.mp3",
    options: [{que_options : "不明的" , selected: false}, {que_options : "外部的" , selected: false}, {que_options : "客觀的" , selected: false}, {que_options : "隨後的" , selected: false}],
    ans: "外部的"
  },
  {
    question_number: "8",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/clause.mp3",
    options: [{que_options : "邏輯" , selected: false}, {que_options : "目標" , selected: false}, {que_options : "圖片" , selected: false}, {que_options : "法條" , selected: false}],
    ans: "法條"
  },
  {
    question_number: "9",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/migrate.mp3",
    options: [{que_options : "合作" , selected: false}, {que_options : "遷移" , selected: false}, {que_options : "聚集" , selected: false}, {que_options : "進化" , selected: false}],
    ans: "遷移"
  },
  {
    question_number: "10",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/priority.mp3",
    options: [{que_options : "妥協" , selected: false}, {que_options : "優先的事" , selected: false}, {que_options : "出版品" , selected: false}, {que_options : "成功者" , selected: false}],
    ans: "優先的事"
  },
  {
    question_number: "11",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/reverse.mp3",
    options: [{que_options : "顛倒" , selected: false}, {que_options : "順序" , selected: false}, {que_options : "調整" , selected: false}, {que_options : "時間" , selected: false}],
    ans: "顛倒"
  },
  {
    question_number: "12",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/arbitrary.mp3",
    options: [{que_options : "隨意的" , selected: false}, {que_options : "關鍵的" , selected: false}, {que_options : "厲嚴的" , selected: false}, {que_options : "足夠的" , selected: false}],
    ans: "隨意的"
  },
  {
    question_number: "13",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/mutual.mp3",
    options: [{que_options : "明顯的" , selected: false}, {que_options : "成熟的" , selected: false}, {que_options : "相互的" , selected: false}, {que_options : "拘束的" , selected: false}],
    ans: "相互的"
  },
  {
    question_number: "14",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/alternative.mp3",
    options: [{que_options : "變通方法" , selected: false}, {que_options : "任務" , selected: false}, {que_options : "評論" , selected: false}, {que_options : "互動" , selected: false}],
    ans: "變通方法"
  },
  {
    question_number: "15",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/colleague.mp3",
    options: [{que_options : "主題" , selected: false}, {que_options : "時間表" , selected: false}, {que_options : "同事" , selected: false}, {que_options : "論文" , selected: false}],
    ans: "同事"
  },
  {
    question_number: "16",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/legal.mp3",
    options: [{que_options : "合法的" , selected: false}, {que_options : "可用的" , selected: false}, {que_options : "明顯的" , selected: false}, {que_options : "主要的" , selected: false}],
    ans: "合法的"
  },
  {
    question_number: "17",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/site.mp3",
    options: [{que_options : "元素" , selected: false}, {que_options : "估計" , selected: false}, {que_options : "地方" , selected: false}, {que_options : "出口" , selected: false}],
    ans: "地方"
  },
  {
    question_number: "18",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/institute.mp3",
    options: [{que_options : "獲得" , selected: false}, {que_options : "規定" , selected: false}, {que_options : "制定" , selected: false}, {que_options : "尋找" , selected: false}],
    ans: "制定"
  },
  {
    question_number: "19",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/retain.mp3",
    options: [{que_options : "綜合" , selected: false}, {que_options : "升遷" , selected: false}, {que_options : "協調" , selected: false}, {que_options : "保留" , selected: false}],
    ans: "保留"
  },
  {
    question_number: "20",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/phase.mp3",
    options: [{que_options : "系列" , selected: false}, {que_options : "階段" , selected: false}, {que_options : "面項" , selected: false}, {que_options : "範圍" , selected: false}],
    ans: "階段"
  },
  {
    question_number: "21",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/pursue.mp3",
    options: [{que_options : "追求" , selected: false}, {que_options : "改變" , selected: false}, {que_options : "偵測" , selected: false}, {que_options : "促進" , selected: false}],
    ans: "追求"
  },
  {
    question_number: "22",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/recover.mp3",
    options: [{que_options : "透露" , selected: false}, {que_options : "采用" , selected: false}, {que_options : "承認" , selected: false}, {que_options : "恢復" , selected: false}],
    ans: "恢復"
  },
  {
    question_number: "23",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/diverse.mp3",
    options: [{que_options : "準確" , selected: false}, {que_options : "最小的" , selected: false}, {que_options : "有彈性" , selected: false}, {que_options : "多種的" , selected: false}],
    ans: "多種的"
  },
  {
    question_number: "24",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/hierarchy.mp3",
    options: [{que_options : "思想" , selected: false}, {que_options : "階層組織" , selected: false}, {que_options : "化學藥品" , selected: false}, {que_options : "流行服飾" , selected: false}],
    ans: "階層組織"
  },
  {
    question_number: "25",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/distort.mp3",
    options: [{que_options : "模糊的" , selected: false}, {que_options : "相同的" , selected: false}, {que_options : "被扭曲的" , selected: false}, {que_options : "暫時的" , selected: false}],
    ans: "被扭曲的"
  },
  {
    question_number: "26",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/accumulate.mp3",
    options: [{que_options : "感激的" , selected: false}, {que_options : "累積的" , selected: false}, {que_options : "補充" , selected: false}, {que_options : "符和" , selected: false}],
    ans: "累積的"
  },
  {
    question_number: "27",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/abandon.mp3",
    options: [{que_options : "利用" , selected: false}, {que_options : "操縱" , selected: false}, {que_options : "拋棄" , selected: false}, {que_options : "小化" , selected: false}],
    ans: "拋棄"
  },
  {
    question_number: "28",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/rigid.mp3",
    options: [{que_options : "質性的" , selected: false}, {que_options : "同時的" , selected: false}, {que_options : "暫時的" , selected: false}, {que_options : "死板的" , selected: false}],
    ans: "死板的"
  },
  {
    question_number: "29",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/notwithstanding.mp3",
    options: [{que_options : "不知地" , selected: false}, {que_options : "報答" , selected: false}, {que_options : "藉以" , selected: false}, {que_options : "盡管" , selected: false}],
    ans: "盡管"
  },
  {
    question_number: "30",
    type: questionTypes.LVLT_AWL,
    audioSrc: "audio/AWL/perspective.mp3",
    options: [{que_options : "循環" , selected: false}, {que_options : "前途" , selected: false}, {que_options : "網絡" , selected: false}, {que_options : "狀態" , selected: false}],
    ans: "狀態"
  },
  /*{
    type: questionTypes.VLT,
    readingText: "",
    options: ["", "", "", ""],
  }*/
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
