import Question from "../Question.js";

class QuestionBoard {
  /**
   *
   * @param {callback} onOptionSelection
   */
  constructor(onOptionSelection) {
    this.onOptionSelection = onOptionSelection;

    // Select and Store HTML Elements/Nodes
    this.topicElem = document.getElementById("topic");
    this.questionElem = document.getElementById("question");
    this.optionsContainerElem = document.getElementById("options-wrapper");
  }

  /**
   * @param {number} optionNum, Which question option html element to select
   * @returns the html element that contains an option for a question
   */
  #getOptionElem(optionNum) {
    return document.getElementById(`option-${optionNum}`);
  }

  /**
   * Renders the Topic, the Score of the question. Render the question itself and its options.
   * And attach click handler for the options.
   *
   * @param {Question} questionObj, The question object that holds all the information for the question, like Topic, Score, Options, etc.
   */
  renderQuestion(questionObj) {
    const { question, topic, score, answerOptions } = questionObj;

    this.answerOptions = answerOptions;
    this.questionElem.innerHTML = question;
    this.topicElem.innerHTML = `Topic: ${topic}, Score: ${score}`;

    let answerOptionsHTML = "";
    // render answer options
    this.answerOptions.forEach((answerOption, i) => {
      answerOptionsHTML += `<div class='unchosen option' id='option-${i}'>
			<span class='text'>${answerOption}</span>
		</div>`;
    });

    this.optionsContainerElem.innerHTML = answerOptionsHTML;

    // attach click handler on question options
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
    this.onOptionSelection(choiceNum);

    // remove styling from previously selected answers
    this.answerOptions.forEach((answerOption, i) => {
      const optionElem = this.#getOptionElem(i);
      optionElem.classList.remove("selected-option");
    });

    // set styling for the new selected option
    const selectedOptionElem = this.#getOptionElem(choiceNum);
    console.log(selectedOptionElem);
    selectedOptionElem.classList.add("selected-option");
  }

	/**
	 * 
	 * Styling the selected option depending if its correct or not
	 * 
	 * @param {number} selectedAnswerIndex, the selectedAnswerIndex of the final given answer by the user
	 * @param {boolean} isCorrectAnswer, indicates if the selected answer is correct or wrong
	 */
  styleSelectedEvaluatedOption(selectedAnswerIndex, isCorrectAnswer) {
    let resultClass = isCorrectAnswer ? "correct" : "wrong";
    const selectedOptionElem = this.#getOptionElem(selectedAnswerIndex);
    selectedOptionElem.classList.add(resultClass);
  }
}

export default QuestionBoard;
