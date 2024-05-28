export const getMondayDate = () => {
  const currentDate = new Date();
  if (currentDate.getDay() === 0) {
    currentDate.setDate(currentDate.getDate() - 6);
  } else {
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
  }
  return formatDate(currentDate);
};

const formatDate = (date: Date) => {
  const day = date.getDate() < 9 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth() < 8 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  return `${date.getFullYear()}-${month}-${day}`;
};

export const getDate = (index: number) => {
  const currentDate = new Date();
  if (currentDate.getDay() === 0) {
    currentDate.setDate(currentDate.getDate() - (7 - index) + 1);
  } else {
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1 + index);
  }
  return `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}.`;
};

export const getDateUSFormat = (index: number) => {
  const currentDate = new Date();
  if (currentDate.getDay() === 0) {
    currentDate.setDate(currentDate.getDate() - (7 - index) + 1);
  } else {
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1 + index);
  }
  const day = currentDate.getDate() < 9 ? `0${currentDate.getDate()}` : currentDate.getDate();
  const month = currentDate.getMonth() < 8 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
  return `${currentDate.getFullYear()}-${month}-${day}`;
};

export const getDateName = (index: number) => {
  switch (index) {
    case 0:
      return `Monday ${getDate(index)}`;
    case 1:
      return `Tuesday ${getDate(index)}`;
    case 2:
      return `Wednesday ${getDate(index)}`;
    case 3:
      return `Thursday ${getDate(index)}`;
    case 4:
      return `Friday ${getDate(index)}`;
    case 5:
      return `Saturday ${getDate(index)}`;
    case 6:
      return `Sunday ${getDate(index)}`;
  }
};

export const getTime = (date: Date) => {
  const currentDate = new Date(date);
  const now = new Date();
  const offset = now.getTimezoneOffset() / 60;
  currentDate.setHours(currentDate.getHours() + offset);
  const hours = currentDate.getHours() < 9 ? `0${currentDate.getHours()}` : currentDate.getHours();
  const minutes = currentDate.getMinutes() < 9 ? `0${currentDate.getMinutes()}` : currentDate.getMinutes();
  return `${hours}:${minutes}`;
};

export const getTimeWithoutOffset = (date: Date) => {
  const currentDate = new Date(date);
  const hours = currentDate.getHours() < 9 ? `0${currentDate.getHours()}` : currentDate.getHours();
  const minutes = currentDate.getMinutes() < 9 ? `0${currentDate.getMinutes()}` : currentDate.getMinutes();
  return `${hours}:${minutes}`;
};

export const getTimeFromPicker = (date: Date) => {
  const currentDate = new Date(date);
  currentDate.setHours(currentDate.getHours());
  const hours = currentDate.getHours() < 9 ? `0${currentDate.getHours()}` : currentDate.getHours();
  const minutes = currentDate.getMinutes() < 9 ? `0${currentDate.getMinutes()}` : currentDate.getMinutes();
  return `${hours}:${minutes}`;
};

export const getDateWithOffset = (date: Date) => {
  const currentDate = new Date(date);
  const now = new Date();
  const offset = now.getTimezoneOffset() / 60;
  currentDate.setHours(currentDate.getHours() + offset);
  return currentDate;
};
