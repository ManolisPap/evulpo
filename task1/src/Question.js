class Question {
	constructor(topic, id, question, answerOptions, answerIndex, score) {
    this.topic = topic;
    this.id = id;
		this.question = question;
		this.answerOptions = answerOptions;
		this.answerIndex = answerIndex;
		this.score = score;
  }

	toString() {
		return `topic: [${this.topic}], id: [${this.id}], question: [${this.question}], answerOptions: [${this.answerOptions}], answerIndex: [${this.answerIndex}], score: [${this.score}]`
	}

}

export default Question;