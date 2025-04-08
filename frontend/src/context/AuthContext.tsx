import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  username: string;
  setUsername: (value: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    sessionStorage.getItem("isLoggedIn") === "true"
  );
  const [username, setUsername] = useState<string>("");

  // Khi trang load lại, kiểm tra xem token có trong cookies không
  useEffect(() => {
      axios
        .get("http://localhost:3000/users/", { withCredentials: true })
        .then((response) => {
          setUsername(response.data[0].username);
        })
        .catch((error) => {
          toast.error("Error getting username:", error);
          setUsername("User");
        });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, username, setUsername  }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để truy cập AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
