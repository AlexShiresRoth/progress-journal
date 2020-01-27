import { selectors } from '../models/selectors';

export const landingClosure = () => {
	const handleLandingScroll = () => {
		selectors.landingBtns.forEach(btn => {
			btn.addEventListener('click', e => {
				e.preventDefault();
				const signup = document.querySelector('#signup').getBoundingClientRect().top;
				const login = document.querySelector('#login').getBoundingClientRect().top;
				console.log(btn.id);
				if (btn.id === 'signup-btn' || btn.id === 'signup-alt') {
					window.scrollTo({
						top: signup,
						behavior: 'smooth',
					});
					return;
				}
				window.scrollTo({
					top: login,
					behavior: 'smooth',
				});
				return;
			});
		});
	};

	return [handleLandingScroll];
};
