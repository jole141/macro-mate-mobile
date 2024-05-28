import { user } from '../../constants/endpoints';
import { UserInfoResponse } from '../types';

export async function getUserInfo(accessToken: string): Promise<UserInfoResponse> {
  const response = await fetch(`${user.info}`, {
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

export async function updateClientInfo(height: number, weight: number, accessToken: string): Promise<void> {
  const response = await fetch(`${user.updateClient}?height=${height}&weight=${weight}`, {
    method: 'PUT',
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

export async function updateTrainerInfo(description: string, accessToken: string): Promise<void> {
  const response = await fetch(`${user.updateTrainer}?description=${description}`, {
    method: 'PUT',
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

export async function getAllTrainers(): Promise<UserInfoResponse[]> {
  const response = await fetch(`${user.trainers}`, {
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

export async function getTrainersClients(accessToken: string): Promise<UserInfoResponse[]> {
  const response = await fetch(`${user.trainersClients}`, {
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
