import type { Metadata } from "next";
import TodoContent from "@/components/TodoContent";

export const metadata: Metadata = {
  title: "Task Management Dashboard",
  description:
    "Organize and track your daily tasks efficiently with our modern task management system.",
  keywords: ["tasks", "todo", "productivity", "management", "dashboard"],
};
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <TodoContent />
    </div>
  );
}
