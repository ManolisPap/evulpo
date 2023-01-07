import Question from "../Question.js";

const NO_OPTION_SELECTED = -1;

class QuestionBoard {
  /**
   *
   * @param {callback} onCorrectSelection
   * @param {callback} onWrongSelection
   */
  constructor(onCorrectSelection, onWrongSelection) {
    this.onCorrectSelection = onCorrectSelection;
    this.onWrongSelection = onWrongSelection;

    // Select and Store HTML Elements/Nodes
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

    this.evalBtnElem.addEventListener("click", this.#myEvaluation);
  }

  /**
   * @param {number} optionNum, Which question option html element to select
   * @returns the html element that contains an option for a question
   */
  #getOptionElem(optionNum) {
    return document.getElementById(`option-${optionNum}`);
  }

  /**
   * @param {Question} questionObj, The question object that holds all the information for the question, like Topic, Score, Options, etc.
   */
  renderQuestion(questionObj) {
    this.answerOptions = questionObj.answerOptions;
    this.answerIndex = questionObj.answerIndex;
    this.selectedAnswerIndex = NO_OPTION_SELECTED;
    this.answer = this.answerOptions[this.answerIndex];

    this.evalMsgElem.innerHTML =
      "<p>Select an option and evaluate your answer!!<p>";

    this.#enableEvalButton();

    this.questionElem.innerHTML = questionObj.question;
    this.topicElem.innerHTML = `Topic: ${questionObj.topic}, Score: ${questionObj.score}`;

    this.optionsContainerElem.innerHTML = ""; // reset previous question options

    // render answer options
    this.answerOptions.forEach((answerOption, i) => {
      this.optionsContainerElem.innerHTML += `<div class='unchosen option' id='option-${i}'>
			<span class='text'>${answerOption}</span>
		</div>`;
    });

    // attach click handlers on question options
    const answerOptionElems = document.querySelectorAll(".option");
    answerOptionElems.forEach((element, index) =>
      element.addEventListener("click", () => {
        console.log(`Choice ${index} clicked.`);
        this.#toggleChoice(index);
      })
    );
  }

  /**
   * Update the selectedAnswerIndex to the selected one and update the UI accordingly.
   * @param {number} choiceNum
   */
  #toggleChoice(choiceNum) {
    this.selectedAnswerIndex = choiceNum;

    // remove styling from previously selected answers
    for (let i = 0; i < this.answerOptions.length; i++) {
      const div = this.#getOptionElem(i);
      div.classList.remove("selected-option");
    }

    // set styling for the new selected option
    const selectedOptionElem = this.#getOptionElem(choiceNum);
    console.log(selectedOptionElem);
    selectedOptionElem.classList.add("selected-option");
  }

  /**
   * Evaluates the user answer and updates the UI accordingly.
   * @returns (-)
   */
  #myEvaluation = () => {
    if (!this.#hasUserSelectAnOption()) {
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
    this.#enableNextButton();
    this.#disableEvalButton();
    const selectedOptionElem = this.#getOptionElem(this.selectedAnswerIndex);
    selectedOptionElem.classList.add(resultClass);
  };

  /**
   *
   * @returns true if the user has select an option, else false
   */
  #hasUserSelectAnOption() {
    return this.selectedAnswerIndex != NO_OPTION_SELECTED;
  }

  #enableNextButton() {
    this.nextQuestionBtnElem.disabled = false;
    this.nextQuestionBtnElem.classList.remove("disabled-button");
  }

  #disableEvalButton() {
    this.evalBtnElem.disabled = true;
    this.evalBtnElem.classList.add("disabled-button");
  }

  #enableEvalButton() {
    this.evalBtnElem.disabled = false;
    this.evalBtnElem.classList.remove("disabled-button");
  }
}

export default QuestionBoard;
