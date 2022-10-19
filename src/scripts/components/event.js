export default (eventElement) => {
	const moreElement = eventElement.querySelector('.event__linkItem_expander');

	if (!moreElement) {
		return;
	}

	const moreButtonElement = moreElement.querySelector('.event__link');
	moreButtonElement.addEventListener('click', () => {
		moreElement.remove();
	});
};
