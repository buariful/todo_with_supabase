import { useEffect, useState } from 'react';
import { supabase, Todo } from '@/lib/supabase';
import { useAuth } from './use-auth';

export function useTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (title: string, description?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert({
          user_id: user.id,
          title,
          description: description || '',
        })
        .select()
        .single();

      if (error) throw error;
      setTodos(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTodos(prev => prev.map(todo => todo.id === id ? data : todo));
      return data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [user]);

  const incompleteTodos = todos.filter(todo => !todo.is_complete);

  return {
    todos,
    loading,
    createTodo,
    updateTodo,
    deleteTodo,
    incompleteTodos: incompleteTodos.length,
  };
}