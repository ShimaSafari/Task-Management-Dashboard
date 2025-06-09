"use client";
import { useState } from "react";
import useSWR from "swr";
import { fetchUsers } from "@/lib/fetchData";
import { User } from "@/lib/types";
import TodoList from "@/components/TodoList";
import TodoForm from "@/components/TodoForm";
import TodoFilter from "@/components/TodoFilter";
import { useTodoContext } from "@/lib/TodoContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { motion } from "motion/react";

const TodoContent = () => {
  const { data: users, error: usersError } = useSWR<User[]>(
    "users",
    fetchUsers
  );
  const { todos } = useTodoContext();
  const [filter, setFilter] = useState<{
    completed: boolean | null;
    userIds: number[];
  }>({
    completed: null,
    userIds: [],
  });
  const [searchQuery, setSearchQuery] = useState("");

  if (usersError) {
    return (
      <div>
        <Alert variant="destructive" className="border border-destructive">
          <AlertCircleIcon />
          <AlertTitle>Error loading users</AlertTitle>
          <AlertDescription>
            {usersError?.message ||
              "We couldn't fetch the user data. Please check your connection and try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!users || !todos) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </motion.div>
      </div>
    );
  }

  // -------- join two api by UserId
  const todosByUserId = todos.map((td) => ({
    ...td,
    user: users.find((user) => user.id === td.userId),
  }));

  // --------- apply filters and search
  const filteredTodos = todosByUserId.filter((todo) => {
    const applyCompleted =
      filter.completed === null || todo.completed === filter.completed;
    const applyUsers =
      filter.userIds.length === 0 || filter.userIds.includes(todo.userId);
    const applySearch =
      searchQuery === "" ||
      todo.title.toLowerCase().includes(searchQuery.toLowerCase());
    return applyCompleted && applyUsers && applySearch;
  });

  const completedCount = todosByUserId.filter((t) => t.completed).length;
  const inProgressCount = todosByUserId.filter((t) => !t.completed).length;
  return (
    <div className="container max-w-7xl mx-auto space-y-6">
      {/* ---------- Stats Cards ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/10 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">
              {todosByUserId.length}
            </div>
            <div>Total Tasks</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-400">
              {completedCount}
            </div>
            <div>Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-400">
              {inProgressCount}
            </div>
            <div>InComplete</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">
              {users.length}
            </div>
            <div>Active Users</div>
          </CardContent>
        </Card>
      </div>
      {/* ---------- Header Section ----------*/}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">
            Manage your daily tasks efficiently
          </p>
        </div>
        <TodoForm users={users} />
      </div>

      {/* ---------- Search and Filter Section -------- */}
      <Card className="backdrop-blur-sm shadow-none">
        <CardContent className="px-6 py-2">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-between">
        
              <Input
                placeholder="Search tasks title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-auto md:w-1/2 text-sm"
              />

              {/* -------- Filter Component --------- */}
              <div className="">
                <TodoFilter users={users} onChangeFilter={setFilter} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div>
        {/* -------- Todo List Component --------- */}
        <TodoList todos={filteredTodos} users={users} />
      </div>
    </div>
  );
};

export default TodoContent;
