import { selectors } from '../models/selectors';

export const landingClosure = () => {
	let signup;
	let login;

	const handleLandingScroll = () => {
		signup = document.querySelector('#signup').getBoundingClientRect().top;
		login = document.querySelector('#login').getBoundingClientRect().top;

		if (selectors.landingBtns.length <= 0) return;
		selectors.landingBtns.forEach(btn => {
			btn.addEventListener('click', e => {
				e.preventDefault();
				console.log(login, signup);
				if (btn.id === 'signup-btn' || btn.id === 'signup-alt') {
					window.scrollTo({
						top: signup,
						behavior: 'smooth',
					});
					return;
				}
				if (btn.id === 'login-btn' || btn.id === 'login-alt') {
					window.scrollTo({
						top: login,
						behavior: 'smooth',
					});
					return;
				}
			});
		});
	};

	const addBackToTopButton = () => {
		const markup = `<button id="back-btn"><i class="fa fa-arrow-up"></i> Back To Top</button>`;
		selectors.backContainer.innerHTML = markup;
	};

	document.addEventListener('click', e => {
		e.stopPropagation();
		if (e.target.id === 'back-btn' || e.target.parentNode.id === 'back-btn') {
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		}
	});

	return [handleLandingScroll, addBackToTopButton];
};
