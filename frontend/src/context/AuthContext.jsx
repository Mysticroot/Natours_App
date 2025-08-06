import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, settoken] = useState("");
  const [loading, setLoading] = useState(true);

  // Restore user and token from localStorage on page load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      settoken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token); // ✅ store token
    setUser(userData);
    settoken(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    settoken("");
  };


  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, token, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
