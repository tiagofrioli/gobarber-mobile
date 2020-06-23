import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface AuthState {
  token: string;
  user: object;
}
interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      // const { token, user } = await AsyncStorage.multiGet([
      //   '@Gobarber:token',
      //   '@GoBarber:user',
      // ]);
      const token = await AsyncStorage.getItem('@Gobarber:token');
      const user = await AsyncStorage.getItem('@GoBarber:user');

      // if (token[1] && user[1]) {
      //   setData({ token: token[1], user: user[1] });
      // }

      if (token && user) {
        setData({ token, user: JSON.parse(user) });
      }
    }
    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });
    const { token, user } = response.data;

    // await AsyncStorage.multiSet([
    //   ['@Gobarber:token', token],
    //   ['@GoBarber:user', JSON.stringify(user)],
    // ]);

    await AsyncStorage.setItem('@Gobarber:token', token);
    await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    // await AsyncStorage.multiRemove(['@Gobarber:token','@GoBarber:user'])
    await AsyncStorage.removeItem('@Gobarber:token');
    await AsyncStorage.removeItem('@GoBarber:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
