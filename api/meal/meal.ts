import { MealRequest, MealResponse, MealType } from '../types';
import { meal } from '../../constants/endpoints';

export async function addNewMeal(newMeal: MealRequest, clientId: number, accessToken: string): Promise<void> {
  const response = await fetch(`${meal.addMeal}?clientId=${clientId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(newMeal),
  });
  if (!response.ok) {
    throw new Error();
  }
}

export async function getClientMeals(weekDate: string, accessToken: string): Promise<MealResponse[][]> {
  const response = await fetch(`${meal.getClientMeals}?weekDate=${weekDate}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error();
  }
  return response.json();
}

export async function getClientMealsDay(dayDate: string, accessToken: string): Promise<MealResponse[]> {
  const response = await fetch(`${meal.getClientMealsDay}?dayDate=${dayDate}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error();
  }
  return response.json();
}

export async function getTrainerClientMeals(
  weekDate: string,
  clientId: number,
  accessToken: string,
): Promise<MealResponse[][]> {
  const response = await fetch(`${meal.getTrainersClientMeals}?weekDate=${weekDate}&clientId=${clientId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error();
  }
  return response.json();
}

export async function getTrainerClientMealsDay(
  dayDate: string,
  clientId: number,
  accessToken: string,
): Promise<MealResponse[]> {
  const response = await fetch(`${meal.getTrainersClientMealsDay}?dayDate=${dayDate}&clientId=${clientId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error();
  }
  return response.json();
}

export async function updateMeal(newMeal: MealRequest, accessToken: string): Promise<void> {
  const response = await fetch(`${meal.updateMeal}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(newMeal),
  });
  if (!response.ok) {
    throw new Error();
  }
}

export async function deleteMeal(id: number, accessToken: string): Promise<void> {
  const response = await fetch(`${meal.deleteMeal}?id=${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error();
  }
}

export async function getAllMealTypes(): Promise<MealType[]> {
  const response = await fetch(`${meal.mealTypes}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error();
  }
  return response.json();
}
