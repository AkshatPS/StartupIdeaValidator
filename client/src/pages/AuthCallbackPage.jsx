import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("authToken");

    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login?error=auth_failed", { replace: true });
    }
  }, [searchParams, navigate]);

  return <div>Authenticating, please wait...</div>;
};

export default AuthCallbackPage;
