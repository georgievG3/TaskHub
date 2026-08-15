export type TaskStatus = "todo" | "in_progress" | "completed";

export interface Task {
    id: number;
    title: string;
    description: string;
    due_date: string | null;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
}