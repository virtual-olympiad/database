const links = {
	github: 'https://github.com/virtual-olympiad/vodb',
	voly: 'https://voly.mathetal.org',
	vodb: 'https://vodb.mathetal.org',
	voj: 'https://voj.mathetal.org',
	polarity: 'https://polarity.sh'
};

const site = {
	site_name: 'Virtual Olympiad',
	name: 'VODB ⸱ Virtual Olympiad Database',
	url: 'https://vodb.mathetal.org',
	ogImage: 'https://vodb.mathetal.org/vodb.png',
	description: 'Massive database of categorized and indexed contest problems.',
	keywords: `Virtual Olympiad,database,olympiad,problems,VO,VOLY,VOJ,VODB,math,science`
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
