import React, { createContext, useContext } from 'react';
import { loginUser, refreshTokens, registerUser } from '../api/auth/auth';
import { LoginRequest, RegisterRequest } from '../api/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';

interface IAuthContext {
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
}

interface IAuthMethods {
  loginAppUser: (req: LoginRequest) => void;
  registerAppUser: (req: RegisterRequest, role: string) => void;
  logout: () => void;
  checkAccessToken: (aToken: string, rToken: string) => void;
}

export interface IAuthProvider {
  children: React.ReactNode;
}

const initialAuthData: IAuthContext = {
  accessToken: '',
  refreshToken: '',
  isLoggedIn: false,
};

interface IAuthData extends IAuthContext, IAuthMethods {}

const AuthContext = createContext(initialAuthData as IAuthData);

export const useAuthData = (): IAuthData => useContext(AuthContext);

export default function AuthProvider({ children }: IAuthProvider): React.ReactElement {
  const [accessToken, setAccessToken] = React.useState<string>(initialAuthData.accessToken);
  const [refreshToken, setRefreshToken] = React.useState<string>(initialAuthData.refreshToken);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(initialAuthData.isLoggedIn);

  const getTokensFromStorage = React.useCallback(async () => {
    setAccessToken('');
    setRefreshToken('');
    const accessTokenStorage = await AsyncStorage.getItem('access_token');
    const refreshTokenStorage = await AsyncStorage.getItem('refresh_token');
    accessTokenStorage && setAccessToken(accessTokenStorage);
    refreshTokenStorage && setRefreshToken(refreshTokenStorage);
    if (accessTokenStorage && refreshTokenStorage) {
      await checkAccessToken(accessTokenStorage, refreshTokenStorage);
    }
  }, []);

  React.useEffect(() => {
    getTokensFromStorage();
  }, [getTokensFromStorage]);

  const registerAppUser = async (req: RegisterRequest, role: string) => {
    try {
      await registerUser(req, role);
    } catch {
      throw new Error();
    }
  };

  const loginAppUser = async (req: LoginRequest) => {
    try {
      const response = await loginUser(req);
      await AsyncStorage.setItem('access_token', response.access_token);
      await AsyncStorage.setItem('refresh_token', response.refresh_token);
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      setIsLoggedIn(true);
    } catch {
      await logout();
      throw new Error();
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    setAccessToken('');
    setRefreshToken('');
    setIsLoggedIn(false);
  };

  async function checkAccessToken(aToken: string, rToken: string) {
    if (isTokenExpired(rToken)) {
      await logout();
      return;
    }

    const isJwtExpired = isTokenExpired(aToken);
    if (isJwtExpired) {
      try {
        const newTokens = await refreshTokens(rToken);
        await AsyncStorage.setItem('access_token', newTokens.access_token);
        await AsyncStorage.setItem('refresh_token', newTokens.refresh_token);
      } catch {
        await logout();
        return;
      }
    }
    setIsLoggedIn(true);
  }

  const isTokenExpired = (token: string) => {
    try {
      const jwt = JWT.decode(token, 'secret');
      return Date.now() / 1000 > jwt['exp'];
    } catch (e) {
      console.log(e);
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{ loginAppUser, registerAppUser, logout, checkAccessToken, isLoggedIn, accessToken, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}
