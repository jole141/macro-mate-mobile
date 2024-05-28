import { ingredient } from '../../constants/endpoints';
import { Ingredient } from '../types';

export async function searchIngredient(search: string): Promise<Ingredient[]> {
  const response = await fetch(`${ingredient.search}?search=${search}`, {
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
