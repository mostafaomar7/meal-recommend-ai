export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  cuisine: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

