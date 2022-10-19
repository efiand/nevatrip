import commonData from './common/index.js';
import dayjs from 'dayjs';

const getTimestamp = (time) => dayjs(time).valueOf();

const returnTimes = [
	'2021-08-21 18:00:00',
	'2021-08-21 18:30:00',
	'2021-08-21 18:45:00',
	'2021-08-21 19:00:00',
	'2021-08-21 19:15:00',
	'2021-08-21 21:00:00'
].map(getTimestamp);
const times = [
	'2021-08-21 18:30:00',
	'2021-08-21 18:45:00',
	'2021-08-21 19:00:00',
	'2021-08-21 19:15:00',
	'2021-08-21 19:35:00',
	'2021-08-21 21:50:00',
	'2021-08-21 21:55:00'
].map(getTimestamp);

export default {
	...commonData,
	times: JSON.stringify({ returnTimes, times })
};
