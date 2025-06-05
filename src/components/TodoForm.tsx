"use client";
import { useState } from "react";
import { Todo, User } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTodoContext } from "@/lib/TodoContext";

interface TodoFormType {
  users: User[];
}

const TodoForm = ({ users }: TodoFormType) => {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const { addTodo } = useTodoContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || userId === null) return;

    try {
      const newTodo: Partial<Todo> = {
        title: title.trim(),
        userId,
        completed: false,
      };
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        }
      );
      if (!response.ok) throw new Error("Failed to create todo");
      const createdTodo: Todo = await response.json();

      const uniqueTodo = {
        ...createdTodo,
        id: Date.now(),
        user: users.find((u) => u.id === userId),
      };
      console.log("id", uniqueTodo.id);

      //   console.log("Created Todo:", uniqueTodo);
      addTodo(uniqueTodo);

      setTitle("");
      setUserId(null);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
      <Input
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Select
        value={userId !== null ? String(userId) : ""}
        onValueChange={(value) => setUserId(value ? Number(value) : null)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose a user" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={String(user.id)}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={!title.trim() || userId === null}>
        Add a Task
      </Button>
    </form>
  );
};

export default TodoForm;
