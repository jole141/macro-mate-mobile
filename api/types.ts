export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  weight?: number;
  height?: number;
  description?: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

type Role = {
  id: number;
  name: string;
};

export type Ingredient = {
  id: number;
  name: string;
};

export type MealType = {
  id: number;
  name: string;
};

export type Review = {
  rating: number;
};

export type MealIngredient = {
  id: number;
  quantity: string;
  name: string;
};

export type MealResponse = {
  id: number;
  name: string;
  mealPlanId: number;
  description: string;
  preparationTime: string;
  mealType: string;
  mealDateTime: Date;
  ingredients: MealIngredient[];
};

export type MealRequest = {
  id?: number;
  name: string;
  description: string;
  preparationTime: string;
  mealType: string;
  mealPlanId?: number;
  mealDateTime: string;
  ingredients: MealIngredient[];
};

export type UserInfoResponse = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  weight: number;
  height: number;
  bmi: number;
  rating: number;
  description: string;
  role: Role;
  personalTrainer: UserInfoResponse;
};
