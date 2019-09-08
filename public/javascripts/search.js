import axios from 'axios';
import { selectors } from './selectors';

export default class SearchQuery {
	constructor(query) {
		this.query = query;
	}
	async formSubmit() {
		const searchTerm = this.query;
		console.log(searchTerm)
		try {
			if (searchTerm) {
				console.log(searchTerm);
				await axios.get(`http://localhost:3000/api/search?searchTerm=${searchTerm}`);
			}
		} catch (error) {
			console.log(error.message);
		}
	}
}

if (selectors.searchQuery) {
	selectors.searchQuery.addEventListener('submit', e => {
		const query = e.target[0].value;
		if (query !== '' || query !== 'undefined') {
			const newQuery = new SearchQuery(query);
			newQuery.formSubmit();
			e.preventDefault();
		}
	});
}
