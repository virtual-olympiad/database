import type { CalendarDate } from "@internationalized/date";

declare global {
    interface DisplayProblem {
        id: string;
        slug: string;
        title: string;
        common_title: string;
        source: string;
        date: string;
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
        ids?: string[] | null;
		minDifficulty: number;
		maxDifficulty: number;
        minDate?: CalendarDate | undefined;
        maxDate?: CalendarDate | undefined;
		collection: string;
	}
}

export {};