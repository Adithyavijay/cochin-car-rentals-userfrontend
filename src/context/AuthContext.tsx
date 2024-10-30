// context/AuthContext.tsx
import { createContext, useContext} from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/atoms/userAtom';
import { useQuery } from '@apollo/client';
import { CHECK_AUTH } from '@/graphql/queries';
import { clearUserData } from '@/utils/clearAuth';
import { useMutation } from '@apollo/client';
import { LOGOUT_USER } from '@/graphql/mutations';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  logout: async () => {},
  checkAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useRecoilState(userAtom);
  
  // Query to check authentication status
  const { loading,refetch } = useQuery(CHECK_AUTH, {
    fetchPolicy: 'network-only', // Don't use cache for auth checks
    onCompleted: (data) => {
      if (data?.checkAuth?.isAuthenticated) {
        setUser(data.checkAuth.user);
      } else {
        setUser(null);
        clearUserData();
      }
    },
    onError: (error) => {
        toast.error(error.message)
      setUser(null);
      clearUserData();
    }
  });

  // Mutation for logout
  const [logoutMutation] = useMutation(LOGOUT_USER);

  const logout = async () => {
    try {
      await logoutMutation();
      setUser(null);
      clearUserData();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkAuth = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      clearUserData();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading: loading,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);