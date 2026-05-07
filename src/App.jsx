import { useState } from "react";
import StartPage from "./StartPage"
import QuizPage from "./QuizPage"


export default function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [isChecked, setIsChecked] = useState(false)

  function changeIsChecked() {
    setIsChecked((prev) => !prev)
  }

  function restartQuiz() {
    setQuizStarted(false);
    setIsChecked(false);
  }


  return (
    !quizStarted && !isChecked ? <StartPage onStart={() => setQuizStarted(true)} /> : <QuizPage isChecked={isChecked} changeIsChecked={changeIsChecked} restartQuiz={restartQuiz}/>
  )
}