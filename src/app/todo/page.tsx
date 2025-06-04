"use client";
import useSWR from "swr";
import TodoList from "@/components/TodoList";
import { Todo, User } from "@/lib/types";
import { fetchTodos, fetchUsers } from "@/lib/fetchData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, LoaderPinwheel } from "lucide-react";

const TodoPage = () => {
  const { data: todos, error: todosError } = useSWR<Todo[]>(
    "todos",
    fetchTodos
  );
  const { data: users, error: usersError } = useSWR<User[]>(
    "users",
    fetchUsers
  );
  // ----- alert for error handling
  if (todosError || usersError) {
    return (
      <div>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error, please try again.</AlertTitle>
          <AlertDescription>
            {todosError?.message || usersError?.message || "An error occurred"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  // ------- spinner for loading while fetching data
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

  return (
    <div>
      <p>todo page</p>
      <TodoList todos={todosByUserId} />
    </div>
  );
};

export default TodoPage;