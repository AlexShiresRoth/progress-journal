export const addStepMarkup = `<div class="create__form--form--row">
<div class="create__form--form--row--icon-box"><i class="fa fa-tasks"></i></div>
			<div class="create__form--form--row--column">
				<label for="goals[steps]">Add A Step</label>
				<input name="goals[steps]" type="text" placeholder="Enter step details" required />
			</div>
			<div class="create__form--form--row--icon-box-remove"><i class="fa fa-close remove-step"></i></div>
		</div>`;

export const addStepDashMarkup = `
<li class="dashboard-step-row"><form action="/api/goals/<%=goal.id%>/addstep?_method=PUT" method="POST">
<button class="completed-step-btn">
<i class="fa fa-plus-circle save-step"></i></button>
<input class="dashboard-input" type="text" name="goals[steps]" placeholder="add a new step" />
</form>
<button class="remove-step-btn"><i class="fa fa-close remove-step"></i></li>`;
