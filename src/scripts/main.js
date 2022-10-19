import initCalculate from './components/calculate.js';
import initEvent from './components/event.js';

document.querySelectorAll('.event').forEach(initEvent);

initCalculate(document.querySelector('.calculate'));
