import { error, json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

export async function GET({ url }) {
	const problem_id = url.searchParams.get('problem_id') ?? '';

	if (problem_id) {
		let {
			data,
			status,
			statusText,
			error: e
		} = await supabase
			.from('vodb_problems')
			.select(
				`
					id,
					slug,
					common_title,
					vodb_sources (
						edition,
						vodb_collections (
							common_title,
							vodb_organizations (
								common_title
							)
						)
					),
					content,
					duplicate,
					original,
					answer,
					metadata,
					created_at
				`
			)
			.eq('id', problem_id)
			.order('slug')
			.limit(1);

		if (e) {
			error(status, statusText);
		}

		const problem = data?.map(({id, slug, common_title, vodb_sources, content, duplicate, original, answer, metadata, created_at })=> {
			const source = vodb_sources as any;

			return {
				id,
				slug, 
				common_title,
				source:  source.vodb_collections.common_title + ' ' + source.edition,
				edition: source.edition,
				collection: source.vodb_collections.common_title,
				organization: source.vodb_collections.vodb_organizations.common_title,
				content,
				duplicate,
				original, 
				answer,
				metadata, 
				created_at
			};
		});

		if (!problem?.[0]){
			error(400, 'No such problem');
		}

		return json(problem[0]);
	}

	let {
		data,
		status,
		statusText,
		error: e
	} = await supabase
		.from('vodb_problems')
		.select(
			`
				id,
				slug,
				common_title,
				vodb_sources (
					edition,
					vodb_collections (
						common_title
					)
				),
				metadata->tags,
				metadata->difficulty,
				metadata->source_href
			`
		)
		.order('slug');

	if (e) {
		error(status, statusText);
	}

	const problems = data?.map(({ id, slug, common_title, vodb_sources, tags, difficulty, source_href }) => {
		const source = vodb_sources as any;

		return {
			id,
			slug,
			common_title,
			source: source.vodb_collections.common_title + ' ' + source.edition,
			collection: source.vodb_collections.common_title,
			metadata: {
				tags,
				difficulty,
				source_href
			}
		};
	});

	problems?.sort((a, b) => collator.compare(b.common_title, a.common_title));

	return json(problems);
}
