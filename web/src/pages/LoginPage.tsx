import React, { useState, useEffect } from 'react';
import { User, Lock, AlertCircle, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { login, register, clearError } from '../store/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', confirm: '' });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isLoggedIn } = useAppSelector(state => state.user);
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  // Clear error when switching tabs
  useEffect(() => {
    dispatch(clearError());
  }, [activeTab, dispatch]);
  
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) return;

    try {
      const result = await dispatch(login(loginForm));
      console.log('Login result:', result);
      navigate('/');
    } catch (error) {
      console.log('Login failed:', error);
    }
  };

  // Handle register form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.username || !registerForm.password || !registerForm.confirm) return;
    if (registerForm.password !== registerForm.confirm) return;

    try {
      const result = await dispatch(register({
        username: registerForm.username,
        password: registerForm.password
      }));

      console.log('Register result:', result);
      navigate('/');
    } catch (error) {
      console.log('Registration failed:', error);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bot className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl font-bold text-primary">Chat Box</CardTitle>
          </div>
          <CardDescription>Your AI Chat Assistant</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(clearError())}
                className="ml-auto h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          )}
        
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-username"
                      placeholder="Username"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !loginForm.username || !loginForm.password}
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </Button>
              </form>
            </TabsContent>
          
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-username"
                      placeholder="Username"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                      className="pl-10"
                      required
                      minLength={3}
                    />
                  </div>
                  {registerForm.username && registerForm.username.length < 3 && (
                    <p className="text-xs text-destructive">Username must be at least 3 characters</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                  {registerForm.password && registerForm.password.length < 6 && (
                    <p className="text-xs text-destructive">Password must be at least 6 characters</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="Confirm Password"
                      value={registerForm.confirm}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirm: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                  {registerForm.confirm && registerForm.password !== registerForm.confirm && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !registerForm.username || !registerForm.password || !registerForm.confirm || registerForm.password !== registerForm.confirm}
                >
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
