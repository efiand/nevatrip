export default {
	events: [
		{
			id: 1,
			times: ['12:00', '12:00', '12:00'],
			novelty: true
		},
		{
			id: 2,
			times: ['12:00', '12:00', '12:00', '12:00'],
			fullYear: true
		},
		{
			id: 3,
			times: ['12:00', '12:00', '12:00', '12:00', '12:00', '12:00']
		}
	].map((event) => ({
		...event,
		duration: '2 часа',
		features: [
			{
				text: 'Билет на целый день'
			},
			{
				text: 'Неограниченное число катаний'
			},
			{
				text: '6 остановок у главных достопримечательностей'
			},
			{
				text: 'Ближайший рейс сегодня',
				links: event.times.map((text) => ({
					text,
					url: '#!'
				}))
			}
		],
		image: `images/event-${event.id}.webp`,
		imageText: '',
		mobileImage: `images/event-${event.id}-mobile.webp`,
		onboardPrice: 1200,
		price: 900,
		title:
			'Обзорная экскурсия по рекам и каналам с&nbsp;остановками Hop on Hop Off 2020',
		url: '#!'
	})),
	lang: 'ru',
	project: 'nevatrip'
};
