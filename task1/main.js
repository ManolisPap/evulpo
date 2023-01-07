// alert('js loaded!')
// this is a basic structure for evaluation of a single choice exercise
// INTENTIONALLY parts of the code have been deleted.
//  It should serve as a hint towards finding a suitable solution for single choice exercise
// Written by GSoosalu ndr3svt
import Board from "./src/components/BoardUI.js";
import GoogleApiQuestionFetcher from "./src/GoogleApiQuestionFetcher.js";

function handleClientLoad(googleApi) {
  let questionFetcher = new GoogleApiQuestionFetcher(googleApi);
  questionFetcher.fetchQuestions().then((questions) => {
    
		// After loading the question we can remove the loader from the DOM
    const loaderDiv = document.getElementById("loader");
    loaderDiv.remove();

		// Show the app element
		new Board(questions);
    const appDiv = document.getElementById("app");
    appDiv.style.display = "block";
  });
}

window.handleClientLoad = handleClientLoad;
