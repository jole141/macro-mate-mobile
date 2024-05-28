import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MealResponse } from '../api/types';

export type RootStackParamList = {
  Login: undefined;
  Register: { accountType: string; description: string; height: string; weight: string };
  WelcomeScreen: undefined;
  AccountType: undefined;
  Homepage: undefined;
  Trainers: undefined;
  Clients: undefined;
  Requests: undefined;
  MealPlan: { clientId: number };
  Meals: { meals: MealResponse[]; clientId: number; date: string };
  AddMeal: { clientId: number; date: string; meal?: MealResponse };

  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;
