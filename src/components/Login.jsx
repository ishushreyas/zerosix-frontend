// components/Login.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      // The loginWithGoogle function in AuthContext will handle the redirect
      // So, no need for navigate('/') here directly after the call
    } catch (err) {
      setError('Failed to sign in with Google.');
       console.error(err);
    }
    setLoading(false);
  }

  return (
     <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Sign in with</span></div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
               Continue with Google
            </Button>
          </CardContent>
        </Card>
    </div>
  );
};

export default Login;
