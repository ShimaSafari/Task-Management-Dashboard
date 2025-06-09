"use client";
import { createContext, useContext, useState, useEffect } from "react";
import useSWR from "swr";
import { Todo } from "@/lib/types";
import { fetchTodos } from "@/lib/fetchData";
import { toast } from "sonner";

interface TodoContextType {
  todos: Todo[];
  addTodo: (newTodo: Todo) => void;
  updateTodo: (id: number, updatedTodo: Partial<Todo>) => void;
  deleteTodo: (id: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: initialTodos = [] } = useSWR<Todo[]>("todos", fetchTodos, {
    revalidateOnFocus: false,
  });
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (initialTodos && initialTodos.length > 0) {
      const newTodos = initialTodos.filter(
        (apiTodo) => !todos.some((t) => t.id === apiTodo.id)
      );
      setTodos((prev) => [...prev, ...newTodos]);
    }
  }, [initialTodos]);

  // ----- Adding a new task to state
  const addTodo = (newTodo: Todo) => {
    setTodos((prev) => {
      const exists = prev.find((t) => t.id === newTodo.id);
      return exists ? prev : [newTodo, ...prev];
    });
  };

  // ------- Update a task in state
  const updateTodo = async (id: number, updatedTodo: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updatedTodo } : todo))
    );
    if (id <= 200) {
      try {
        const resPut = await fetch(
          `https://jsonplaceholder.typicode.com/todos/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTodo),
          }
        );
        if (!resPut.ok) {
          throw new Error("Failed to update todo");
        }
        const updated: Todo = await resPut.json();
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? { ...todo, ...updated } : todo))
        );
      } catch (error) {
        console.error("Error updating todo", error);
        toast.error("Error updating todo, Please try again");
      }
    }
  };
  // ----------- Delete a task
  const deleteTodo = async (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    if (id <= 200) {
      try {
        const resDel = await fetch(
          `https://jsonplaceholder.typicode.com/todos/${id}`,
          { method: "DELETE" }
        );
        if (!resDel.ok) {
          throw new Error("Failed to delete todo");
        }
      } catch (error) {
        console.error("Error deleting todo: ", error);
        toast.error("Error deleting todo, Please try again");
      }
    }
  };
  return (
    <TodoContext.Provider value={{ todos, addTodo, updateTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
