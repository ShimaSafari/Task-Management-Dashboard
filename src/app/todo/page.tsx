import { TodoProvider } from "@/lib/TodoContext";
import TodoContent from "@/components/TodoContent";

const TodoPage = () => {
  return (
    <TodoProvider>
      <TodoContent />
    </TodoProvider>
  );
};

export default TodoPage;
