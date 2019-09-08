import { newPostClosure } from './view';
import DaySearch from './days';

const funcOne = newPostClosure();
const countCharacters = funcOne[0];
const newSearch = new DaySearch();

const loadFile = () => {
	countCharacters();
	newSearch.searchDays();
};

if (document.readyState == 'loading') {
	console.log('loading');
	document.addEventListener('DOMContentLoaded', loadFile);
} else {
	console.log('loaded');
	loadFile();
}
