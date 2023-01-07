import QuestionBoard from "./QuestionUI.js";

class Board {
  constructor(questions) {
    this.questions = questions;
    this.questionsStatus = []; // stores true or false depending if a question was answered correct or wrong by the user
    this.currentQuestion = 0;
    this.score = 0;

    this.questionNumberingContainerElem = document.getElementById(
      "questions-numbering-container"
    );
    this.scoreContainerElem = document.getElementById("score-container");
    this.nextQuestionBtnElem = document.getElementById("next-question-button");
    this.evalMsgElem = document.getElementById("evaluation-message");

    this.renderQuestionPagination(this.questions.length, this.currentQuestion);
    this.initQuestionBoard();
  }

  renderQuestionPagination(number, currentQuestion) {
    this.questionNumberingContainerElem.innerHTML = "";
    for (let i = 0; i < number; i++) {
      const activeClass = i == currentQuestion ? "active" : "";
      const correctClass = this.questionsStatus[i] == true ? "correct" : "";
      const wrongClass = this.questionsStatus[i] == false ? "wrong" : "";

      this.questionNumberingContainerElem.innerHTML += `<div class="inner-div ${activeClass} ${correctClass} ${wrongClass}">
				${i + 1}
			</div>`;
    }
  }

  initQuestionBoard() {
    const question = this.questions[this.currentQuestion];
    const questionBoard = new QuestionBoard(
      () => {
        this.questionsStatus.push(true);
        this.score += this.questions[this.currentQuestion].score;
        this.scoreContainerElem.innerHTML = `Score: ${this.score}`;
      },
      () => {
        this.questionsStatus.push(false);
      }
    );
    questionBoard.renderQuestion(question);

    this.nextQuestionBtnElem.addEventListener("click", () => {
      this.nextQuestionBtnElem.disabled = true;
      this.nextQuestionBtnElem.classList.add("disabled-button");

      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        const question = this.questions[this.currentQuestion];
        questionBoard.renderQuestion(question);
      } else {
        this.evalMsgElem.innerHTML = "";
        alert("End of quiz");
      }
      this.renderQuestionPagination(
        this.questions.length,
        this.currentQuestion
      );
    });
  }
}

export default Board;
