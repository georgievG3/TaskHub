import { useEffect, useState } from "react";
import {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
} from "../../services/taskServices";
import type { Task } from "../../services/taskServices";

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState<Task["status"]>("todo");
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

    useEffect(() => {
        getTasks()
            .then((data) => {
                setTasks(data);
            })
            .catch((error) => {
                console.error("Failed to load tasks:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleCreateTask = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const newTask = await createTask({
                title,
                description,
                due_date: dueDate,
                status,
            });

            setTasks((currentTasks) => [...currentTasks, newTask]);

            setTitle("");
            setDescription("");
            setDueDate("");
            setStatus("todo");
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTaskId(task.id);
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.due_date);
        setStatus(task.status);
    };

    const handleSaveTask = async (event: React.FormEvent) => {
        event.preventDefault();

        if(editingTaskId === null) {
            return;
        };

        try{
            const updatedTask = await updateTask(editingTaskId, {
                title,
                description,
                due_date: dueDate,
                status,
            });

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === editingTaskId ? updatedTask : task
                )
            );

            setEditingTaskId(null);
            setTitle("");
            setDescription("");
            setDueDate("");
            setStatus("todo");
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingTaskId(null);
        setTitle("");
        setDescription("");
        setDueDate("");
        setStatus("todo");
    };

    const handleUpdateTask = async (id: number) => {
        try {
            const updatedTask = await updateTask(id, {
                status: "done",
            });

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === id ? updatedTask : task
                )
            );
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await deleteTask(id);

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== id)
            );
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <form onSubmit={editingTaskId === null ? handleCreateTask : handleSaveTask}>
                <h2>{editingTaskId === null ? "Create Task" : "Edit Task"}</h2>

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />

                <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                />

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value as Task["status"])
                    }
                >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>

                <button type="submit">
                    {editingTaskId === null ? "Create Task" : "Save Changes"}
                </button>

                {editingTaskId !== null && (
                    <button type="button" onClick={handleCancelEdit}>
                        Cancel
                    </button>
                )}
            </form>

            <h2>My Tasks</h2>

            {tasks.length === 0 ? (
                <p>You don't have any tasks yet.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <strong>{task.title}</strong>
                            {" - "}
                            {task.status}

                            <button onClick={() => handleEditTask(task)}>
                                Edit
                            </button>

                            {task.status !== "done" && (
                                <button onClick={() => handleUpdateTask(task.id)}>
                                    Mark Done
                                </button>
                            )}

                            <button onClick={() => handleDeleteTask(task.id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}