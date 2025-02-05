const apiUrl = "https://the-trivia-api.com/v2/questions";
let questions = [];
let currentQuestionIndex = 0;
let currentPlayer = 1;
let player1 = "";
let player2 = "";
let scores = { 1: 0, 2: 0 };
let selectedCategory = "";
let usedCategories = [];
let nextTurnCount = 0;
let categories = ["music", "sport_and_leisure", "film_and_tv", "arts_and_literature", "history"
	, "society_and_culture", "science", "geography", "food_and_drink", "general_knowledge"];

function startGame() {
	player1 = document.getElementById("player1").value;
	player2 = document.getElementById("player2").value;

	if (!player1 || !player2) {
		alert("Please enter both player names!");
		return;
	}

	document.getElementById("categorySelection").style.display = "block";
	document.getElementById("playerInputNames").style.display = "none";

	populateCategoryDropdown();
}

function populateCategoryDropdown() {

	let categorySelect = document.getElementById("categories");

	categorySelect.innerHTML = "";
	categories.forEach(category => {
		let option = document.createElement("option");
		option.value = category;
		option.textContent = category.replace("_", " ");
		categorySelect.appendChild(option);
	});
}

async function fetchQuestions() {
	selectedCategory = document.getElementById("categories").value;
	if (usedCategories.includes(selectedCategory)) {
		alert("Please select another category from categories list")
		return
	}
	console.log(selectedCategory);
	usedCategories.push(selectedCategory);

	const response = await fetch(`${apiUrl}?categories=${selectedCategory}`);
	const data = await response.json();

	// Filter all questions for the selected category
	questions = data.filter(q => q.category === selectedCategory);

	if (questions.length === 0) {
		alert("No questions available in this category, please select another.");
		return;
	}

	document.getElementById("categorySelection").style.display = "none";
	document.getElementById("battleQuestion").style.display = "block";

	currentQuestionIndex = 0;
	displayQuestion();
}

function displayQuestion() {
	let question = questions[currentQuestionIndex];
	let playerName = "";
	if (currentPlayer === 1) {
		playerName = player1;
	} else {
		playerName = player2
	}

	document.getElementById("currentPlayerTurn").textContent = `${playerName}'s Turn`;
	document.getElementById("questionTextBox").textContent = question.question.text;

	let answers = [...question.incorrectAnswers, question.correctAnswer];
	answers.sort(() => Math.random() - 0.5); // Shuffle answers
	let answerButtons = document.getElementById("answerTextBox");
	answerButtons.innerHTML = "";
	answers.forEach(answer => {
		let btn = document.createElement("button");
		btn.textContent = answer;
		btn.onclick = () => checkAnswer(answer, question.correctAnswer);
		answerButtons.appendChild(btn);
	});
}

function checkAnswer(selected, correct) {
	let points = questions[currentQuestionIndex].difficulty === "easy" ? 10 :
		questions[currentQuestionIndex].difficulty === "medium" ? 15 : 20;

	if (selected === correct) {
		alert("Correct!");
		scores[currentPlayer] += points;
	} else {
		alert("Wrong answer!");
	}

	updateScoreboard();
	document.getElementById("nextButton").style.display = "block";
}

function updateScoreboard() {
	document.getElementById("scoreBoard").style.display = "block";
	document.getElementById("score1").textContent = `${player1} Score: ${scores[1]}`;
	document.getElementById("score2").textContent = `${player2} Score: ${scores[2]}`;
}

function nextTurn() {
	nextTurnCount++;
	if (nextTurnCount % 2 === 0) {
		currentQuestionIndex++;
	}
	document.getElementById("nextButton").style.display = "none";

	if (currentQuestionIndex >= questions.length) {
		alert("Round Over! Select another category or end game.");
		document.getElementById("battleQuestion").style.display = "none";
		document.getElementById("categorySelection").style.display = "block";
		nextTurnCount = 0;
		return;
	}

	if (currentPlayer === 1) {
		currentPlayer = 2;
	} else {
		currentPlayer = 1;
	}
	displayQuestion();
}
