import loadPP from 'pineglade-pp';

const Breakpoint = {
	DESKTOP: 1106,
	MOBILE: 375
};

const checkModPressed = (evt) =>
	evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey;

window.pinegladePP = {
	breakpoints: [Breakpoint.MOBILE, Breakpoint.DESKTOP],
	ext: 'webp',
	folder: 'images'
};

loadPP();

// Делаем редактируемым контент по нажатию E
document.addEventListener('keydown', (evt) => {
	if (evt.key.toLowerCase() === 'e' && !checkModPressed(evt)) {
		document.body.contentEditable = document.body.contentEditable !== 'true';
	}
});
