"use client";
import { createContext, useContext, useState, useEffect } from "react";
import useSWR from "swr";
import { Todo } from "@/lib/types";
import { fetchTodos } from "@/lib/fetchData";

interface TodoContextType {
  todos: Todo[];
  addTodo: (newTodo: Todo) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: initialTodos } = useSWR<Todo[]>("todos", fetchTodos);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (initialTodos) {
      console.log("Initial Todos:", initialTodos);
      setTodos(initialTodos);
    }
  }, [initialTodos]);

  const addTodo = (newTodo: Todo) => {
    console.log("Adding Todo:", newTodo);
    setTodos([newTodo, ...todos]);
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo }}>
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
