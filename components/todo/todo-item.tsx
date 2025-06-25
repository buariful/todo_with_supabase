'use client';

import { useState } from 'react';
import { Todo } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Edit2, Check, X, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      await onUpdate(todo.id, { is_complete: !todo.is_complete });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    
    setLoading(true);
    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(todo.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md border-l-4",
      todo.is_complete 
        ? "border-l-green-400 bg-green-50/30" 
        : "border-l-blue-400 bg-white hover:bg-blue-50/30"
    )}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Todo title..."
              disabled={loading}
              className="font-medium"
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Add a description..."
              disabled={loading}
              rows={2}
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleSaveEdit}
                disabled={loading || !editTitle.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={todo.is_complete}
                onCheckedChange={handleToggleComplete}
                disabled={loading}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-medium leading-tight break-words",
                  todo.is_complete && "line-through text-gray-500"
                )}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={cn(
                    "text-sm text-gray-600 mt-1 break-words",
                    todo.is_complete && "line-through text-gray-400"
                  )}>
                    {todo.description}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(todo.created_at), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="h-8 px-2 text-gray-500 hover:text-gray-700"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={loading}
                className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}