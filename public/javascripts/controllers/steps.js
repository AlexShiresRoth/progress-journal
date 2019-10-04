import axios from 'axios';

//TODO setup axios request to backend to edit goal steps and save to db
export default class SaveStep {
	constructor(stepQuery) {
		this.stepQuery = stepQuery;
	}
	sendQuery() {
		console.log(this.stepQuery);
	}
}
