let categories = ["music", "sport_and_leisure", "film_and_tv", "arts_and_literature", "history", "society_and_culture", "science", "geography", "food_and_drink", "general_knowledge"];
let player1 = "";
let player2 = "";
let oldSelectedCategories = [];
let questions = [];
let currentPlayerTurn;
let currentQuestionTurn = 0;
let nextButtonClickCount = 0;
let player1Score = 0;
let player2Score = 0;

async function fetchQuestionByCategories() {
	let category = document.getElementById("categoryList").value;
	if (oldSelectedCategories.includes(category)) {
		alert("Please choose another category, this category is choosed in previous ");
		return;
	} else {
		oldSelectedCategories.push(category);
	}

	let jsonResponse = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}`);
	questions = await jsonResponse.json();
	currentPlayerTurn = 1;
	console.log(questions);
	let firstQuestion = questions[currentQuestionTurn];
	console.log(firstQuestion);
	document.getElementById("currentPlayer").textContent = `${player1} turn for quiz`
	document.getElementById("battleQuestion").textContent = firstQuestion.question.text
	document.getElementById("option1").textContent = firstQuestion.correctAnswer
	for (let i = 1; i <= firstQuestion.incorrectAnswers.length; i++) {
		let option = `option${i + 1}`
		document.getElementById(option).textContent = firstQuestion.incorrectAnswers[i - 1]
	}
	document.getElementById("battleQuestionDiv").style.visibility = "visible";
	document.getElementById("categoriesSelectionDiv").style.visibility = "collapse";
}

function nextTurn() {
	nextButtonClickCount++;
	console.log(nextButtonClickCount);
	if (nextButtonClickCount % 2 === 0) {
		currentQuestionTurn++;
	}

	if (currentPlayerTurn === 1) {
		currentPlayerTurn = 2;
	} else {
		currentPlayerTurn = 1;
	}

	let playerTurn;
	if (currentPlayerTurn === 1) {
		playerTurn = player1;
	} else {
		playerTurn = player2
	}
	if (currentQuestionTurn >= questions.length) {
		alert("Round Over! Select another category or end game.");
		document.getElementById("battleQuestionDiv").style.visibility = "collapse";
		document.getElementById("categoriesSelectionDiv").style.visibility = "visible";
		document.getElementById("gameEndButton").style.visibility = "visible";
		nextButtonClickCount = 0;
		return;
	}
	let nextQuestion = questions[currentQuestionTurn];
	console.log(nextQuestion);
	document.getElementById("currentPlayer").textContent = `${playerTurn} turn for quiz`
	document.getElementById("battleQuestion").textContent = nextQuestion.question.text
	document.getElementById("option1").textContent = nextQuestion.correctAnswer
	for (let i = 1; i <= nextQuestion.incorrectAnswers.length; i++) {
		let option = `option${i + 1}`
		document.getElementById(option).textContent = nextQuestion.incorrectAnswers[i - 1]
	}

	console.log(currentQuestionTurn);

}

function checkPlayerInput() {
	player1 = document.getElementById("player1").value;
	console.log(player1);
	player2 = document.getElementById("player2").value;
	console.log(player2);
	if (player1 === "" || player2 === "") {
		alert("please enter the players names!")
		return;
	}
	document.getElementById("categoriesSelectionDiv").style.visibility = "visible";
	document.getElementById("playersNameInputDiv").style.visibility = "collapse";
}

function checkAnswer(button) {
	let currentQuestionAnswer = questions[currentQuestionTurn];
	let selectedButtonText = button.textContent
	console.log(selectedButtonText);
	console.log(currentQuestionAnswer.correctAnswer);
	if (selectedButtonText !== currentQuestionAnswer.correctAnswer) {
		alert("answer is not correct please click on next turn");
		return;
	}

	let score = 0;

	if (currentQuestionAnswer.difficulty === "easy") {
		score = 10;
	} else if (currentQuestionAnswer.difficulty === "medium") {
		score = 15;
	} else {
		score = 20;
	}

	if (currentPlayerTurn == 1) {
		player1Score += score;
	} else {
		player2Score += score;
	}
	console.log(score);
	document.getElementById("player1Score").textContent = `${player1} Score: ${player1Score}`
	document.getElementById("player2Score").textContent = `${player2} Score: ${player2Score}`
	document.getElementById("scoreBoard").style.visibility = "visible"
}

function endGame() {
	document.getElementById("categoriesSelectionDiv").style.visibility = "collapse";
	document.getElementById("declairPlayeWin").style.visibility = "visible";
	document.getElementById("gameOverHeader").style.visibility = "visible";
	let text;
	if (player1Score > player2Score) {
		text = `${player1} is the winner of battle game.`
	} else if (player1Score === player2Score) {
		text = `It is draw between the ${player1} and ${player2}.`
	} else {
		text = `${player2} is the winner of battle game.`
	}
	document.getElementById("declairPlayeWin").textContent = text;
}