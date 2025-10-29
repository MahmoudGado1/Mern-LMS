/* eslint-disable no-unused-vars */
import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // ✅ Register Handler with Toasts
  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      if (data.success) {
        toast({
          title: data.message || "Registration Successful",
          description: "You can now log in.",
        });
        setSignUpFormData(initialSignUpFormData);
      } else {
        toast({
          title: data.message || "Registration Failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred during registration",
        description: error?.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  }

  // ✅ Login Handler with Toasts
  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        toast({
          title: data.message || "Login Successful",
          description: "You are logged in successfully",
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        toast({
          title: data.message || "Login Failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      setAuth({
        authenticate: false,
        user: null,
      });
      toast({
        title: "An error occurred during login",
        description: error?.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  }

  // ✅ Check Auth with Error Handling
  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      setAuth({
        authenticate: false,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
