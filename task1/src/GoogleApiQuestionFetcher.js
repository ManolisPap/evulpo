import Question from "./Question.js";

const API_KEY = "AIzaSyCfuQLHd0Aha7KuNvHK0p6V6R_0kKmsRX4";
const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];

class GoogleApiQuestionFetcher {
  #googleApi;
  #resolve;

  constructor(googleApi) {
    this.#googleApi = googleApi;
    this.#resolve = undefined;
  }

  fetchQuestions = (resolve, reject) => {
    return new Promise((resolve, reject) => {
      this.#googleApi.load("client", this.#initClient);
      // store the resolver function, and call it when we have the response/questions from the google sheet API
      this.#resolve = resolve;
    });
  };

  #initClient = () => {
    this.#googleApi.client
      .init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
      })
      .then(
        () => this.#getExerciseData(),
        (error) => console.log(JSON.stringify(error, null, 2))
      );
  };

  #getExerciseData = () => {
    this.#googleApi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: "1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc",
        range: "Learning!A1:F10",
      })
      .then(
        (response) => {
          // console.log(response);
          console.log(response.result.values);
          const questions = this.#convertResponseToQuestionsArray(response);
          this.#resolve(questions);
        },
        () => {
          alert("Error: " + response.result.error.message);
          console.log("Error: " + response.result.error.message);
        }
      );
  };

  #convertResponseToQuestionsArray(response) {
    const questions = response.result.values.map((question, index) => {
      // skip header
      if (index == 0) {
        return null;
      }

      return new Question(
        question[0],
        question[1],
        question[2],
        question[3].split(";"),
        parseInt(question[4]),
        parseFloat(question[5])
      );
    });
    questions.shift(); // remove null (related to header return)
    console.log(questions);
    return questions;
  }
}

export default GoogleApiQuestionFetcher;
