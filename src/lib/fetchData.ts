import { User, Todo } from "./types";

export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!res.ok) {
      throw new Error(`Failed to get todos data : ${res.status}`);
    }
    return res.json();
  } catch (error) {
    if (error instanceof Error)
      console.error("Error in todo fetch", error.message);

    throw new Error("Error while receive todo list. please try again later.");
  }
};
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!res.ok) {
      throw new Error(`Failed to get users data : ${res.status}`);
    }
    return res.json();
  } catch (error) {
    if (error instanceof Error)
      console.error("Error in users fetch", error.message);

    throw new Error("Error while receive users list. please try again later.");
  }
};
