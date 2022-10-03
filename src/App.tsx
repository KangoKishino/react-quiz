import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"

type Quiz = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

export const App = () => {
  const [quizs, setQuizs] = useState<Quiz[]>([])
  const [quizNo, setQuizNo] = useState<number>(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [correctedAnswer, setCorrectedAnswer] = useState<number>(0)

  const shuffleArray = (array: string[]) => {
    const cloneArray = [...array]

    for (let i = cloneArray.length - 1; i >= 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1))
      // 配列の要素の順番を入れ替える
      let tmpStorage = cloneArray[i]
      cloneArray[i] = cloneArray[rand]
      cloneArray[rand] = tmpStorage
    }

    return cloneArray
  }

console.log(answers)
  useEffect(() => {
    console.log('hello')
    const getQuiz = async () => {
      const response = await axios
      .get('https://opentdb.com/api.php?amount=10')
      .then((res) => {
        console.log('hello world')
        // データが取得できた時の処理
        setQuizs(res.data.results)
        setAnswers(shuffleArray([res.data.results[0].correct_answer, ...res.data.results[0].incorrect_answers]))
        return res.data.results
      })
      // データが取得できなかっsた時の処理
      .catch((err) => console.log(err))
      // 最終的に実行される処理
    }
    getQuiz()

  }, [])

  const onNextQuestion = () => {
    if(quizs[quizNo].correct_answer === selectedAnswer) {
      setCorrectedAnswer(correctedAnswer + 1)
    }
    setQuizNo(quizNo + 1)
    setAnswers(shuffleArray([quizs[quizNo + 1].correct_answer, ...quizs[quizNo + 1].incorrect_answers]))
    setSelectedAnswer('')
  }

  const onAnswer = (answer: string) => {
    setSelectedAnswer(answer)
  }

  return (
    <div>
      <div>正解数：{correctedAnswer}/10</div>
      {
        quizs.length && quizNo < 10 ? (
        <div>
          <div>category:{quizs[quizNo].category}</div>
          <div>Question:{quizs[quizNo].question}</div>
          {answers.map((answer, index) => {
            return <div key={answer}>
              <label>
                <input type="radio" value={answer} checked={answer === selectedAnswer} onChange={()=>onAnswer(answer)}/>{index + 1}. {answer}
              </label>
            </div>
          })}
          <button disabled={quizNo > 9} onClick={() => onNextQuestion()}>次へ</button>
        </div>
        ) : (
        <div>{quizs.length ? (<div>終了</div>) : (<div>読み込み中</div>)}</div>
        )
      }
    </div>
  )
}
