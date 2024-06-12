const links = {
	github: 'https://github.com/virtual-olympiad/database',
	voly: "https://volympiad.org",
	voa: 'https://arena.volympiad.org',
	vodb: 'https://db.volympiad.org',
	voj: 'https://judge.volympiad.org',
	polarity: 'https://polarity.sh'
};

const site = {
	site_name: 'Virtual Olympiad',
	name: 'VODB ⸱ Virtual Olympiad Database',
	url: 'https://db.volympiad.org',
	ogImage: 'https://db.volympiad.org/vodb.png',
	description: 'Massive database of categorized and indexed contest problems.',
	keywords: `Virtual Olympiad,database,olympiad,problems,VO,VOLY,VOJ,VODB,VOA,math,science`
};

const nav = [
	{
		title: 'Search',
		href: '/search'
	},
	/**{
		title: 'API',
		href: '/api'
	},**/
	{
		title: 'About',
		href: '/about'
	},
	{
		title: 'Contribute',
		href: '/contribute'
	}
];

export { links, site, nav };
