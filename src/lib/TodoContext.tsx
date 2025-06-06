"use client";
import { createContext, useContext, useState, useEffect } from "react";
import useSWR from "swr";
import { Todo } from "@/lib/types";
import { fetchTodos } from "@/lib/fetchData";

interface TodoContextType {
  todos: Todo[];
  addTodo: (newTodo: Todo) => void;
  updateTodo: (id: number, updatedTodo: Partial<Todo>) => void;
  deleteTodo: (id: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: initialTodos } = useSWR<Todo[]>("todos", fetchTodos);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (initialTodos) {
      //   console.log("Initial Todos:", initialTodos);
      setTodos(initialTodos);
    }
  }, [initialTodos]);

  // ----- Adding a new task
  const addTodo = (newTodo: Todo) => {
    // console.log("Adding Todo:", newTodo);
    setTodos([newTodo, ...todos]);
  };

  // ------- Update a task
  const updateTodo = async (id: number, updatedTodo: Partial<Todo>) => {
    if (id > 200) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, ...updatedTodo } : todo
        )
      );
      return;
    }
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
        throw new Error("Failed to updateing todo");
      }
      const updated: Todo = await resPut.json();

      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, ...updated } : todo))
      );
      // console.log("updated todo :", updated);
    } catch (error) {
      console.error("Error updating todo", error);
    }
  };
  // ----------- Delete a task
  const deleteTodo = async (id: number) => {
    if (id > 200) {
      setTodos(todos.filter((todo) => todo.id !== id));
      return;
    }
    try {
      const resDel = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!resDel.ok) {
        throw new Error("Failed to delete todo");
      }
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo: ", error);
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
