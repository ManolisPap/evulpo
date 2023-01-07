import Question from "../Question.js";
import QuestionBoard from "./QuestionUI.js";

const NO_OPTION_SELECTED = -1;
const DISABLED_BUTTON_CSS = "disabled-button";

class Board {
  /**
   *
   * @param {Question[]} questions
   */
  constructor(questions) {
    this.questions = questions;
    this.questionsStatus = []; // stores true or false depending if a question was answered correct or wrong by the user
    this.currentQuestion = 0;
    this.score = 0;
    this.questionBoard = null;

    // Select and Store HTML Elements/Nodes
    this.questionNumberingContainerElem = document.getElementById(
      "questions-numbering-container"
    );
    this.scoreContainerElem = document.getElementById("score-container");
    this.evalBtnElem = document.getElementById("evaluation-button");
    this.nextQuestionBtnElem = document.getElementById("next-question-button");
    this.evalMsgElem = document.getElementById("evaluation-message");

    // specific for each question. need to re-initialize it on each question.
    this.selectedAnswerIndex = null;
  }

  render() {
    this.#renderQuestionPagination();
    this.#initQuestionBoard();
    this.#renderCurrentQuestion();
    this.#attachNextButtonHandler();
    this.evalBtnElem.addEventListener("click", this.#myEvaluation);
  }

  /**
   * Renders the question pagination, indicating the current question, the wrong and correct answers
   */
  #renderQuestionPagination() {
    this.questionNumberingContainerElem.innerHTML = "";
    this.questions.forEach((question, i) => {
      // mark the current question
      const activeClass = i == this.currentQuestion ? "active" : "";

      // indicate if a questions was answered correct or wrong by the user
      const correctClass = this.questionsStatus[i] ? "correct" : "";
      const wrongClass = this.questionsStatus[i] == false ? "wrong" : "";

      this.questionNumberingContainerElem.innerHTML += `<div class="question-number ${activeClass} ${correctClass} ${wrongClass}">
			${i + 1}
		</div>`;
    });
  }

  /**
   * Initialize the QuestionBoard
   */
  #initQuestionBoard() {
    this.questionBoard = new QuestionBoard((selectedAnswerIndex) => {
      this.selectedAnswerIndex = selectedAnswerIndex;
    });
  }

  /**
   * Renders the current question
   */
  #renderCurrentQuestion() {
    this.selectedAnswerIndex = NO_OPTION_SELECTED;

    this.evalMsgElem.innerHTML =
      "<p>Select an option and evaluate your answer!!<p>";

    this.#enableEvalButton();
    this.#disableNextButton();

    const question = this.questions[this.currentQuestion];
    this.questionBoard.renderQuestion(question);
  }

  /**
   * Attach the click handler for the next button.
   */
  #attachNextButtonHandler() {
    this.nextQuestionBtnElem.addEventListener("click", () => {
      if (this.#hasMoreQuestions()) {
        this.currentQuestion++;
        this.#renderCurrentQuestion();
      } else {
        this.evalMsgElem.innerHTML = "";
        alert(`End of the Quiz. Your total score is: ${this.score}`);
      }
      this.#renderQuestionPagination();
    });
  }

  #hasMoreQuestions() {
    return this.currentQuestion < this.questions.length - 1;
  }

  #enableNextButton() {
    this.nextQuestionBtnElem.disabled = false;
    this.nextQuestionBtnElem.classList.remove(DISABLED_BUTTON_CSS);
  }

  #disableNextButton() {
    this.nextQuestionBtnElem.disabled = true;
    this.nextQuestionBtnElem.classList.add(DISABLED_BUTTON_CSS);
  }

  #disableEvalButton() {
    this.evalBtnElem.disabled = true;
    this.evalBtnElem.classList.add(DISABLED_BUTTON_CSS);
  }

  #enableEvalButton() {
    this.evalBtnElem.disabled = false;
    this.evalBtnElem.classList.remove(DISABLED_BUTTON_CSS);
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

    const { answerIndex, score, answerOptions } =
      this.questions[this.currentQuestion];
    let evalMsg = "";
    let isCorrectOption = this.selectedAnswerIndex == answerIndex;
    if (isCorrectOption) {
      evalMsg = "<p>Correct answer!</p>";
      this.score += score;
      this.scoreContainerElem.innerHTML = `Score: ${this.score}`;
    } else {
      const answer = answerOptions[answerIndex];
      evalMsg = `<p>Wrong Answer! The correct answer is: ${answer}.</p>`;
    }
    this.questionsStatus.push(isCorrectOption);
    this.evalMsgElem.innerHTML = evalMsg;
    this.#disableEvalButton();
    this.#enableNextButton();
    this.questionBoard.styleSelectedEvaluatedOption(
      this.selectedAnswerIndex,
      isCorrectOption
    );
  };

  /**
   *
   * @returns true if the user has select an option, else false
   */
  #hasUserSelectAnOption() {
    return this.selectedAnswerIndex != NO_OPTION_SELECTED;
  }
}

export default Board;
