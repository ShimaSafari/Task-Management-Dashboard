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
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

interface TodoFormType {
  users: User[];
}

const TodoForm = ({ users }: TodoFormType) => {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const { addTodo } = useTodoContext();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // ------updates the title input
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || userId === null) return;
    setIsLoading(true);
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
      // console.log("Created Todo:", uniqueTodo);
      addTodo(uniqueTodo);

      setTitle("");
      setUserId(null);
      setOpen(false);
      toast.success("Task created successfully!");
    } catch (error) {
      console.error("Error creating todo:", error);
      toast.error("Error creating todo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="max-w-full">
        <Button className="w-full sm:w-auto gap-4 flex self-end">
          Add Task
          <Plus className="h-4 w-4" />
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
          <Label htmlFor="title" className="text-gray-500">
            Write Your Title
          </Label>
          <Input
            placeholder="e.g. Reading my new book"
            value={title}
            onChange={handleTitleChange}
          />
          <Label htmlFor="title" className="text-gray-500">
            Select Your User
          </Label>
          <Select
            value={userId !== null ? String(userId) : ""}
            onValueChange={(value) => setUserId(value ? Number(value) : null)}
          >
            <SelectTrigger className="w-48">
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

          <DialogFooter className="mt-6">
            <Button
              className="w-full"
              type="submit"
              disabled={!title.trim() || userId === null || isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Add a Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoForm;
