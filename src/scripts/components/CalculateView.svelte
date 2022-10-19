<script context="module">
	import dayjs from 'dayjs';
	import { getWordAfterNum } from '../common/utils.js';

	const DOUBLE_PRICE = 1200;
	const DURATION = 3000000;
	const MS_IN_MIN = 60000;
	const PRICE = 700;

	const ROUTES = [
		['forward', 'из A в B'],
		['return', 'из B в A'],
		['both', 'из A в B и обратно в А']
	];
</script>

<script>
	export let returnTimes = [],
		times = [];

	let computedReturnTimes = returnTimes.slice(),
		durationTime = DURATION,
		price = PRICE,
		quantity = 0,
		[returnTime] = returnTimes,
		route = 'forward',
		showOutput = false,
		[time] = times;

	const hideOutput = () => {
		showOutput = false;
	};

	const filterReturnTimes = () =>
		returnTimes.slice().filter((item) => item > time + DURATION);

	const modifyReturnTimes = () => {
		hideOutput();

		computedReturnTimes =
			route === 'both' ? filterReturnTimes() : returnTimes.slice();

		if (route !== 'botn' || !computedReturnTimes.includes(returnTime)) {
			[returnTime] = computedReturnTimes;
		}
	};

	const findRoute = () => {
		const [, result] = ROUTES.find(([item]) => route === item);
		return result;
	};

	const calculate = () => {
		durationTime = route === 'both' ? returnTime - time || DURATION : DURATION;
		price = (durationTime > DURATION ? DOUBLE_PRICE : PRICE) * quantity;
		showOutput = true;
	};
</script>

<form class="form" on:submit|preventDefault={calculate}>
	<p class="form__group">
		<label class="form__label" for="route">Выберите направление:</label>
		<select
			class="form__field"
			id="route"
			name="route"
			bind:value={route}
			on:change={modifyReturnTimes}
		>
			{#each ROUTES as [value, text]}
				<option {value}>{text}</option>
			{/each}
		</select>
	</p>

	{#if route !== 'return'}
		<p class="form__group">
			<label class="form__label" for="route">Выберите время из А в B:</label>
			<select
				class="form__field"
				id="route"
				name="route"
				bind:value={time}
				on:change={modifyReturnTimes}
			>
				{#each times as value}
					<option {value}>{dayjs(value).format('HH:mm')}</option>
				{/each}
			</select>
		</p>
	{/if}

	{#if route !== 'forward'}
		<p class="form__group">
			{#if computedReturnTimes.length}
				<label class="form__label" for="route">Выберите время из B в А:</label>
				<select
					class="form__field"
					id="route"
					name="route"
					bind:value={returnTime}
					on:change={hideOutput}
				>
					{#each computedReturnTimes as value}
						<option {value}>{dayjs(value).format('HH:mm')}</option>
					{/each}
				</select>
			{:else}
				<p class="form__status">
					Обратных маршрутов после времени прибытия нет
				</p>
			{/if}
		</p>
	{/if}

	<p class="form__group">
		<label class="form__label" for="num">Количество билетов:</label>
		<input
			class="form__field"
			id="num"
			name="quantity"
			type="number"
			bind:value={quantity}
			on:change={hideOutput}
		/>
	</p>

	<button class="form__submit" type="submit">Посчитать</button>

	{#if showOutput}
		<p class="form__status">
			Вы выбрали {quantity}
			{getWordAfterNum(quantity, ['билет', 'билета', 'билетов'])} по маршруту {findRoute()}
			стоимостью {price}р.
		</p>
		<p class="form__status">
			Это путешествие займет у вас {durationTime / MS_IN_MIN} минут.
		</p>
		<p class="form__status">
			Теплоход отправляется в {dayjs(
				route === 'return' ? returnTime : time
			).format('HH:mm')}, а прибудет в {dayjs(
				(route === 'forward' ? time : returnTime) + DURATION
			).format('HH:mm')}.
		</p>
	{/if}
</form>
