import { selectors } from '../models/selectors';
import { addStepMarkup } from '../models/markup';

////Minimum Character check for posts
export const newPostClosure = () => {
	const countCharacters = () => {
		if (selectors.dayText !== null) {
			selectors.dayText.addEventListener('keyup', () => {
				console.log('typing');
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

export const addStepClosure = () => {
	const createRow = () => {
		const stepsContainer = selectors.stepsContainer;
		if (stepsContainer.childNodes.length >= 0) {
			stepsContainer.classList.remove('hidden');
		} else {
			stepsContainer.classList.add('hidden');
		}
		stepsContainer.insertAdjacentHTML('afterbegin', addStepMarkup);
	};
	const addStep = event => {
		if (event) {
			event.preventDefault();

			createRow();
		}
	};
	if (selectors.addStepBtn)
		selectors.addStepBtn.addEventListener('click', e => {
			addStep(e);
		});

	return [addStep];
};
