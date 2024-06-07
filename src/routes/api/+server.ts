import { error, json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { CalendarDate, parseDate } from '@internationalized/date';

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

export async function GET({ url }) {
	const problemId = url.searchParams.get('problemId') ?? '';
	const textString = url.searchParams.get('textString') ?? '';

	if (problemId) {
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
					title,
					common_title,
					vodb_sources (
						edition,
						date,
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
			.eq('id', problemId)
			.order('slug')
			.limit(1);

		if (e) {
			error(status, statusText);
		}

		const problem = data?.map(({id, slug, title, common_title, vodb_sources, content, duplicate, original, answer, metadata, created_at })=> {
			const source = vodb_sources as any;

			return {
				id,
				slug,
				title,
				common_title,
				source:  source.vodb_collections.common_title + ' ' + source.edition,
				date: source.date,
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

	if (textString){
		let {
			data,
			status,
			statusText,
			error: e
		} = await supabase
			.from('vodb_problems')
			.select(
				`
					id
				`
			)
			.textSearch('fts', textString, {
				type: 'plain',
				config: 'english'
			});
	
		if (e) {
			error(status, statusText);
		}

		return json(data);
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
				title,
				common_title,
				vodb_sources (
					edition,
					date,
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

	const problems = data?.map(({ id, slug, title, common_title, vodb_sources, tags, difficulty, source_href }) => {
		const source = vodb_sources as any;

		return {
			id,
			slug,
			title,
			common_title,
			source: source.vodb_collections.common_title + ' ' + source.edition,
			date: source.date,
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
