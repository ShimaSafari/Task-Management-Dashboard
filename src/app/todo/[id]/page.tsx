"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CircleCheckBig, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTodoContext } from "@/lib/TodoContext";
import { User } from "@/lib/types";
import { fetchUsers } from "@/lib/fetchData";
import { toast } from "sonner";

export default function TodoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { todos, updateTodo } = useTodoContext();
  const { id } = params as { id: string };
  const todoId = Number(id);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error))
      .finally(() => setLoading(false));
  }, []);

  const todo = todos.find((t) => t.id === todoId);
  const assignedUser = users.find((u) => u.id === todo?.userId);

  const handleToggleComplete = async () => {
    if (!todo) return;

    try {
      await updateTodo(todo.id, { ...todo, completed: !todo.completed });
      toast.success(
        todo.completed ? "Task marked as Incomplete" : "Task completed!"
      );
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    }
  };

  if (!todo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Task not found</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen bg-background p-4 mx-auto">
      <div className=" mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="backdrop-blur-sm border-primary/20">
            <CardHeader className="border-b border-primary/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-semibold text-foreground">
                    Task Details
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant="outline"
                      className={
                        todo.completed
                          ? "text-green-400 border-0"
                          : "text-orange-400 border-0"
                      }
                    >
                      {todo.completed ? "Completed" : "Incomplete"}
                    </Badge>
                  </div>
                </div>
                <span className="size-8">
                  {todo.completed ? (
                    <span>
                      <CircleCheckBig className="text-green-600 " />
                    </span>
                  ) : (
                    <CircleAlert className="text-muted-foreground" />
                  )}
                </span>
              </div>
            </CardHeader>
            <CardContent className="py-4 space-y-6">
              <div className="break-words max-w-full">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">
                  Title
                </h3>
                <p
                  className={`text-lg ${
                    todo.completed ? "line-through opacity-60" : ""
                  }`}
                >
                  {todo.title}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">
                  Assigned to
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary/50 to-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {assignedUser?.name.charAt(0) || todo.userId}
                  </div>
                  <span className="text-foreground">
                    {loading
                      ? "Loading..."
                      : assignedUser?.name || "Unknown User"}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">
                  Task ID
                </h3>
                <span className="font-mono text-sm bg-muted px-2 py-1 rounded text-foreground">
                  #{todo.id}
                </span>
              </div>
              <div className="flex justify-end">
                <Button
                  className=""
                  variant={todo.completed ? "outline" : "default"}
                  onClick={handleToggleComplete}
                >
                  {todo.completed ? "Mark as Incomplete" : "Mark as Complete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
