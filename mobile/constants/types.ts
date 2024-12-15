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
  }
  
  export interface Workout {
    id: string;
    workout_name: string;
    created_by: string;
    rating: number;
    rating_count: number;
    exercises: Exercise[];
  }
  