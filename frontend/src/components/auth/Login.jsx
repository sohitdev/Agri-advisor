import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-zinc-200/60 shadow-xl shadow-zinc-200/20">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
            <LogIn size={24} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">{t('welcome_back')}</CardTitle>
          <CardDescription className="text-zinc-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label={t('email')}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
              <Input
                label={t('password')}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600 transition-colors"
                />
                <label htmlFor="remember" className="text-sm text-zinc-600 cursor-pointer">
                  {t('remember_me')}
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                {t('forgot_password')}
              </Link>
            </div>
            
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('logging_in') : t('sign_in')}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t border-zinc-100 pt-6">
          <p className="text-sm text-zinc-600">
            {t('no_account')}{' '}
            <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
              {t('create_account')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
