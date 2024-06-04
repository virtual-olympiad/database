export async function load({ fetch }) {
	const response = await fetch('api');

	const problems: DisplayProblem[] = await response.json();

	return { 
		problems,
		selected_problem: problems[0].id
	};
}