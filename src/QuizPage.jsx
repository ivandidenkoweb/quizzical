import { useState, useEffect } from "react"
import he from "he"
import clsx from "clsx"

export default function QuizPage(props) {
	const [questions, setQuestions] = useState([])
	const [userAnswers, setUserAnswers] = useState({})
	const [results, setResults] = useState({})
	const [correctAnswers, setCorrectAnswers] = useState(0)

	useEffect(() => {
		fetch("https://opentdb.com/api.php?amount=5&type=multiple")
			.then(res => res.json())
			.then(data => {
				const formatted = data.results.map(q => {
					const allAnswers = [...q.incorrect_answers]
					const randomIndex = Math.floor(Math.random() * (allAnswers.length + 1))
					allAnswers.splice(randomIndex, 0, q.correct_answer)
					return {
						text: he.decode(q.question),
						options: allAnswers.map(item => he.decode(item)),
						correct: he.decode(q.correct_answer)
					}
				})
				setQuestions(formatted)
			})
	}, [])

	function checkAnswer(formData) {
		const answers = {}
		for (let [key, value] of formData.entries()) {
			answers[key] = value
		}
		setUserAnswers(answers)

		const allAnswered = questions.every((_, index) => answers[`question-${index}`])
		if (!allAnswered) {
			alert("Answer all questions, please")
			return
		}

		const newResults = {}
		questions.forEach((q, index) => {
			const answer = answers[`question-${index}`]
			newResults[`question-${index}`] = answer === q.correct
		});
		setResults(newResults)

		let score = 0
		for (let key in newResults) {
			if (newResults[key] === true) {
				score++
			}
		}
		setCorrectAnswers(score)

		props.changeIsChecked()
	}

	return (
		<main className="quiz-page">
			<form className="quiz-form" action={checkAnswer}>
				{questions.map((q, index) => (
					<div key={index} className="question-block">
						<h3 className="question-title">{q.text}</h3>
						<div className="options">
							{q.options.map((opt, i) => {
								const userAnswer = userAnswers[`question-${index}`]
								const isCorrect = opt === q.correct
								const wasChecked = results[`question-${index}`] !== undefined

								return (
									<label
										key={i}
										className={clsx("option", {
											correct: wasChecked && isCorrect,
											wrong: wasChecked && userAnswer === opt && !isCorrect,
											neutral: wasChecked && userAnswer !== opt && !isCorrect,
										})}

									>
										<input
											type="radio"
											name={`question-${index}`}
											value={opt}
										/>
										<span className="label">{opt}</span>
									</label>
								)
							})}
						</div>
					</div>
				))}
				<div className="result">
					{props.isChecked ? <span className="result-text">You scored {correctAnswers}/5 correct answers</span> : null}
					{props.isChecked ? (
						<button
							type="button"
							className="check-btn"
							onClick={props.restartQuiz}
						>
							Play again
						</button>
					) : (
						<button type="submit" className="check-btn">
							Check answers
						</button>
					)}
				</div>
			</form>
		</main>
	)
}