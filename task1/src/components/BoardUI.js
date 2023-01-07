import Question from "../Question.js";
import QuestionBoard from "./QuestionUI.js";

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
    this.nextQuestionBtnElem = document.getElementById("next-question-button");
    this.evalMsgElem = document.getElementById("evaluation-message");
  }

  render() {
    this.#renderQuestionPagination();
    this.#initQuestionBoard();
    this.#renderCurrentQuestion();
    this.#attachNextButtonHandler();
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
   * Initialize the QuestionBoard and render the first question
   */
  #initQuestionBoard() {
    this.questionBoard = new QuestionBoard(
      () => {
        this.questionsStatus.push(true);
        this.score += this.questions[this.currentQuestion].score;
        this.scoreContainerElem.innerHTML = `Score: ${this.score}`;
      },
      () => {
        this.questionsStatus.push(false);
      }
    );
  }

  /**
   * Renders the current question
   */
  #renderCurrentQuestion() {
    const question = this.questions[this.currentQuestion];
    this.questionBoard.renderQuestion(question);
  }

  /**
   * Attach the click handler for the next button.
   */
  #attachNextButtonHandler() {
    this.nextQuestionBtnElem.addEventListener("click", () => {
      this.#disableNextButton();

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

  #disableNextButton() {
    this.nextQuestionBtnElem.disabled = true;
    this.nextQuestionBtnElem.classList.add("disabled-button");
  }

  #hasMoreQuestions() {
    return this.currentQuestion < this.questions.length - 1;
  }
}

export default Board;
