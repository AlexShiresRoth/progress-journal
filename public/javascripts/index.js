import { newPostClosure, addStepClosure, addStepsDashboardClosure } from './views/view';
import { landingClosure } from './views/landingView';
import DaySearch from './controllers/days';
import { selectors } from './models/selectors';

const funcOne = newPostClosure();
const countCharacters = funcOne[0];
const newSearch = new DaySearch();

const funcTwo = addStepClosure();
const addStep = funcTwo[0];

const funcThree = addStepsDashboardClosure();
const addStepDash = funcThree[0];

const landing = landingClosure();
const handleScroll = landing[0];
const handleResize = landing[1];
const addBackBtn = landing[2];

const loadFile = () => {
	window.addEventListener('resize', handleResize);

	handleScroll();

	countCharacters();

	newSearch.searchDays();

	addStep();

	addStepDash();
};

if (document.readyState == 'loading') {
	document.addEventListener('DOMContentLoaded', loadFile);
} else {
	loadFile();
}

window.addEventListener('beforeunload', e => {
	window.scrollTo({
		top: 0,
	});
});

window.addEventListener('scroll', () => {
	let observer = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) {
					addBackBtn();
				}
				if (entry.isIntersecting) {
					if (selectors.backContainer) selectors.backContainer.innerHTML = '';
				}
			});
		},
		{
			rootMargin: '0px',
			threshold: 0.8,
		}
	);
	if (selectors.target) observer.observe(selectors.target);
});
