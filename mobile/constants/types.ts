export interface Exercise {
  id: string;
  image: any;
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  instructions: string;
  instruction: string;
  sets: number;
  reps: number;
  difficulty: string; 
}

export interface Workout {
  id: string;
  workout_name: string;
  created_by: string;
  rating: number;
  rating_count: number;
  exercises: Exercise[];
}

export interface Food {
  id: string;
  image: any;
  name: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[]; 
  ingredientAmounts: string[]; 
  recipeUrl: string;
  ca: string; 
  cholesterol: string;
  fiber: string;
  k: string; 
  na: string;
  vitARae: string;
  vitB6: string;
  vitB12: string; 
  vitC: string;
  vitD: string;
  vitK: string;
}

export interface MealProgram {
  id: string;
  name: string;
  foods: Food[];
  rating?: string;
}
