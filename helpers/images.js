exports.getImages = () => {
	const imgArr = [
		'https://res.cloudinary.com/snackmanproductions/image/upload/v1569794093/progressjournal/jeremy-perkins-7S1yZoFcVV0-unsplash_cgpsso.jpg',
		'https://res.cloudinary.com/snackmanproductions/image/upload/v1569794048/progressjournal/prateek-katyal-FcdtuGf7TEc-unsplash_gjxpkq.jpg',
		'https://res.cloudinary.com/snackmanproductions/image/upload/v1569794024/progressjournal/manasvita-s-9q5vptiE2TY-unsplash_sbyzpt.jpg',
		'https://res.cloudinary.com/snackmanproductions/image/upload/v1569794004/progressjournal/johnson-wang-iI4sR_nkkbc-unsplash_p1rsjy.jpg',
		'https://res.cloudinary.com/snackmanproductions/image/upload/v1569794380/progressjournal/allie-smith-WLvzdarBNKc-unsplash_xfjqgy.jpg',
		'https://res.cloudinary.com/snackmanproductions/image/upload/v1567468817/progressjournal/estee-janssens-aQfhbxailCs-unsplash_iawcxc.jpg',
		'https://res.cloudinary.com/snackmanproductions/image/upload/v1569799330/progressjournal/drew-beamer-Vc1pJfvoQvY-unsplash_zltqbo.jpg',
		'https://res.cloudinary.com/snackmanproductions/image/upload/v1569799369/progressjournal/jordan-whitfield-sm3Ub_IJKQg-unsplash_uly5an.jpg',
		'https://res.cloudinary.com/snackmanproductions/image/upload/v1569890056/progressjournal/randalyn-hill-Z1HXJQ2aWIA-unsplash_phyuxn.jpg',
		'https://res.cloudinary.com/snackmanproductions/image/upload/v1569890092/progressjournal/felicia-buitenwerf-_z1fydm6azE-unsplash_bhxsp1.jpg',
	];
	return imgArr[Math.floor(Math.random() * imgArr.length)];
};

module.exports = exports;
