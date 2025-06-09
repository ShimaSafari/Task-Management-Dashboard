import type { Metadata } from "next";
import TodoContent from "@/components/TodoContent";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Task Management Dashboard",
  description:
    "Organize and track your daily tasks efficiently with our modern task management system.",
  keywords: ["tasks", "todo", "productivity", "management", "dashboard"],
};
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <main className="flex-1">
          <div className="container mx-auto p-4 lg:p-8">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }
            >
              <TodoContent />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
