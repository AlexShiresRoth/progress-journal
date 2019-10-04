export const addStepMarkup = `<div class="create__form--form--row">
<div class="create__form--form--row--icon-box"><i class="fa fa-tasks"></i></div>
			<div class="create__form--form--row--column">
				<label for="goals[steps]">Add A Step</label>
				<input name="goals[steps]" type="text" placeholder="Enter step details" required />
			</div>
			<div class="create__form--form--row--icon-box-remove"><i class="fa fa-close remove-step"></i></div>
		</div>`;

export const addStepDashMarkup = `
<li class="dashboard-step-row"><button class="save-step-btn">
<i class="fa fa-check-circle save-step"></i></button>
<input class="dashboard-input" type="text" name="goals[steps]" placeholder="add a new step" />
<button class="remove-step-btn"><i class="fa fa-close remove-step"></i></<button></li>`;
