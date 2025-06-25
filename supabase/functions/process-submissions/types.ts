export type SlackMessage =
    | string
    | {
        blocks: any[];
        [key: string]: any;
    };
export interface FormSubmissionData {
    form: {
        name: string;
        spreadsheet_id: string;
    };
    submission: {
        data: Record<string, any>;
        created_at: string;
        id: string;
    };
    analytics?: {
        referrer?: string;
        country?: string;
        city?: string;
        timezone?: string;
        deviceType?: string;
        browser?: string;
        language?: string;
        processed_at?: string;
        created_at?: string;
    };
}

