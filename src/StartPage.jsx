export default function StartPage(props) {
	return (
		<main className="start-page">
			<h1 className="start-page-title">Quizzical</h1>
			<p className="start-page-description">Test your knowledge in a short quiz — quick, fun, and to the point.</p>
			<button className="start-page-btn" onClick={props.onStart}>Start quiz</button>
		</main>
	)
}