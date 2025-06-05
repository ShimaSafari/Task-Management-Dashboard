"use client";
import { Todo } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";

interface TodoList {
  todos: Todo[];
}

const TodoList = ({ todos }: TodoList) => {
  return (
    <div>
      <h1>To do list</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex">
            <Checkbox checked={todo.completed} />
            <p className={todo.completed ? "line-through text-gray-500" : ""}>
              {todo.title}
            </p>
            <p className="text-gray-500">{todo.user?.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
