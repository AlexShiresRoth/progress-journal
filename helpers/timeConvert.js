exports.timeConvert = time => {
	const splitTime = time.split(':');
	const toTwelveHour = 12 - splitTime[0];
	return splitTime[0] > 12 ? `${[-toTwelveHour, ':', splitTime[1]].join('')}PM` : `${time}AM`;
};

module.exports = exports;
