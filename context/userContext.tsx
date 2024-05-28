import React, { createContext, useContext } from 'react';
import { UserInfoResponse } from '../api/types';

interface IUserContext {
  userInfo: UserInfoResponse;
}

interface IUserMethods {
  // put user actions maybe?
  setUserInfo: (info: UserInfoResponse) => void;
}

export interface IUserProvider {
  children: React.ReactNode;
}

const initialUserData: IUserContext = {
  userInfo: {} as UserInfoResponse,
};

interface IUserData extends IUserContext, IUserMethods {}

const UserContext = createContext(initialUserData as IUserData);

export const useUserData = (): IUserData => useContext(UserContext);

export default function UserProvider({ children }: IUserProvider): React.ReactElement {
  const [userInfo, setUserInfo] = React.useState<UserInfoResponse>(initialUserData.userInfo);

  return <UserContext.Provider value={{ userInfo, setUserInfo }}>{children}</UserContext.Provider>;
}
