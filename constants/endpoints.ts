const API_URL = 'https://6448-95-168-105-18.ngrok-free.app';

export const authentication = {
  register: `${API_URL}/user/register`,
  login: `${API_URL}/login`,
  refreshToken: `${API_URL}/user/token/refresh`,
};

export const user = {
  info: `${API_URL}/user/info`,
  updateClient: `${API_URL}/user/client-info`, // @RequestParam Double height, @RequestParam Double weight
  updateTrainer: `${API_URL}/user/trainer-info`, // @RequestParam String description
  trainers: `${API_URL}/user/trainer`,
  trainersClients: `${API_URL}/user/trainers-clients`,
};

export const meal = {
  addMeal: `${API_URL}/meal`, // POST mealDto
  getClientMeals: `${API_URL}/meal/client-meals`, // @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date weekDate
  getClientMealsDay: `${API_URL}/meal/client-meals-day`,
  getTrainersClientMeals: `${API_URL}/meal/trainer-meals`, // @RequestParam Long clientId, @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date weekDate
  getTrainersClientMealsDay: `${API_URL}/meal/trainer-meals-day`,
  updateMeal: `${API_URL}/meal/update`, // @RequestBody MealDTO mealDTO
  deleteMeal: `${API_URL}/meal/delete`, // @RequestParam Long id
  mealTypes: `${API_URL}/meal/meal-types`,
};

export const request = {
  trainersRequests: `${API_URL}/request`,
  send: `${API_URL}/request/send`, // @RequestParam Long trainerId
  accept: `${API_URL}/request/accept`, // @RequestParam Long clientId
  decline: `${API_URL}/request/decline`, // @RequestParam Long clientId
  quit: `${API_URL}/request/quit`, // @RequestParam Long userId
};

export const review = {
  personalTrainerRating: `${API_URL}/review`, // @RequestParam Long trainerId
  rate: `${API_URL}/review`, // @RequestParam int rating, @RequestParam Long trainerId
  alreadyRated: `${API_URL}/review/already-rated`, // @RequestParam Long trainerId
};

export const ingredient = { search: `${API_URL}/ingredient` }; // @RequestParam String search
