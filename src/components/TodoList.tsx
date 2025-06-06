"use client";
import { Todo, User } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodoContext } from "@/lib/TodoContext";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SquarePen, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TodoListType {
  todos: Todo[];
  users: User[];
}

const TodoList = ({ todos, users }: TodoListType) => {
  const { updateTodo, deleteTodo } = useTodoContext();
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editCompleted, setEditCompleted] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);

  // ------ updating task
  const handleEditTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditTitle(e.target.value);
    },
    []
  );

  const openEditDialog = (todo: Todo) => {
    setEditTodo(todo);
    setEditTitle(todo.title);
    setEditCompleted(todo.completed);
    setUserId(todo.userId || null);
  };

  const closeEditDialog = () => {
    setEditTodo(null);
    setEditTitle("");
    setEditCompleted(false);
    setUserId(null);
  };

  const confirmEdit = () => {
    if (editTodo && editTitle.trim()) {
      if (
        editTitle !== editTodo.title ||
        editCompleted !== editTodo.completed ||
        userId !== editTodo.userId
      ) {
        updateTodo(editTodo.id, {
          title: editTitle,
          completed: editCompleted,
          userId: userId || editTodo.userId || 1,
        });
      }
      setEditTodo(null);
      setEditTitle("");
      setEditCompleted(false);
      setUserId(null);
    }
  };
  const hasChanges =
    editTodo &&
    (editTitle.trim() !== editTodo.title ||
      editCompleted !== editTodo.completed ||
      userId !== editTodo.userId);

  // -------- deleting task
  const openDeleteDialog = (id: number) => setDeleteId(id);
  const closeDeleteDialog = () => setDeleteId(null);

  const confirmDelete = () => {
    if (deleteId !== null) {
      deleteTodo(deleteId);
      setDeleteId(null);
    }
  };
  return (
    <div>
      <h1>To do list</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 mb-2">
            <Checkbox checked={todo.completed} />
            <p className={todo.completed ? "line-through text-gray-500" : ""}>
              {todo.title}
            </p>

            <p className="text-gray-500">{todo.user?.name}</p>
            <Button
              size="icon"
              className="size-8"
              variant="secondary"
              onClick={() => openEditDialog(todo)}
            >
              <SquarePen />
            </Button>
            <Button
              size="icon"
              className="size-8"
              variant="secondary"
              onClick={() => openDeleteDialog(todo.id)}
            >
              <Trash2 />
            </Button>
          </li>
        ))}
      </ul>
      <Dialog open={editTodo !== null} onOpenChange={closeEditDialog}>
        <DialogContent data-animation="none">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              You can change the title, completion status, or user of this task.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={editTitle}
            onChange={handleEditTitleChange}
            className="mb-2"
          />
          <div className="flex items-center gap-2 mb-2">
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
            <Checkbox
              checked={editCompleted}
              onCheckedChange={(checked) => setEditCompleted(Boolean(checked))}
            />
            <span>Completed</span>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={confirmEdit} disabled={!hasChanges}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={closeDeleteDialog}>
        <DialogContent data-animation="none">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <p>
            Are you sure you want to delete "
            {todos.find((t) => t.id === deleteId)?.title}"?
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">No</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoList;
