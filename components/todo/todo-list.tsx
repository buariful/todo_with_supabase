"use client";

import { TodoItem } from "./todo-item";
import { Todo } from "@/lib/supabase";
import { Loader2, CheckCircle } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoList({
  todos,
  loading,
  onUpdate,
  onDelete,
}: TodoListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <CheckCircle className="h-12 w-12 text-gray-300 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-500">No todos yet</h3>
          <p className="text-sm text-gray-400">
            Add your first todo to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 grid grid-cols-3 gap-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
