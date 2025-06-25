"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { TodoHeader } from "./todo-header";
import { AddTodoForm } from "./add-todo-form";
import { TodoList } from "./todo-list";
import { useTodos } from "@/hooks/use-todos";

export function TodoApp() {
  const {
    todos,
    loading,
    createTodo,
    updateTodo,
    deleteTodo,
    incompleteTodos,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0  flex flex-col">
          <div className="p-6 pb-4">
            <TodoHeader
              incompleteTodos={incompleteTodos}
              totalTodos={todos.length}
            />
            <AddTodoForm onAdd={createTodo} />
          </div>

          <ScrollArea className="flex-1 px-6 pb-6 ">
            <TodoList
              todos={todos}
              loading={loading}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
