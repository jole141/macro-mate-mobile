import { LoginRequest, LoginResponse, RegisterRequest } from '../types';
import { authentication } from '../../constants/endpoints';

export async function registerUser(req: RegisterRequest, role: string): Promise<void> {
  const response = await fetch(`${authentication.register}?role=${role}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });
  if (!response.ok) {
    throw new Error();
  }
}

export async function loginUser(req: LoginRequest): Promise<LoginResponse> {
  const formData = new FormData();
  formData.append('username', req.username);
  formData.append('password', req.password);
  const response = await fetch(authentication.login, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error();
  }
  return response.json();
}

export async function refreshTokens(token: string): Promise<LoginResponse> {
  const response = await fetch(authentication.refreshToken, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
