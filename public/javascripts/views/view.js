import { selectors } from '../models/selectors';
import { addStepMarkup, addStepDashMarkup } from '../models/markup';
import SaveStep from '../controllers/steps';

////Minimum Character check for posts
export const newPostClosure = () => {
	const countCharacters = () => {
		if (selectors.dayText !== null) {
			selectors.dayText.addEventListener('keyup', () => {
				let length = selectors.dayText.value.length;
				selectors.charCount.textContent = length;
				if (length > 199) {
					selectors.charCount.classList.remove('red');
					selectors.charCount.classList.add('green');
				} else {
					selectors.charCount.classList.remove('green');
					selectors.charCount.classList.add('red');
				}
			});
		}
	};
	return [countCharacters];
};

//Handle adding and removing steps within goals form
export const addStepClosure = () => {
	const stepsContainer = selectors.stepsContainer;

	const createRow = () => {
		if (stepsContainer.childNodes.length > 0) stepsContainer.classList.remove('hidden');

		stepsContainer.insertAdjacentHTML('beforeend', addStepMarkup);
	};
	const addStep = event => {
		if (event) {
			event.preventDefault();
			if (stepsContainer.classList.contains('hidden')) {
				stepsContainer.classList.remove('hidden');
			}
			createRow();
		}
	};

	const removeStep = event => {
		if (event) {
			stepsContainer.removeChild(event.target.parentNode.parentNode);
			if (stepsContainer.childNodes.length < 1) stepsContainer.classList.add('hidden');
		}
	};
	if (selectors.addStepBtn)
		selectors.addStepBtn.addEventListener('click', e => {
			addStep(e);
		});
	if (stepsContainer) {
		document.addEventListener('click', e => {
			if (e.target && e.target.classList.contains('remove-step')) {
				removeStep(e);
			}
		});
	}

	return [addStep, removeStep];
};

//handle adding and removing steps on the goals dashboard
//Figure out less hacky way to find closest sibling matching classname
export const addStepsDashboardClosure = () => {
	const stepsUl = selectors.stepsUl;

	const addStepDash = event => {
		if (event) {
			//need to find index of where event is occuring
			//pass to sibling of event
			const step = event.target.parentElement.nextSibling.nextSibling;
			if (step.classList.contains('steps-ul')) {
				step.classList.remove('hidden');
				step.insertAdjacentHTML('beforeend', addStepDashMarkup);
			}
		}
	};
	const removeStepDash = event => {
		const rowToBeRemoved = document.querySelector('.dashboard-step-row');
		if (event) {
			const stepToBeRemoved = event.target.parentNode.parentNode;
			stepToBeRemoved.remove(rowToBeRemoved);
		}
	};

	const saveStepQuery = event => {
		if (event) {
			const inputVal = event.target.parentElement.nextSibling.nextSibling.value;
			event.preventDefault();
			const newQuery = new SaveStep(inputVal);
			newQuery.getUserId();
		}
	};

	if (stepsUl) {
		document.addEventListener('click', e => {
			if (e.target && e.target.classList.contains('add-step-dash')) {
				addStepDash(e);
			}
		});
	}
	if (stepsUl) {
		document.addEventListener('click', e => {
			if (e.target && e.target.classList.contains('remove-step')) {
				removeStepDash(e);
			}
		});
	}
	if (stepsUl) {
		document.addEventListener('click', e => {
			if (e.target && e.target.classList.contains('save-step')) {
				saveStepQuery(e);
			}
		});
	}

	return [addStepDash];
};
