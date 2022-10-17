import loadPP from 'pineglade-pp';

const Breakpoint = {
	DESKTOP: 1104,
	MOBILE: 375
};

const checkModPressed = (evt) =>
	evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey;

window.pinegladePP = {
	breakpoints: Object.values(Breakpoint),
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
