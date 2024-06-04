declare global {
    interface DisplayProblem {
        id: string;
        slug: string;
        common_title: string;
        source: string;
    }

    interface Problem extends DisplayProblem {
        edition: string;
        collection: string;
        organization: string;
        content: string;
        duplicate: boolean;
		original?: string;
		answer: any;
		metadata: {
            difficulty?: number;
        }
	    created_at: Date;
    }
}

export {};