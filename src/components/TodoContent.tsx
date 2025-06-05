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
import { AlertCircleIcon, LoaderPinwheel } from "lucide-react";

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

  if (usersError) {
    return (
      <div>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error, please try again.</AlertTitle>
          <AlertDescription>
            {usersError?.message || "An error occurred"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!users || !todos) {
    return (
      <div className="flex flex-col justify-center items-center">
        <LoaderPinwheel className="w-6 h-6 animate-spin" />
        <p>Loading</p>
      </div>
    );
  }

  // -------- join two api by UserId
  const todosByUserId = todos.map((td) => ({
    ...td,
    user: users.find((user) => user.id === td.userId),
  }));

  // --------- apply filters
  const filteredTodos = todosByUserId.filter((todo) => {
    const applyCompleted =
      filter.completed === null || todo.completed === filter.completed;
    const applyUsersname =
      filter.userIds.length === 0 || filter.userIds.includes(todo.userId);
    return applyCompleted && applyUsersname;
  });
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <TodoForm users={users} />
      <TodoFilter users={users} onChangeFilter={setFilter} />
      <TodoList todos={filteredTodos} />
    </div>
  );
};

export default TodoContent;
