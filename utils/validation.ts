import { LoginRequest, RegisterRequest } from '../api/types';
import { CLIENT_ROLE, PERSONAL_TRAINER_ROLE } from '../constants/constants';

const MAIL_REGEX =
  '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';

export const loginValidation = (req: LoginRequest) => {
  if (req.password === '' || req.username === '') {
    return 'Input field cannot be empty!';
  }
  return '';
};

export const registerValidation = (req: RegisterRequest, role: string) => {
  if (req.firstName === '' || req.lastName === '' || req.email === '' || req.username === '' || req.password === '') {
    return 'Input field cannot be empty!';
  }
  if (!req.email.match(MAIL_REGEX)) {
    return 'Invalid email!';
  }
  if (req.password.length < 6) {
    return 'Password must be at least 6 letters long!';
  }
  if (role === PERSONAL_TRAINER_ROLE && (!req.description || req.description.length < 20)) {
    return 'Description must be at least 20 letters long!';
  }
  if (role === CLIENT_ROLE && (!req.weight || !req.height)) {
    return 'Height or Weight field is empty?';
  }
  if (role === CLIENT_ROLE && req.weight && req.height) {
    let weight = 0;
    let height = 0;
    try {
      weight = parseInt(req.weight, 10);
      height = parseInt(req.height, 10);
    } catch {
      return 'Height and Weight input value must be number?';
    }
    if (weight > 500 || height > 250) {
      return 'Height or Weight input value is too large?';
    }
  }
  return '';
};
