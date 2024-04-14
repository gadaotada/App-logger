export type Project = {
    id: number;
    name: string;
    description: string;
    github: string;
    image: string;
    enabled: boolean;
    created_at?: string;
    updated_at?: string;
    apiKey?: string;
};

export type ErrorLog = {
    type: "Critical" | "General" | "Warning" | "Other";
    code: number;
    message: string;
    timestamp: string;
    location: string;
}

export type PrLog = {
    logs: {
        id: number;
        project_id: number;
        type: "Critical" | "General" | "Warning" | "Other";
        code: number;
        message: string;
        timestamp: string;
        location: string;
    }[];
    projectName: string;
}