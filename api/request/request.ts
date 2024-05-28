import { UserInfoResponse } from '../types';
import { request } from '../../constants/endpoints';

export async function getTrainersRequests(accessToken: string): Promise<UserInfoResponse[]> {
  const response = await fetch(`${request.trainersRequests}`, {
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

export async function sendRequest(trainerId: number, accessToken: string): Promise<void> {
  const response = await fetch(`${request.send}?trainerId=${trainerId}`, {
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

export async function acceptRequest(clientId: number, accessToken: string): Promise<void> {
  const response = await fetch(`${request.accept}?clientId=${clientId}`, {
    method: 'PATCH',
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

export async function declineRequest(clientId: number, accessToken: string): Promise<void> {
  const response = await fetch(`${request.decline}?clientId=${clientId}`, {
    method: 'PATCH',
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

export async function quitMembership(userId: number, accessToken: string): Promise<void> {
  const response = await fetch(`${request.quit}?userId=${userId}`, {
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
