export const addStepMarkup = `<div class="create__form--form--row">
<div class="create__form--form--row--icon-box"><i class="fa fa-tasks"></i></div>
			<div class="create__form--form--row--column">
				<label for="goals[steps]">Add A Step</label>
				<input name="goals[steps]" type="text" placeholder="Enter step details" required />
			</div>
			<div class="create__form--form--row--icon-box-remove remove-step"><i class="fa fa-close"></i></div>
		</div>`;

export const createMarkup = () => {
	const newFormRow = document.createElement('div');
	newFormRow.classList.add('create__form--form--row');
	const addIcon = document.createElement('div');
	addIcon.classList.add('create__form--form--row--icon-box');
	newFormRow.appendChild(addIcon);
};
