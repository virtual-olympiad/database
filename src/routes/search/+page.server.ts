const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

export async function load({ fetch }) {
	const response = await fetch('api');

	const problems: DisplayProblem[] = await response.json();

	const collectionsSet = new Set();

	problems.forEach(({ collection }) => {
		collectionsSet.add(collection);
	});

	const collections = [...collectionsSet].map((value)=> {
		let valueString = value as string;

		return {
			value: valueString,
			label: valueString
		}
	});

	collections.push({
		value: '',
		label: 'Any collection'
	});

	collections.sort((a, b) => collator.compare(b.value, a.value));

	return { 
		problems,
		collections,
		selected_problem: problems[0].id
	};
}