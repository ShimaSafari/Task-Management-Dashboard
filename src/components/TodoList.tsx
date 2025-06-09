"use client";
import { Todo, User } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodoContext } from "@/lib/TodoContext";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  CircleAlert,
  CircleCheckBig,
  Loader2,
  SquarePen,
  Trash2,
} from "lucide-react";
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
import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
  const [isLoading, setIsLoading] = useState(false);

  // ------ updates the title input
  const handleEditTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditTitle(e.target.value);
    },
    []
  );
  // -------- opens the edit dialog
  const openEditDialog = (todo: Todo) => {
    setEditTodo(todo);
    setEditTitle(todo.title);
    setEditCompleted(todo.completed);
    setUserId(todo.userId || null);
  };
  // ------- closes the edit dialog
  const closeEditDialog = () => {
    setEditTodo(null);
    setEditTitle("");
    setEditCompleted(false);
    setUserId(null);
  };

  // ----- updates the task in context
  const confirmEdit = () => {
    setIsLoading(true);
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
      setIsLoading(false);
      setEditTodo(null);
      setEditTitle("");
      setEditCompleted(false);
      setUserId(null);
    }
  };

  // -----checks any field changes
  const hasChanges =
    editTodo &&
    (editTitle.trim() !== editTodo.title ||
      editCompleted !== editTodo.completed ||
      userId !== editTodo.userId);

  // -------- deleting task
  const openDeleteDialog = (id: number) => setDeleteId(id);
  const closeDeleteDialog = () => setDeleteId(null);

  // --------- deletes the task in context
  const confirmDelete = () => {
    if (deleteId !== null) {
      deleteTodo(deleteId);
      setDeleteId(null);
    }
  };
  return (
    <>
      {todos.length === 0 ? (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto max-w-md">
            <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
            <p className="mt-2 text-muted-foreground">
              Get started by creating your first task.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            duration: 0.3,
          }}
        >
          {todos.map((todo) => (
            <Card
              key={todo.id}
              className="bg-white/10 backdrop-blur-sm border-white/20 transition-all duration-300 hover:bg-primary/10 hover:shadow-lg hover:scale-102 hover:border-primary/30"
            >
              <CardContent className="py-2">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <span className="size-8">
                      {todo.completed ? (
                        <CircleCheckBig className="text-primary size-5" />
                      ) : (
                        <CircleAlert className="text-muted-foreground size-5" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <Link href={`/todo/${todo.id}`}>
                        <h3
                          className={`font-semibold leading-tight break-words max-w-full ${
                            todo.completed ? "line-through opacity-60" : ""
                          }`}
                        >
                          {todo.title}
                        </h3>
                      </Link>
                    </div>
                    <Button
                      size="icon"
                      className="size-8 hover:text-primary"
                      variant="outline"
                      onClick={() => openEditDialog(todo)}
                    >
                      <SquarePen />
                    </Button>
                    <Button
                      size="icon"
                      className="size-8 hover:text-red-500"
                      variant="outline"
                      onClick={() => openDeleteDialog(todo.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary/50 to-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {todo.user?.name.charAt(0)}
                      </div>
                      <span>{todo.user?.name}</span>
                    </div>

                    <Badge
                      variant="outline"
                      className={
                        todo.completed
                          ? " text-green-400 border-0"
                          : " text-orange-400 border-0"
                      }
                    >
                      {todo.completed ? "Completed" : "Incomplete"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Dialog open={editTodo !== null} onOpenChange={closeEditDialog}>
            <DialogContent data-animation="none">
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>
                  You can change the title, completion status, or user of this
                  task.
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
                  onValueChange={(value) =>
                    setUserId(value ? Number(value) : null)
                  }
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
                  onCheckedChange={(checked) =>
                    setEditCompleted(Boolean(checked))
                  }
                />
                <span>Completed</span>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={confirmEdit} disabled={!hasChanges}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteId !== null} onOpenChange={closeDeleteDialog}>
            <DialogContent data-animation="none">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
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
        </motion.div>
      )}
    </>
  );
};

export default TodoList;
