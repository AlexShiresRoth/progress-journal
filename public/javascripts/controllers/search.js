import axios from 'axios';
import { selectors } from '../models/selectors';

export default class SearchQuery {
	constructor(query) {
		this.query = query;
	}
	async formSubmit() {
		const searchTerm = this.query;
		console.log(searchTerm);
		try {
			if (searchTerm) {
				await axios.get(`/api/search?searchTerm=${searchTerm}`);
			}
		} catch (error) {
			console.log(error.message);
			throw error;
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
