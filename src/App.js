//import logo from './logo.svg';
import './App.css';
import { Component, createRef, useRef, useState, useEffect } from "react";
import Text from 'react-text';
//import arrayShuffle from 'array-shuffle';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
//import Icon from '@material-ui/icons';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from "@material-ui/lab/Alert";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { TextField } from '@material-ui/core';
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
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const answerSheet = {
  username: "",
  // type: 
  answers: [],
  score: 0
}

const COLOR_NOT_ANSWERED = "#ccc"
const COLOR_NOT_ANSWERED_CLICKABLE = "#ff7676"
const COLOR_ANSWERED = "#4de780"
const COLOR_SELECTED = "#3f51b5"

class App extends Component {
  
  constructor(props){
    super(props)
    this.questionAudio = createRef();
    this.state = {
      userId: "",
      userIdError: false,
      activeStep:-1,
      questionList : questionList,
      booleanonsubmit : false,
      Total:0,
      open:false,
      catchmsg:"",
      errormsg:"",
      notAnsweredIndicationColor: COLOR_NOT_ANSWERED,
      // loadingSuccess:false,
      // catchmsg:"",
      // errormsg:"",
      resetTrigger: 0,
    }
  }

  checkCurrentQuestionAnswered = () => {
    const currentQuestionNotAnswered = 
      this.state.activeStep >= 0 && 
      !this.state.questionList[this.state.activeStep].options.filter(option => option.selected)[0]
    return !currentQuestionNotAnswered
  }

  handleNext=()=>{
    // Error: currentQuestionNotAnswered
    if (!this.checkCurrentQuestionAnswered()) {
      this.setState({catchmsg:"Please answer the question", errormsg:"error", open:true})
    }
    // Error: UserId not entered
    else if (this.state.userId.length <= 0 ){
      this.setState({//catchmsg:"Please enter ID", errormsg:"error", open:true, 
        userIdError: true
      })
    }
    // proceed to next question
    else {
      this.setState({activeStep: this.state.activeStep + 1, userIdError: false,
        resetTrigger: this.state.resetTrigger + 1,
      })
    }
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

  onIDChange = (e) => {
    this.setState({userId: e.target.value})
    answerSheet.username = e.target.value

    //console.log("UserId", this.state.userId)
  }

  onsubmit = () =>{
    let list = this.state.questionList ;
    /*
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
    */

    // check if last question is answered
    if (!this.checkCurrentQuestionAnswered()) {
      this.setState({catchmsg:"Please answer the question", errormsg:"error", open:true})
      return
    }

    console.log("Sending to server 🫡")


    this.setState({
      catchmsg:"Uploading your answer sheet.", errormsg:"info", open:true, 
      notAnsweredIndicationColor: COLOR_NOT_ANSWERED_CLICKABLE
    })

    /*
    const answerSheet = {
      username: string,
      answers: [{
        questionNumber: number,
        value: string,
        correct: boolean,
      }, ...],
      score: number,
    }
    */

    function abc(option) {
      return option.selected
    }

    list.forEach((item,key)=>{
      const answeredOption = item.options.filter(abc)[0]
      if (answeredOption) {
        const correct = item.ans === answeredOption.que_options
        answerSheet.answers.push({
          questionType: item.type,
          questionNumber: item.question_number,
          value: answeredOption.que_options,
          correct: correct,
          skipScore: item.skipScore || false,
        })
        answerSheet.score += !item.skipScore && correct ? 1 : 0
        console.log(answerSheet)
      }
    })

    addDoc(collection(db, "answersheets"), answerSheet)
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
        this.setState({
          catchmsg:"Your answersheet has been uploaded successfully!", errormsg:"success", open:true,
          activeStep: this.state.activeStep + 1,
        })
      })
      .catch(e => {
        console.error("Error adding document: ", e);
        this.setState({catchmsg:"There were errors while submitting answer sheet.", errormsg:"error", open:true})
      })
  }

  Snackbarrender =() =>{
    return(
      this.state.open? <>
        <Snackbar 
          open={this.state.open} 
          autoHideDuration={3000}
          onClose={this.handleClose} 
          style={{marginTop:'0px',width:'100%'}}>
            <MuiAlert 
              elevation={6}
              variant="filled" onClose={this.handleClose}
              severity={this.state.errormsg}> 
              {this.state.catchmsg} 
            </MuiAlert>
        </Snackbar> 
        </>
      : null
    )
  }

  render(){
    const item = this.state.questionList[this.state.activeStep]
    return (
      <div className="App">
        {this.Snackbarrender()}
        <div className="Quiz-MobileStepper m-4">
          <div className="flex m-2">
            <Button size="small" onClick={this.handleBack} disabled={this.state.activeStep < 0 || this.state.activeStep > this.state.questionList.length - 1}>
              <KeyboardArrowLeft/>Back
            </Button>
            <div className="flex-grow flex justify-center items-center">
              {this.state.activeStep < this.state.questionList.length ?
                <span>{this.state.activeStep + 1} / {this.state.questionList.length}</span>
                : null}
            </div>
            {this.state.activeStep >= (this.state.questionList.length - 1) ?
              <Button size="small" onClick={this.onsubmit} disabled={this.state.activeStep === this.state.questionList.length}>Submit <KeyboardArrowRight/></Button> //Submit button
                :
              <Button size="small" onClick={this.handleNext} disabled={this.state.activeStep === this.state.questionList.length}>
                Next <KeyboardArrowRight/>
              </Button> //Next button
            }
          </div>

          {/* { <div className="my-16">
            {false ? null : 
            <div style={{textAlign: "center"}} className="flex mx-4">
              {this.state.questionList.map((item, index) => <div style={{
                backgroundColor: 
                  this.state.activeStep === index ? COLOR_SELECTED : // check if it is current question
                    item.options.filter(option => option.selected).length > 0 ? COLOR_ANSWERED : this.state.notAnsweredIndicationColor, // if the question is answered, green, if not, grey.
                height: "1em",
                color: "#fff",
                cursor: "pointer",
                display: "inline-block",
                transition: "0.2s",
              }}
              className="flex-grow"
              onClick={() => this.setState({activeStep: index})}>
              </div>)}
            </div>
            }
          </div>} */}
        </div>
        <div className="Quiz_render_container">
          <div className="Quiz_container_display mx-10 my-24 flex justify-center">
            {this.state.activeStep < 0 ? 
              // Page BEFORE Test
              <div className="justify-center">
                <TextField
                  lable={"ID"}
                  helperText={this.state.userIdError
                    ? 'Woops. Please attempt to enter an ID.'
                    : 'Please enter your given ID here.'}
                  value={this.state.userId}
                  onChange={this.onIDChange}
                  error={this.state.userIdError}
                />
                <div>You must answer each question in order to proceed to the next question.</div>
              </div>
              // Page AFTER Test
             : this.state.activeStep > this.state.questionList.length - 1 ?
              <div>
                Thank you for your participation!
              </div> 
             : // Pages DURING Test
              <div>
                <div className="my-4">{item.type.instruction}</div>
                {/* {item.audioSrc ? <div className="mt-4 mb-2"><AudioControl src={item.audioSrc} resetTrigger={this.state.resetTrigger}/></div> : <></>} */}
                {item.questionStatement ? <div className="m-8">{item.questionStatement.split(" ").map((str, i) => {
                  i = i + 1
                  return (str.toLowerCase() === item.questionStatement.split(" ")[1].toLowerCase().slice(0,-1) && i > 2) ? <u>{str}</u> : 
                         (str.toLowerCase().slice(0,-1) === item.questionStatement.split(" ")[1].toLowerCase().slice(0,-1) && i > 2) ? <u>{str}</u> : 
                         (str.toLowerCase().slice(0,-2) === item.questionStatement.split(" ")[1].toLowerCase().slice(0,-1) && i > 2) ? <u>{str}</u> : 
                         (str.toLowerCase().slice(0,-3) === item.questionStatement.split(" ")[1].toLowerCase().slice(0,-1) && i > 2) ? <u>{str}</u> : 
                         " " + str + " "
                })}</div> : <></>}
                <div> Options are : </div>
                  {item.options.map((ans,index_ans)=>{
                    index_ans = index_ans + 1
                      return (
                        <div key = {index_ans} className="Quiz_multiple_options m-2">
                          <input
                            key={index_ans}
                            type="radio"
                            className="mr-2"
                            name={item.question_number}
                            id={item.question_number + "_" + index_ans}
                            value={ans.que_options}
                            checked={!!ans.selected}
                            onChange={this.onInputChange}
                          />
                          <label htmlFor={item.question_number + "_" + index_ans}>
                            {index_ans}) {ans.que_options}
                          </label>
                        </div>
                      )
                  })}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

function AudioControl(props) {
  const audioRef = useRef()
  const [audioPlaying, setAudioPlaying] = useState(false)

  // force pause through parent prop
  // useEffect(() => {
  //   const audioEl = audioRef.current

  //   audioEl.pause();
  //   audioEl.currentTime = 0;
  // }, [audioRef, props.resetTrigger])
  useEffect(() => {
    setAudioPlaying(false)
  }, [props.resetTrigger])

  useEffect(() => {
    const audioEl = audioRef.current

    if (audioPlaying) 
      audioEl.play()
    else 
      audioEl.pause()
  }, [audioRef, audioPlaying])

  useEffect(() => {
    if (audioRef.current)
      setAudioPlaying(!audioRef.current.paused)
  }, [audioRef.current?.paused])

  return <>
    <audio ref={audioRef} src={props.src} /*controls*//>
    {audioPlaying ? 
      <Button variant="outlined" onClick={() => setAudioPlaying(false)} className={props.className}>Pause</Button> : 
      <Button variant="outlined" onClick={() => setAudioPlaying(true)} className={props.className}>Play</Button>}
  </>
}

const questionTypes = {
  "LVLT": {
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
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/practice/strong.mp3",
    questionStatement: "P1. strong: She is very strong.",
    options: [{que_options : "強壯" , selected: false}, {que_options : "快樂" , selected: false}, {que_options : "吃太多" , selected: false}, {que_options : "親切" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "強壯",
    skipScore: true,
  },
  {
    question_number: "Practice 2",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/practice/carry.mp3",
    questionStatement: "P2. carry: Please carry it.",
    options: [{que_options : "談論" , selected: false}, {que_options : "攜帶" , selected: false}, {que_options : "寫上姓名" , selected: false}, {que_options : "搖動" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "攜帶",
    skipScore: true,
  },
  {
    question_number: "1.1",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/time.mp3",
    questionStatement: "1. time: They have a lot of time.",
    options: [{que_options : "錢" , selected: false}, {que_options : "食物" , selected: false}, {que_options : "時間" , selected: false}, {que_options : "朋友" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "時間" 
  },
  {
    question_number: "1.2",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/stone.mp3",
    questionStatement: "2. stone: She sat on a stone.",
    options: [{que_options : "石頭" , selected: false}, {que_options : "板凳" , selected: false}, {que_options : "地毯" , selected: false}, {que_options : "樹枝" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "石頭"
  },
  {
    question_number: "1.3",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/poor.mp3",
    questionStatement: "3. poor: We are poor.",
    options: [{que_options : "窮困" , selected: false}, {que_options : "快樂" , selected: false}, {que_options : "有興趣" , selected: false}, {que_options : "高" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "窮困"
  },
  {
    question_number: "1.4",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/drive.mp3",
    questionStatement: "4. drive: She drives fast.",
    options: [{que_options : "遊泳" , selected: false}, {que_options : "學習" , selected: false}, {que_options : "投球" , selected: false}, {que_options : "駕駛" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "駕駛"
  },
  {
    question_number: "1.5",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/jump.mp3",
    questionStatement: "5. jump: She tried to jump.",
    options: [{que_options : "漂浮" , selected: false}, {que_options : "跳躍" , selected: false}, {que_options : "停車" , selected: false}, {que_options : "跑步" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "跳躍"
  },
  {
    question_number: "1.6",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/shoe.mp3",
    questionStatement: "6. shoe: Where is your shoe?",
    options: [{que_options : "父親或母親" , selected: false}, {que_options : "皮夾" , selected: false}, {que_options : "筆" , selected: false}, {que_options : "鞋子" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "鞋子"
  },
  {
    question_number: "1.7",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/test.mp3",
    questionStatement: "7. test: We have a test in the morning.",
    options: [{que_options : "會議" , selected: false}, {que_options : "旅行" , selected: false}, {que_options : "考試" , selected: false}, {que_options : "計劃" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "考試"
  },
  {
    question_number: "1.8",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/nothing.mp3",
    questionStatement: "8. nothing: He said nothing to me.",
    options: [{que_options : "很糟糕的事" , selected: false}, {que_options : "什麽都沒有" , selected: false}, {que_options : "很好的事" , selected: false}, {que_options : "某件事" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "什麽都沒有"
  },
  {
    question_number: "1.9",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/cross.mp3",
    questionStatement: "9. cross: Don't cross.",
    options: [{que_options : "越過" , selected: false}, {que_options : "推" , selected: false}, {que_options : "吃太多" , selected: false}, {que_options : "等待" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "穿越"
  },
  {
    question_number: "1.10",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/actual.mp3",
    questionStatement: "10. actual: The actual one is larger.",
    options: [{que_options : "實際的" , selected: false}, {que_options : "老的" , selected: false}, {que_options : "圓的" , selected: false}, {que_options : "另一個" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "實際的"
  },
  {
    question_number: "1.11",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/any.mp3",
    questionStatement: "11. any: Does she have any friends?",
    options: [{que_options : "任何的" , selected: false}, {que_options : "沒有" , selected: false}, {que_options : "好的" , selected: false}, {que_options : "老的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "任何的"
  },
  {
    question_number: "1.12",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/far.mp3",
    questionStatement: "12. far: You have walked far!",
    options: [{que_options : "很長一段時間" , selected: false}, {que_options : "很快地" , selected: false}, {que_options : "很遠的" , selected: false}, {que_options : "到你的家" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "很遠的"
  },
  {
    question_number: "1.13",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/game.mp3",
    questionStatement: "13. game: I like this game.",
    options: [{que_options : "食物" , selected: false}, {que_options : "故事" , selected: false}, {que_options : "一群人" , selected: false}, {que_options : "遊戲/運動" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "遊戲/運動"
  },
  {
    question_number: "1.14",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/cause.mp3",
    questionStatement: "14. cause: He caused the problem.",
    options: [{que_options : "造成" , selected: false}, {que_options : "解決" , selected: false}, {que_options : "解釋" , selected: false}, {que_options : "了解" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "造成"
  },
  {
    question_number: "1.15",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/many.mp3",
    questionStatement: "15. many: I have many things.",
    options: [{que_options : "沒有" , selected: false}, {que_options : "足夠" , selected: false}, {que_options : "一些" , selected: false}, {que_options : "很多" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "很多"
  },
  {
    question_number: "1.16",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/where.mp3",
    questionStatement: "16. where: Where did you go?",
    options: [{que_options : "在什麽時間" , selected: false}, {que_options : "為甚麽" , selected: false}, {que_options : "哪裡" , selected: false}, {que_options : "用什麽方法" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "哪裡"
  },
  {
    question_number: "1.17",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/school.mp3",
    questionStatement: "17. school: This is a big school.",
    options: [{que_options : "銀行" , selected: false}, {que_options : "海中的動物" , selected: false}, {que_options : "學校" , selected: false}, {que_options : "房子" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "學校"
  },
  {
    question_number: "1.18",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/grow.mp3",
    questionStatement: "18: grow: All the children grew.",
    options: [{que_options : "畫圖" , selected: false}, {que_options : "說話" , selected: false}, {que_options : "長大" , selected: false}, {que_options : "痛哭" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "長大"
  },
  {
    question_number: "1.19",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/flower.mp3",
    questionStatement: "19. flower: He gave me a flower.",
    options: [{que_options : "睡衣" , selected: false}, {que_options : "小時鐘" , selected: false}, {que_options : "花" , selected: false}, {que_options : "面包" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "花"
  },
  {
    question_number: "1.20",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/handle.mp3",
    questionStatement: "20. handle: I can't handle it.",
    options: [{que_options : "打開" , selected: false}, {que_options : "記得" , selected: false}, {que_options : "處理" , selected: false}, {que_options : "相信" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "處理"
  },
  {
    question_number: "1.21",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/camp.mp3",
    questionStatement: "21. camp: He is in the camp.",
    options: [{que_options : "海邊" , selected: false}, {que_options : "營地" , selected: false}, {que_options : "醫院" , selected: false}, {que_options : "旅館" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "營地"
  },
  {
    question_number: "1.22",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/lake.mp3",
    questionStatement: "22. lake: People like the lake.",
    options: [{que_options : "湖" , selected: false}, {que_options : "小孩" , selected: false}, {que_options : "領導者" , selected: false}, {que_options : "安靜的地方" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "湖"
  },
  {
    question_number: "1.23",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/past.mp3",
    questionStatement: "23. past: It happened in the past.",
    options: [{que_options : "過去" , selected: false}, {que_options : "令人驚訝的事" , selected: false}, {que_options : "晚上" , selected: false}, {que_options : "夏天" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "過去"
  },
  {
    question_number: "1.24",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/1k/round.mp3",
    questionStatement: "24. round: It is round.",
    options: [{que_options : "友善的" , selected: false}, {que_options : "很大的" , selected: false}, {que_options : "很快的" , selected: false}, {que_options : "圓的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "圓的"
  },
  {
    question_number: "2.1",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/maintain.mp3",
    questionStatement: "",
    options: [{que_options : "維持" , selected: false}, {que_options : "放大" , selected: false}, {que_options : "改進" , selected: false}, {que_options : "獲得" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "維持"
  },
  {
    question_number: "2.2",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/period.mp3",
    questionStatement: "",
    options: [{que_options : "問題" , selected: false}, {que_options : "期間" , selected: false}, {que_options : "要做的事" , selected: false}, {que_options : "書" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "期間"
  },
  {
    question_number: "2.3",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/standard.mp3",
    questionStatement: "",
    options: [{que_options : "腳跟" , selected: false}, {que_options : "分數" , selected: false}, {que_options : "價錢" , selected: false}, {que_options : "標準" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "標準"
  },
  {
    question_number: "2.4",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/basis.mp3",
    questionStatement: "",
    options: [{que_options : "答案" , selected: false}, {que_options : "休息的地方" , selected: false}, {que_options : "下一步" , selected: false}, {que_options : "基礎，依據" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "基礎，依據"
  },
  {
    question_number: "2.5",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/upset.mp3",
    questionStatement: "",
    options: [{que_options : "強壯的" , selected: false}, {que_options : "有名的" , selected: false}, {que_options : "富有的" , selected: false}, {que_options : "難過的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "難過的"
  },
  {
    question_number: "2.6",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/drawer.mp3",
    questionStatement: "",
    options: [{que_options : "抽屜" , selected: false}, {que_options : "車庫" , selected: false}, {que_options : "冰箱" , selected: false}, {que_options : "鳥籠" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "抽屜"
  },
  {
    question_number: "2.7",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/pub.mp3",
    questionStatement: "",
    options: [{que_options : "酒吧" , selected: false}, {que_options : "銀行" , selected: false}, {que_options : "購物區" , selected: false}, {que_options : "遊泳池" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "酒吧"
  },
  {
    question_number: "2.8",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/circle.mp3",
    questionStatement: "",
    options: [{que_options : "草稿" , selected: false}, {que_options : "空白處" , selected: false}, {que_options : "圓圈" , selected: false}, {que_options : "大洞" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "圓圈"
  },
  {
    question_number: "2.9",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/pro.mp3",
    questionStatement: "",
    options: [{que_options : "間諜" , selected: false}, {que_options : "愚笨的人" , selected: false}, {que_options : "作家" , selected: false}, {que_options : "專業人士" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "專業人士"
  },
  {
    question_number: "2.10",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/soldier.mp3",
    questionStatement: "",
    options: [{que_options : "商人" , selected: false}, {que_options : "學生" , selected: false}, {que_options : "木匠" , selected: false}, {que_options : "軍人" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "軍人"
  },
  {
    question_number: "2.11",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/result.mp3",
    questionStatement: "",
    options: [{que_options : "適當的時機" , selected: false}, {que_options : "問題" , selected: false}, {que_options : "金錢" , selected: false}, {que_options : "結果" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "結果"
  },
  {
    question_number: "2.12",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/resist.mp3",
    questionStatement: "",
    options: [{que_options : "修理" , selected: false}, {que_options : "仔細檢查" , selected: false}, {que_options : "仔細考慮" , selected: false}, {que_options : "抗拒" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "抗拒"
  },
  {
    question_number: "2.13",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/lend.mp3",
    questionStatement: "",
    options: [{que_options : "借給" , selected: false}, {que_options : "亂畫" , selected: false}, {que_options : "清理" , selected: false}, {que_options : "寫她的名字" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "借給"
  },
  {
    question_number: "2.14",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/refuse.mp3",
    questionStatement: "",
    options: [{que_options : "回去" , selected: false}, {que_options : "考慮" , selected: false}, {que_options : "拒絕" , selected: false}, {que_options : "熬夜" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "拒絕"
  },
  {
    question_number: "2.15",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/speech.mp3",
    questionStatement: "",
    options: [{que_options : "演講" , selected: false}, {que_options : "短跑" , selected: false}, {que_options : "音樂" , selected: false}, {que_options : "食物" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "演講"
  },
  {
    question_number: "2.16",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/pressure.mp3",
    questionStatement: "",
    options: [{que_options : "錢" , selected: false}, {que_options : "時間" , selected: false}, {que_options : "壓力" , selected: false}, {que_options : "不好的字言" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "壓力"
  },
  {
    question_number: "2.17",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/refer.mp3",
    questionStatement: "",
    options: [{que_options : "支持" , selected: false}, {que_options : "禮讓" , selected: false}, {que_options : "查詢" , selected: false}, {que_options : "回答" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "查詢"
  },
  {
    question_number: "2.18",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/army.mp3",
    questionStatement: "",
    options: [{que_options : "黑白的動物" , selected: false}, {que_options : "書架" , selected: false}, {que_options : "鄰居" , selected: false}, {que_options : "軍隊" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "軍隊"
  },
  {
    question_number: "2.19",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/knee.mp3",
    questionStatement: "",
    options: [{que_options : "小孩子" , selected: false}, {que_options : "膝蓋" , selected: false}, {que_options : "金錢" , selected: false}, {que_options : "所有物" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "膝蓋"
  },
  {
    question_number: "2.20",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/rope.mp3",
    questionStatement: "",
    options: [{que_options : "繩子" , selected: false}, {que_options : "鉆" , selected: false}, {que_options : "皮夾" , selected: false}, {que_options : "梯子" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "繩子"
  },
  {
    question_number: "2.21",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/brand.mp3",
    questionStatement: "",
    options: [{que_options : "舞會" , selected: false}, {que_options : "初試" , selected: false}, {que_options : "等候室" , selected: false}, {que_options : "品牌" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "品牌"
  },
  {
    question_number: "2.22",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/seal.mp3",
    questionStatement: "",
    options: [{que_options : "修理" , selected: false}, {que_options : "封起來" , selected: false}, {que_options : "仔細檢查" , selected: false}, {que_options : "打開" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "封起來"
  },
  {
    question_number: "2.23",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/warn.mp3",
    questionStatement: "",
    options: [{que_options : "被推走" , selected: false}, {que_options : "受邀進來" , selected: false}, {que_options : "警告" , selected: false}, {que_options : "導致戰爭" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "警告"
  },
  {
    question_number: "2.24",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/2k/reserve.mp3",
    questionStatement: "",
    options: [{que_options : "庫存" , selected: false}, {que_options : "烤箱" , selected: false}, {que_options : "負債" , selected: false}, {que_options : "受雇者" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "庫存"
  },
  {
    question_number: "3.1",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/restore.mp3",
    questionStatement: "",
    options: [{que_options : "重覆" , selected: false}, {que_options : "轉換" , selected: false}, {que_options : "降價" , selected: false}, {que_options : "修復" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "修復" 
  },
  {
    question_number: "3.2",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/compound.mp3",
    questionStatement: "",
    options: [{que_options : "條款" , selected: false}, {que_options : "化合物" , selected: false}, {que_options : "公司" , selected: false}, {que_options : "預測" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "化合物"
  },
  {
    question_number: "3.3",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/latter.mp3",
    questionStatement: "",
    options: [{que_options : "牧師" , selected: false}, {que_options : "理由" , selected: false}, {que_options : "後者" , selected: false}, {que_options : "答案" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "後者"
  },
  {
    question_number: "3.4",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/pave.mp3",
    questionStatement: "",
    options: [{que_options : "被塞住" , selected: false}, {que_options : "分擔，共享" , selected: false}, {que_options : "饟金邊" , selected: false}, {que_options : "鋪路" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "鋪路"
  },
  {
    question_number: "3.5",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/remedy.mp3",
    questionStatement: "",
    options: [{que_options : "補救的辦法" , selected: false}, {que_options : "飯店" , selected: false}, {que_options : "烹飪的方法" , selected: false}, {que_options : "方程式" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "補救的辦法"
  },
  {
    question_number: "3.6",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/bacterium.mp3",
    questionStatement: "",
    options: [{que_options : "細菌" , selected: false}, {que_options : "一種紅色的花" , selected: false}, {que_options : "駱駝" , selected: false}, {que_options : "贓物" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "細菌"
  },
  {
    question_number: "3.7",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/behavior.mp3",
    questionStatement: "",
    options: [{que_options : "聽眾" , selected: false}, {que_options : "行為" , selected: false}, {que_options : "一大筆錢" , selected: false}, {que_options : "島嶼" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "行為"
  },
  {
    question_number: "3.8",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/fuel.mp3",
    questionStatement: "",
    options: [{que_options : "燃料" , selected: false}, {que_options : "止痛劑" , selected: false}, {que_options : "布" , selected: false}, {que_options : "絕緣材料" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "燃料"
  },
  {
    question_number: "3.9",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/silk.mp3",
    questionStatement: "",
    options: [{que_options : "絲綢" , selected: false}, {que_options : "黑色的木頭" , selected: false}, {que_options : "羽毛" , selected: false}, {que_options : "光亮的金屬" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "絲綢"
  },
  {
    question_number: "3.10",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/conceive.mp3",
    questionStatement: "",
    options: [{que_options : "告密" , selected: false}, {que_options : "解釋" , selected: false}, {que_options : "構想" , selected: false}, {que_options : "批評" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "構想"
  },
  {
    question_number: "3.11",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/legend.mp3",
    questionStatement: "",
    options: [{que_options : "博物館" , selected: false}, {que_options : "習慣" , selected: false}, {que_options : "傳奇" , selected: false}, {que_options : "慣例" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "傳奇"
  },
  {
    question_number: "3.12",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/impose.mp3",
    questionStatement: "",
    options: [{que_options : "完全改變" , selected: false}, {que_options : "正當其中" , selected: false}, {que_options : "類似" , selected: false}, {que_options : "強制實行" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "強制實行"
  },
  {
    question_number: "3.13",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/solution.mp3",
    questionStatement: "",
    options: [{que_options : "時間" , selected: false}, {que_options : "輔助" , selected: false}, {que_options : "問題" , selected: false}, {que_options : "解決方法" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "解決方法"
  },
  {
    question_number: "3.14",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/celebrate.mp3",
    questionStatement: "",
    options: [{que_options : "發現" , selected: false}, {que_options : "檢查" , selected: false}, {que_options : "認真工作" , selected: false}, {que_options : "慶祝" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "慶祝"
  },
  {
    question_number: "3.15",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/independence.mp3",
    questionStatement: "",
    options: [{que_options : "自主" , selected: false}, {que_options : "孤獨" , selected: false}, {que_options : "權勢" , selected: false}, {que_options : "驕傲" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "自主"
  },
  {
    question_number: "3.16",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/tunnel.mp3",
    questionStatement: "",
    options: [{que_options : "隧道" , selected: false}, {que_options : "木棒" , selected: false}, {que_options : "連字號" , selected: false}, {que_options : "窗簾" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "隧道"
  },
  {
    question_number: "3.17",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/reward.mp3",
    questionStatement: "",
    options: [{que_options : "讚美" , selected: false}, {que_options : "幫忙家務" , selected: false}, {que_options : "報酬" , selected: false}, {que_options : "聽眾" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "報酬"
  },
  {
    question_number: "3.18",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/review.mp3",
    questionStatement: "",
    options: [{que_options : "審查" , selected: false}, {que_options : "接受" , selected: false}, {que_options : "複製" , selected: false}, {que_options : "拋棄" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "審查"
  },
  {
    question_number: "3.19",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/mode.mp3",
    questionStatement: "",
    options: [{que_options : "模式" , selected: false}, {que_options : "速度" , selected: false}, {que_options : "態度" , selected: false}, {que_options : "量" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "模式"
  },
  {
    question_number: "3.20",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/personnel.mp3",
    questionStatement: "",
    options: [{que_options : "椅子" , selected: false}, {que_options : "空氣質量" , selected: false}, {que_options : "人員" , selected: false}, {que_options : "雇主" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "人員"
  },
  {
    question_number: "3.21",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/competent.mp3",
    questionStatement: "",
    options: [{que_options : "有效率的" , selected: false}, {que_options : "生氣的" , selected: false}, {que_options : "能幹的" , selected: false}, {que_options : "容易受傷的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "能幹的"
  },
  {
    question_number: "3.22",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/devastate.mp3",
    questionStatement: "",
    options: [{que_options : "裝飾" , selected: false}, {que_options : "隔離" , selected: false}, {que_options : "破壞" , selected: false}, {que_options : "污染" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "破壞"
  },
  {
    question_number: "3.23",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/constituent.mp3",
    questionStatement: "",
    options: [{que_options : "建築" , selected: false}, {que_options : "同意" , selected: false}, {que_options : "想法" , selected: false}, {que_options : "成分" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "成分"
  },
  {
    question_number: "3.24",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/3k/weave.mp3",
    questionStatement: "",
    options: [{que_options : "編織" , selected: false}, {que_options : "焊接" , selected: false}, {que_options : "說服" , selected: false}, {que_options : "欺騙" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "編織"
  },
  {
    question_number: "4.1",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/patience.mp3",
    questionStatement: "",
    options: [{que_options : "耐性" , selected: false}, {que_options : "空閑時間" , selected: false}, {que_options : "信念" , selected: false}, {que_options : "智慧" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "耐性" 
  },
  {
    question_number: "4.2",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/strap.mp3",
    questionStatement: "",
    options: [{que_options : "承諾" , selected: false}, {que_options : "蓋子" , selected: false}, {que_options : "盤子" , selected: false}, {que_options : "皮帶" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "皮帶"
  },
  {
    question_number: "4.3",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/weep.mp3",
    questionStatement: "",
    options: [{que_options : "畢業" , selected: false}, {que_options : "哭泣" , selected: false}, {que_options : "死亡" , selected: false}, {que_options : "擔心" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "哭泣"
  },
  {
    question_number: "4.4",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/haunt.mp3",
    questionStatement: "",
    options: [{que_options : "充滿裝飾的" , selected: false}, {que_options : "租來的" , selected: false}, {que_options : "空的" , selected: false}, {que_options : "鬧鬼的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "開車"
  },
  {
    question_number: "4.5",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/cube.mp3",
    questionStatement: "",
    options: [{que_options : "大頭針" , selected: false}, {que_options : "方塊" , selected: false}, {que_options : "馬克杯" , selected: false}, {que_options : "明信片" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "方塊"
  },
  {
    question_number: "4.6",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/peel.mp3",
    questionStatement: "",
    options: [{que_options : "浸泡" , selected: false}, {que_options : "剝皮" , selected: false}, {que_options : "漂白" , selected: false}, {que_options : "刴" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "剝皮"
  },
  {
    question_number: "4.7",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/distress.mp3",
    questionStatement: "",
    options: [{que_options : "忘恩" , selected: false}, {que_options : "滿足" , selected: false}, {que_options : "痛苦" , selected: false}, {que_options : "活潑" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "痛苦"
  },
  {
    question_number: "4.8",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/depart.mp3",
    questionStatement: "",
    options: [{que_options : "出發" , selected: false}, {que_options : "拒絕" , selected: false}, {que_options : "下山" , selected: false}, {que_options : "變糟" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "出發"
  },
  {
    question_number: "4.9",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/romance.mp3",
    questionStatement: "",
    options: [{que_options : "意見分歧" , selected: false}, {que_options : "假期" , selected: false}, {que_options : "討論" , selected: false}, {que_options : "戀愛關係" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "戀愛關係"
  },
  {
    question_number: "4.10",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/ambition.mp3",
    questionStatement: "",
    options: [{que_options : "野心" , selected: false}, {que_options : "同情心" , selected: false}, {que_options : "想像力" , selected: false}, {que_options : "樂趣" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "野心"
  },
  {
    question_number: "4.11",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/dash.mp3",
    questionStatement: "",
    options: [{que_options : "猛衝" , selected: false}, {que_options : "徘徊" , selected: false}, {que_options : "打架" , selected: false}, {que_options : "瞥視" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "猛衝"
  },
  {
    question_number: "4.12",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/drown.mp3",
    questionStatement: "",
    options: [{que_options : "在外進餐" , selected: false}, {que_options : "溺水" , selected: false}, {que_options : "挖洞" , selected: false}, {que_options : "砍樹" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "溺水"
  },
  {
    question_number: "4.13",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/originate.mp3",
    questionStatement: "",
    options: [{que_options : "長得很好" , selected: false}, {que_options : "變形" , selected: false}, {que_options : "保持" , selected: false}, {que_options : "起源於" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "起源於"
  },
  {
    question_number: "4.14",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/leaf.mp3",
    questionStatement: "",
    options: [{que_options : "葉子" , selected: false}, {que_options : "柔軟的鞋子" , selected: false}, {que_options : "蓋子" , selected: false}, {que_options : "玻璃窗" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "葉子"
  },
  {
    question_number: "4.15",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/amateur.mp3",
    questionStatement: "",
    options: [{que_options : "業餘者" , selected: false}, {que_options : "替代球員" , selected: false}, {que_options : "國家代表" , selected: false}, {que_options : "球員" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "業餘者"
  },
  {
    question_number: "4.16",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/evacuate.mp3",
    questionStatement: "",
    options: [{que_options : "撤離" , selected: false}, {que_options : "搜身" , selected: false}, {que_options : "驚嚇" , selected: false}, {que_options : "誣陷，冤枉" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "撤離"
  },
  {
    question_number: "4.17",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/exert.mp3",
    questionStatement: "",
    options: [{que_options : "吹牛" , selected: false}, {que_options : "受傷" , selected: false}, {que_options : "盡力" , selected: false}, {que_options : "破壞" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "盡力"
  },
  {
    question_number: "4.18",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/marble.mp3",
    questionStatement: "",
    options: [{que_options : "大理石" , selected: false}, {que_options : "木頭" , selected: false}, {que_options : "軟金屬" , selected: false}, {que_options : "纖維" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "大理石"
  },
  {
    question_number: "4.19",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/diminish.mp3",
    questionStatement: "",
    options: [{que_options : "變暗" , selected: false}, {que_options : "減少" , selected: false}, {que_options : "變得多雲的" , selected: false}, {que_options : "變冷" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "減少"
  },
  {
    question_number: "4.20",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/sheriff.mp3",
    questionStatement: "",
    options: [{que_options : "機長" , selected: false}, {que_options : "管家" , selected: false}, {que_options : "警長" , selected: false}, {que_options : "家教" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "警長"
  },
  {
    question_number: "4.21",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/monarch.mp3",
    questionStatement: "",
    options: [{que_options : "軍隊" , selected: false}, {que_options : "大門" , selected: false}, {que_options : "君主" , selected: false}, {que_options : "罪犯" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "君主"
  },
  {
    question_number: "4.22",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/plunge.mp3",
    questionStatement: "",
    options: [{que_options : "到處雀躍" , selected: false}, {que_options : "驟然下降" , selected: false}, {que_options : "投入，陷入" , selected: false}, {que_options : "保持安靜" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "驟然下降"
  },
  {
    question_number: "4.23",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/mourn.mp3",
    questionStatement: "",
    options: [{que_options : "街頭表演" , selected: false}, {que_options : "悲痛" , selected: false}, {que_options : "努力" , selected: false}, {que_options : "謹慎花費的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "悲痛"
  },
  {
    question_number: "4.24",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/4k/fragile.mp3",
    questionStatement: "",
    options: [{que_options : "昂貴的" , selected: false}, {que_options : "稀有的" , selected: false}, {que_options : "受歡迎的" , selected: false}, {que_options : "易碎的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "易碎的"
  },
  {
    question_number: "5.1",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/scrub.mp3",
    questionStatement: "",
    options: [{que_options : "刷洗" , selected: false}, {que_options : "修理" , selected: false}, {que_options : "擔心" , selected: false}, {que_options : "素描" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "刷洗" 
  },
  {
    question_number: "5.2",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/dinosaur.mp3",
    questionStatement: "",
    options: [{que_options : "海盜" , selected: false}, {que_options : "精靈" , selected: false}, {que_options : "飛龍" , selected: false}, {que_options : "恐龍" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "恐龍"
  },
  {
    question_number: "5.3",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/nun.mp3",
    questionStatement: "",
    options: [{que_options : "蟲子" , selected: false}, {que_options : "嚴重的意外" , selected: false}, {que_options : "修女" , selected: false}, {que_options : "一道光" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "修女"
  },
  {
    question_number: "5.4",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/compost.mp3",
    questionStatement: "",
    options: [{que_options : "強烈支持" , selected: false}, {que_options : "心靈上的幫助" , selected: false}, {que_options : "具體的" , selected: false}, {que_options : "堆肥" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "堆肥"
  },
  {
    question_number: "5.5",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/miniature.mp3",
    questionStatement: "",
    options: [{que_options : "縮小模型" , selected: false}, {que_options : "磚房" , selected: false}, {que_options : "微生物" , selected: false}, {que_options : "計劃" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "縮小模型"
  },
  {
    question_number: "5.6",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/crab.mp3",
    questionStatement: "",
    options: [{que_options : "螃蟹" , selected: false}, {que_options : "餅乾" , selected: false}, {que_options : "手稿" , selected: false}, {que_options : "蟋蟀" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "螃蟹"
  },
  {
    question_number: "5.7",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/vocabulary.mp3",
    questionStatement: "",
    options: [{que_options : "詞彙" , selected: false}, {que_options : "技巧" , selected: false}, {que_options : "金錢" , selected: false}, {que_options : "槍" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "詞彙"
  },
  {
    question_number: "5.8",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/corpse.mp3",
    questionStatement: "",
    options: [{que_options : "水瓶" , selected: false}, {que_options : "手機" , selected: false}, {que_options : "貝雷帽" , selected: false}, {que_options : "屍體" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "屍體"
  },
  {
    question_number: "5.9",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/rove.mp3",
    questionStatement: "",
    options: [{que_options : "喝醉" , selected: false}, {que_options : "漫遊，流浪" , selected: false}, {que_options : "哼歌" , selected: false}, {que_options : "努力" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "漫遊，流浪"
  },
  {
    question_number: "5.10",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/divert.mp3",
    questionStatement: "",
    options: [{que_options : "改變方向" , selected: false}, {que_options : "建橋" , selected: false}, {que_options : "弄髒" , selected: false}, {que_options : "擴寬並加深" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "改變方向"
  },
  {
    question_number: "5.11",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/trench.mp3",
    questionStatement: "",
    options: [{que_options : "山" , selected: false}, {que_options : "溝渠" , selected: false}, {que_options : "垃圾" , selected: false}, {que_options : "漂亮的風景" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "溝渠"
  },
  {
    question_number: "5.12",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/technician.mp3",
    questionStatement: "",
    options: [{que_options : "魔術師" , selected: false}, {que_options : "技工" , selected: false}, {que_options : "醫生" , selected: false}, {que_options : "音樂家" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "技工"
  },
  {
    question_number: "5.13",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/query.mp3",
    questionStatement: "",
    options: [{que_options : "頭痛" , selected: false}, {que_options : "財富" , selected: false}, {que_options : "疑問" , selected: false}, {que_options : "主意" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "疑問"
  },
  {
    question_number: "5.14",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/mug.mp3",
    questionStatement: "",
    options: [{que_options : "馬克杯" , selected: false}, {que_options : "舊車" , selected: false}, {que_options : "內衣" , selected: false}, {que_options : "屋簷" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "馬克杯"
  },
  {
    question_number: "5.15",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/static.mp3",
    questionStatement: "",
    options: [{que_options : "不受歡迎的" , selected: false}, {que_options : "合法的" , selected: false}, {que_options : "流行的" , selected: false}, {que_options : "靜止不動的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "靜止不動的"
  },
  {
    question_number: "5.16",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/slaughter.mp3",
    questionStatement: "",
    options: [{que_options : "問題" , selected: false}, {que_options : "科研" , selected: false}, {que_options : "屠殺" , selected: false}, {que_options : "體育賽事" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "屠殺"
  },
  {
    question_number: "5.17",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/spider.mp3",
    questionStatement: "",
    options: [{que_options : "疹子" , selected: false}, {que_options : "蜘蛛" , selected: false}, {que_options : "小巴" , selected: false}, {que_options : "一種魚" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "蜘蛛"
  },
  {
    question_number: "5.18",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/circus.mp3",
    questionStatement: "",
    options: [{que_options : "教堂" , selected: false}, {que_options : "馬戲團" , selected: false}, {que_options : "體育館" , selected: false}, {que_options : "合唱團" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "馬戲團"
  },
  {
    question_number: "5.19",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/sofa.mp3",
    questionStatement: "",
    options: [{que_options : "沙發" , selected: false}, {que_options : "裁斷機" , selected: false}, {que_options : "軟管" , selected: false}, {que_options : "嬰兒車" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "沙發"
  },
  {
    question_number: "5.20",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/logo.mp3",
    questionStatement: "",
    options: [{que_options : "芒果" , selected: false}, {que_options : "接待會" , selected: false}, {que_options : "標誌" , selected: false}, {que_options : "渡假屋" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "標誌"
  },
  {
    question_number: "5.21",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/commemorate.mp3",
    questionStatement: "",
    options: [{que_options : "紀念" , selected: false}, {que_options : "假裝同意" , selected: false}, {que_options : "反抗" , selected: false}, {que_options : "讚揚" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "紀念"
  },
  {
    question_number: "5.22",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/crook.mp3",
    questionStatement: "",
    options: [{que_options : "騙子" , selected: false}, {que_options : "醫護人員" , selected: false}, {que_options : "跛子" , selected: false}, {que_options : "建築師" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "騙子"
  },
  {
    question_number: "5.23",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/volt.mp3",
    questionStatement: "",
    options: [{que_options : "信封" , selected: false}, {que_options : "調味料" , selected: false}, {que_options : "伏特" , selected: false}, {que_options : "磁鐵" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "伏特"
  },
  {
    question_number: "5.24",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/5k/warfare.mp3",
    questionStatement: "",
    options: [{que_options : "罪" , selected: false}, {que_options : "跳舞" , selected: false}, {que_options : "戰爭" , selected: false}, {que_options : "污染" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "戰爭"
  },
  {
    question_number: "6.1",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/concept.mp3",
    questionStatement: "",
    options: [{que_options : "契約" , selected: false}, {que_options : "概念" , selected: false}, {que_options : "方法" , selected: false}, {que_options : "法案" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "概念"
  },
  {
    question_number: "6.2",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/similar.mp3",
    questionStatement: "",
    options: [{que_options : "明確的" , selected: false}, {que_options : "極好的" , selected: false}, {que_options : "簡單的" , selected: false}, {que_options : "相似的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "相似的"
  },
  {
    question_number: "6.3",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/item.mp3",
    questionStatement: "",
    options: [{que_options : "項目" , selected: false}, {que_options : "調查" , selected: false}, {que_options : "會議" , selected: false}, {que_options : "方面" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "項目"
  },
  {
    question_number: "6.4",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/component.mp3",
    questionStatement: "",
    options: [{que_options : "架構" , selected: false}, {que_options : "層" , selected: false}, {que_options : "組成部分" , selected: false}, {que_options : "夥伴" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "組成部分"
  },
  {
    question_number: "6.5",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/compensate.mp3",
    questionStatement: "",
    options: [{que_options : "補償" , selected: false}, {que_options : "排除" , selected: false}, {que_options : "位於" , selected: false}, {que_options : "聚集" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "補償"
  },
  {
    question_number: "6.6",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/professional.mp3",
    questionStatement: "",
    options: [{que_options : "國內的" , selected: false}, {que_options : "專業的" , selected: false}, {que_options : "注冊的" , selected: false}, {que_options : "有名的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "專業的"
  },
  {
    question_number: "6.7",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/external.mp3",
    questionStatement: "",
    options: [{que_options : "不明的" , selected: false}, {que_options : "外部的" , selected: false}, {que_options : "客觀的" , selected: false}, {que_options : "隨後的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "外部的"
  },
  {
    question_number: "6.8",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/clause.mp3",
    questionStatement: "",
    options: [{que_options : "邏輯" , selected: false}, {que_options : "目標" , selected: false}, {que_options : "圖片" , selected: false}, {que_options : "法條" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "法條"
  },
  {
    question_number: "6.9",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/migrate.mp3",
    questionStatement: "",
    options: [{que_options : "合作" , selected: false}, {que_options : "遷移" , selected: false}, {que_options : "聚集" , selected: false}, {que_options : "進化" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "遷移"
  },
  {
    question_number: "6.10",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/priority.mp3",
    questionStatement: "",
    options: [{que_options : "妥協" , selected: false}, {que_options : "優先的事" , selected: false}, {que_options : "出版品" , selected: false}, {que_options : "成功者" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "優先的事"
  },
  {
    question_number: "6.11",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/reverse.mp3",
    questionStatement: "",
    options: [{que_options : "顛倒" , selected: false}, {que_options : "順序" , selected: false}, {que_options : "調整" , selected: false}, {que_options : "時間" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "顛倒"
  },
  {
    question_number: "6.12",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/arbitrary.mp3",
    questionStatement: "",
    options: [{que_options : "隨意的" , selected: false}, {que_options : "關鍵的" , selected: false}, {que_options : "厲嚴的" , selected: false}, {que_options : "足夠的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "隨意的"
  },
  {
    question_number: "6.13",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/mutual.mp3",
    questionStatement: "",
    options: [{que_options : "明顯的" , selected: false}, {que_options : "成熟的" , selected: false}, {que_options : "相互的" , selected: false}, {que_options : "拘束的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "相互的"
  },
  {
    question_number: "6.14",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/alternative.mp3",
    questionStatement: "",
    options: [{que_options : "替代方法" , selected: false}, {que_options : "任務" , selected: false}, {que_options : "評論" , selected: false}, {que_options : "互動" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "替代方法"
  },
  {
    question_number: "6.15",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/colleague.mp3",
    questionStatement: "",
    options: [{que_options : "主題" , selected: false}, {que_options : "時間表" , selected: false}, {que_options : "同事" , selected: false}, {que_options : "論文" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "同事"
  },
  {
    question_number: "6.16",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/legal.mp3",
    questionStatement: "",
    options: [{que_options : "合法的" , selected: false}, {que_options : "可用的" , selected: false}, {que_options : "明顯的" , selected: false}, {que_options : "主要的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "合法的"
  },
  {
    question_number: "6.17",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/site.mp3",
    questionStatement: "",
    options: [{que_options : "元素" , selected: false}, {que_options : "估計" , selected: false}, {que_options : "地方" , selected: false}, {que_options : "出口" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "地方"
  },
  {
    question_number: "6.18",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/institute.mp3",
    questionStatement: "",
    options: [{que_options : "獲得" , selected: false}, {que_options : "管理" , selected: false}, {que_options : "制定" , selected: false}, {que_options : "尋找" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "制定"
  },
  {
    question_number: "6.19",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/retain.mp3",
    questionStatement: "",
    options: [{que_options : "綜合" , selected: false}, {que_options : "升遷" , selected: false}, {que_options : "協調" , selected: false}, {que_options : "保留" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "保留"
  },
  {
    question_number: "6.20",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/phase.mp3",
    questionStatement: "",
    options: [{que_options : "連續" , selected: false}, {que_options : "階段" , selected: false}, {que_options : "規模" , selected: false}, {que_options : "變數" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "階段"
  },
  {
    question_number: "6.21",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/pursue.mp3",
    questionStatement: "",
    options: [{que_options : "追求" , selected: false}, {que_options : "改變" , selected: false}, {que_options : "偵測" , selected: false}, {que_options : "促進" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "追求"
  },
  {
    question_number: "6.22",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/recover.mp3",
    questionStatement: "",
    options: [{que_options : "透露" , selected: false}, {que_options : "采用" , selected: false}, {que_options : "承認" , selected: false}, {que_options : "恢復" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "恢復"
  },
  {
    question_number: "6.23",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/diverse.mp3",
    questionStatement: "",
    options: [{que_options : "準確" , selected: false}, {que_options : "最小的" , selected: false}, {que_options : "有彈性" , selected: false}, {que_options : "多種的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "多種的"
  },
  {
    question_number: "6.24",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/hierarchy.mp3",
    questionStatement: "",
    options: [{que_options : "思想" , selected: false}, {que_options : "階層組織" , selected: false}, {que_options : "化學藥品" , selected: false}, {que_options : "流行服飾" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "階層組織"
  },
  {
    question_number: "6.25",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/distort.mp3",
    questionStatement: "",
    options: [{que_options : "模糊的" , selected: false}, {que_options : "相同的" , selected: false}, {que_options : "被扭曲的" , selected: false}, {que_options : "暫時的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "被扭曲的"
  },
  {
    question_number: "6.26",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/accumulate.mp3",
    questionStatement: "",
    options: [{que_options : "感激的" , selected: false}, {que_options : "累積的" , selected: false}, {que_options : "補充" , selected: false}, {que_options : "符和" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "累積的"
  },
  {
    question_number: "6.27",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/abandon.mp3",
    questionStatement: "",
    options: [{que_options : "利用" , selected: false}, {que_options : "操縱" , selected: false}, {que_options : "拋棄" , selected: false}, {que_options : "小化" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "拋棄"
  },
  {
    question_number: "6.28",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/rigid.mp3",
    questionStatement: "",
    options: [{que_options : "質性的" , selected: false}, {que_options : "同時的" , selected: false}, {que_options : "暫時的" , selected: false}, {que_options : "頑固的" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "頑固的"
  },
  {
    question_number: "6.29",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/notwithstanding.mp3",
    questionStatement: "",
    options: [{que_options : "不知地" , selected: false}, {que_options : "報答" , selected: false}, {que_options : "藉以" , selected: false}, {que_options : "儘管" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "儘管"
  },
  {
    question_number: "6.30",
    type: questionTypes.VLT,
    audioSrc: "vlts/audio/AWL/perspective.mp3",
    questionStatement: "",
    options: [{que_options : "循環" , selected: false}, {que_options : "觀點" , selected: false}, {que_options : "網絡" , selected: false}, {que_options : "狀態" , selected: false}, {que_options : "我不確定這題的答案" , selected: false}],
    ans: "觀點"
  }/*,
  {
    type: questionTypes.VLT,
    readingText: "",
    options: [
      {que_options : "" , selected: false}, 
      {que_options : "" , selected: false}, 
      {que_options : "" , selected: false}, 
      {que_options : "" , selected: false}, 
    ],
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
