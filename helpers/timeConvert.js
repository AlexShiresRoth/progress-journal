exports.timeConvert = time => {
	//fix when time is "12:00" to not be 0
	//dry up this algo
	const splitTime = time.split(':');
	const toNums = splitTime.map(num => parseInt(num));
	const toTwelveHour = -(12 - toNums[0]);
	if (toNums[0] > 12) {
		return `${[toTwelveHour, ':', splitTime[1]].join('')}PM`;
	} else if (toNums[0] === 12) {
		return `${time}PM`;
	} else if (toNums[0] < 1) {
		return `${[12, ':', splitTime[1]].join('')}AM`;
	}
	return `${time}AM`;
};

module.exports = exports;
