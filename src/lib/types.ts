export interface User {
  id: number;
  name: string;
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  user?: User;
}