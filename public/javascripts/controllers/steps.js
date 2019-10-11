import axios from 'axios';

//TODO setup axios request to backend to edit goal steps and save to db
export default class SaveStep {
	constructor(stepQuery) {
		this.stepQuery = stepQuery;
	}
	async getUserId() {
		await axios({
			method: 'GET',
			url: '/profile/getuserid',
		})
			.then(res => {
				this.sendQuery(res.data.userprofile.id);
			})
			.catch(error => {
				console.log(error);
				throw error;
			});
	}
	async sendQuery(id) {
		try {
			await axios({
				method: 'PUT',
				url: `/api/goals/${id}/addstep`,
			})
				.then(res => {
					console.log(res);
				})
				.catch(err => {
					console.log(err.message);
					throw err;
				});
		} catch (error) {
			console.log(error.message);
		}
	}
}
