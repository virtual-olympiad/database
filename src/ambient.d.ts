declare global {
    interface DisplayProblem {
        id: string;
        slug: string;
        common_title: string;
        source: string;
        collection: string;
        metadata: {
            tags?: string[];
            difficulty?: number;
            source_href?: string;
        }
    }

    interface Problem extends DisplayProblem {
        edition: string;
        organization: string;
        content: string;
        duplicate: boolean;
		original?: string;
		answer: any;
	    created_at: Date;
    }

    type tableOtherFilters = {
		minDifficulty: number;
		maxDifficulty: number;
		collection: string;
	}
}

export {};