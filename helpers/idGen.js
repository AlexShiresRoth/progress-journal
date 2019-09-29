exports.genId = () => {
	const chars = ['a', 'b', 'c', 'd', 'e'];
	const charsCont = ['f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];
	const moreChars = ['o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z'];
	const letters = [...chars, ...charsCont, ...moreChars];
	const upperCase = letters.map(char => char.toUpperCase());
	const newLetters = [...letters, ...upperCase];
	const numArr = [];
	for (let i = 0; i < 6; i++) {
		let num = Math.floor(Math.random() * 1000);
		numArr.push(num);
	}
	const id = numArr.map(num => {
		return num + newLetters[Math.floor(Math.random() * newLetters.length)];
	});

	return id.join('');
};

module.exports = exports;
