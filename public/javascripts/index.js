import { newPostClosure, addStepClosure } from './views/view';
import DaySearch from './controllers/days';

const funcOne = newPostClosure();
const countCharacters = funcOne[0];
const newSearch = new DaySearch();

const funcTwo = addStepClosure();
const addStep = funcTwo[0];

const loadFile = () => {
	countCharacters();
	newSearch.searchDays();
	addStep();
};

if (document.readyState == 'loading') {
	console.log('loading');
	document.addEventListener('DOMContentLoaded', loadFile);
} else {
	console.log('loaded');
	loadFile();
}
