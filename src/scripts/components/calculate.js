import CalculateView from './CalculateView.svelte';

export default (target) => {
	if (!target) {
		return;
	}

	new CalculateView({
		props: window.times,
		target
	});
}
