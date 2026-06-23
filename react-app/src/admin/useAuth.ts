import { createContext, useContext } from "react";

export type AuthValue = {
  email: string | null;
  loading: boolean;
  setEmail: (email: string | null) => void;
};

export const AuthContext = createContext<AuthValue>({
  email: null,
  loading: true,
  setEmail: () => {},
});

export const useAuth = () => useContext(AuthContext);
