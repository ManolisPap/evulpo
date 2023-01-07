import Board from "./src/components/BoardUI.js";
import GoogleApiQuestionFetcher from "./src/GoogleApiQuestionFetcher.js";

function handleClientLoad(googleApi) {
  const questionFetcher = new GoogleApiQuestionFetcher(googleApi);
  questionFetcher.fetchQuestions().then((questions) => {
    
		// After loading the question we can remove the loader from the DOM
    document.getElementById("loader").remove();

		// Initialize and make visible the app element
		new Board(questions).render();
    document.getElementById("app").style.display = "block";
  });
}

// Make it public available to be able to call it onload event of the google api script
window.handleClientLoad = handleClientLoad;
