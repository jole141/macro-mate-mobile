import { Review } from '../types';
import { review } from '../../constants/endpoints';

export async function rateTrainer(rating: number, trainerId: number, accessToken: string): Promise<void> {
  const response = await fetch(`${review.rate}?rating=${rating}&trainerId=${trainerId}`, {
    method: 'POST',
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

export async function isTrainerAlreadyRated(trainerId: number, accessToken: string): Promise<Review> {
  const response = await fetch(`${review.alreadyRated}?trainerId=${trainerId}`, {
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
