import { selectors } from '../models/selectors';
import { addStepMarkup, addStepDashMarkup } from '../models/markup';

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
