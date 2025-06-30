"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, CheckCircle, Circle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAuth as useContextAuth } from "@/context/useAuth";
import { useRouter } from "next/navigation";

interface TodoHeaderProps {
  incompleteTodos: number;
  totalTodos: number;
}

export function TodoHeader({ incompleteTodos, totalTodos }: TodoHeaderProps) {
  const { user, signOut } = useAuth();
  const { setUser } = useContextAuth();

  const router = useRouter();

  const handleSignOut = () => {
    try {
      signOut();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Todos
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Welcome, {user?.email?.split("@")[0]}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Circle className="h-3 w-3 text-blue-500" />
            {incompleteTodos}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            {totalTodos - incompleteTodos}
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-gray-500 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
