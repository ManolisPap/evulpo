// import * as deepl from 'deepl-node';
const deepl = require("deepl-node");

const authKey = "0d910439-ff54-6305-7f20-36825c09f12d:fx";
const translator = new deepl.Translator(authKey);

(async () => {
  const result = await translator.translateText("Hello!", null, "fr");
  console.log(result.text); // Bonjour !
})();

// something meaningless
// abc123 -> abc123
// lptController.index.meta_description -> lptController.index.meta_description
// (async () => {
//   const result = await translator.translateText("lptController.index.meta_description", null, "fr");
//   console.log(result.text); // Bonjour !
// })();


// (async () => {
// 	const targetLang = 'fr';
// 	const results = await translator.translateText(
// 			['Hello', 'World'],
// 			null,
// 			targetLang,
// 	);
// 	/*
// 	result:
// 		[
// 			{ text: 'Bonjour', detectedSourceLang: 'en' },
// 			{ text: 'Monde', detectedSourceLang: 'en' }
// 		]
// 	*/
// 	console.log(results)
// 	results.forEach((result) => {
// 			console.log(result.text);
// 	});
// })();
