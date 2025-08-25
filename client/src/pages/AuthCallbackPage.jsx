import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('authToken');

        // --- ADD THIS LOG ---
        console.log("Attempting to process token from URL:", token);

        if (token) {
            // --- ADD THIS LOG ---
            console.log("Token found! Saving to localStorage under the key 'authToken'.");
            localStorage.setItem('authToken', token);
            navigate('/dashboard', { replace: true });
        } else {
            // --- ADD THIS LOG ---
            console.error("Authentication Error: No token found in URL. Redirecting to login.");
            navigate('/login?error=auth_failed', { replace: true });
        }
    }, [searchParams, navigate]);

    return <div>Authenticating, please wait...</div>;
};

export default AuthCallbackPage;