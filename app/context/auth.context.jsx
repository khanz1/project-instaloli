import { useMemo, useState, createContext, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext({
  user: {
    _id: "",
    username: "",
    name: "",
    email: "",
  },
  setUser: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: "",
    username: "",
    name: "",
    email: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const user = await SecureStore.getItemAsync("user");
      const access_token = await SecureStore.getItemAsync("access_token");
      if (access_token) {
        setIsLoggedIn(true);
      }
      if (user) {
        setUser(JSON.parse(user));
      }
    };
    checkLoggedIn();
  }, [])

  const state = useMemo(
    () => ({
      user,
      setUser,
      isLoggedIn,
      setIsLoggedIn,
    }),
    [user, isLoggedIn]
  );

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}