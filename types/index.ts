export type Category = 'work' | 'personal' | 'shopping' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: Category;
  dueDate: Date;
  createdAt: Date;
}