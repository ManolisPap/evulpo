class QuestionBoard {
  constructor(onCorrectSelection, onWrongSelection) {
    this.onCorrectSelection = onCorrectSelection;
    this.onWrongSelection = onWrongSelection;

    this.topicElem = document.getElementById("topic");
    this.questionElem = document.getElementById("question");

    this.optionsContainerElem = document.getElementById("options-wrapper");

    this.evalBtnElem = document.getElementById("evaluation-button");
    this.nextQuestionBtnElem = document.getElementById("next-question-button");
    this.evalMsgElem = document.getElementById("evaluation-message");

		// specific for each question. renderQuestion() need to re-initialize it.
		this.answerOptions = null;
    this.answerIndex = null;
    this.selectedAnswerIndex = null;
    this.answer = null;

    this.evalBtnElem.addEventListener("click", this.myEvaluation);
  }

  #getOptionElem(optionNum) {
    return document.getElementById(`option-${optionNum}`);
  }

  renderQuestion(questionObj) {
    this.answerOptions = questionObj.answerOptions;
    this.answerIndex = questionObj.answerIndex;
    this.selectedAnswerIndex = -1;
    this.answer = this.answerOptions[this.answerIndex];

    this.evalMsgElem.innerHTML =
      "<p>Select an option and evaluate your answer!!<p>";

    this.evalBtnElem.disabled = false;
    this.evalBtnElem.classList.remove("disabled-button");

    this.questionElem.innerHTML = questionObj.question;
    this.topicElem.innerHTML = `Topic: ${questionObj.topic}, Score: ${questionObj.score}`;

    this.optionsContainerElem.innerHTML = ""; // reset previous question

    for (let i = 0; i < this.answerOptions.length; i++) {
      this.optionsContainerElem.innerHTML += `<div class='unchosen option' id='option-${i}'>
					<span class='text'>${this.answerOptions[i]}</span>
				</div>`;
    }

    const divOptions = document.querySelectorAll(".option");
    divOptions.forEach((element, index) =>
      element.addEventListener("click", () => {
        console.log(`Choice ${index} clicked.`);
        this.toggleChoice(index);
      })
    );
  }

  toggleChoice(choiceNum) {
    // remove styling from previously selected answers
    for (let i = 0; i < this.answerOptions.length; i++) {
      const div = this.#getOptionElem(i);
      div.classList.remove("selected-option");
    }

    this.selectedAnswerIndex = choiceNum;
    const selectedOptionElem = this.#getOptionElem(choiceNum);
    console.log(selectedOptionElem);
    selectedOptionElem.classList.add("selected-option");
  }

  myEvaluation = () => {
    if (this.selectedAnswerIndex == -1) {
      this.evalMsgElem.innerHTML =
        "<p>Select an option in order to evaluate your choice!</p>";
      return;
    }

    let evalMsg = "";
    let resultClass = "";
    if (this.selectedAnswerIndex == this.answerIndex) {
      evalMsg = "<p>Correct answer!</p>";
      resultClass = "correct";
      this.onCorrectSelection();
    } else {
      evalMsg = `<p>Wrong Answer! The correct answer is: ${this.answer}.</p>`;
      resultClass = "wrong";
      this.onWrongSelection();
    }
    this.evalMsgElem.innerHTML = evalMsg;
    this.nextQuestionBtnElem.disabled = false;
    this.evalBtnElem.disabled = true;
    this.nextQuestionBtnElem.classList.remove("disabled-button");
    this.evalBtnElem.classList.add("disabled-button");
    const selectedOptionElem = this.#getOptionElem(this.selectedAnswerIndex);
    selectedOptionElem.classList.add(resultClass);
  };
}

export default QuestionBoard;
