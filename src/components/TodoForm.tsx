"use client";
import { useCallback, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTodoContext } from "@/lib/TodoContext";
import { Plus } from "lucide-react";

interface TodoFormType {
  users: User[];
}

const TodoForm = ({ users }: TodoFormType) => {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const { addTodo } = useTodoContext();
  const [open, setOpen] = useState(false);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    []
  );

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
      // console.log("id", uniqueTodo.id);
      //   console.log("Created Todo:", uniqueTodo);
      addTodo(uniqueTodo);

      setTitle("");
      setUserId(null);
      setOpen(false);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent data-animation="none">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the task title and assign it to a user. Click Add when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
          <Label htmlFor="title">Task Title</Label>
          <Input
            placeholder="Task Title"
            value={title}
            onChange={handleTitleChange}
          />
          <Label htmlFor="title">Users</Label>
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
          <DialogFooter>
            <Button type="submit" disabled={!title.trim() || userId === null}>
              Add a Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoForm;
