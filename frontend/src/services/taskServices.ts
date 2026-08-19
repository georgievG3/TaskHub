import apiClient from "../api/client";

export interface Task {
    id: number;
    title: string;
    description: string;
    due_date: string;
    status: "todo" | "in_progress" | "done";
    created_at: string;
    updated_at: string;
}

export async function getTasks(): Promise<Task[]> {
    const response = await apiClient.get<Task[]>("/tasks/");
    return response.data;
}

export async function createTask(task: {
    title: string;
    description: string;
    due_date: string;
    status: Task["status"];
}): Promise<Task> {
    const response = await apiClient.post<Task>("/tasks/", task);
    return response.data;
}

export async function updateTask(
    id: number,
    task: Partial<{
        title: string;
        description: string;
        due_date: string;
        status: Task["status"];
    }>
): Promise<Task> {
    const response = await apiClient.patch<Task>(`/tasks/${id}/`, task);
    return response.data;
}

export async function deleteTask(id: number): Promise<void> {
    await apiClient.delete(`/tasks/${id}/`);
}
