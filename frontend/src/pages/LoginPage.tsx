import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Leaf, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

// Define login validation schema using Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // 1. Automatically redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const destination = `/dashboard/${user.role.toLowerCase()}`;
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // 2. React Hook Form configuration
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // 3. Submit handler
  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setLoginError(null);
    try {
      const loggedUser = await login(values);
      toast.success(`Welcome back, ${loggedUser.name}!`);
      // Redirect occurs automatically via useEffect hook above
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid email or password. Please try again.';
      setLoginError(msg);
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest-950 text-foreground px-4 relative overflow-hidden dashboard-view">
      {/* Aesthetic glowing background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full" data-aos="fade-up">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center text-primary border border-primary/20 mb-4 shadow-[0_0_15px_rgba(223,185,60,0.1)]">
            <Leaf className="h-6 w-6" />
          </div>
          <h1 className="font-playfair text-3xl font-bold tracking-wide">
            Forest<span className="text-primary italic font-normal">Feast</span>
          </h1>
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] mt-1.5">
            Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-forest-900/40 border border-gold-300/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          <h2 className="font-playfair text-xl font-semibold mb-6 text-center">Log In to System</h2>

          {loginError && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground/60">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full bg-forest-950/60 border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground ${
                    errors.email ? 'border-red-500/45 focus:border-red-500' : 'border-gold-300/10'
                  }`}
                  placeholder="admin@restaurant.com"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-[10px] mt-1.5 flex items-center gap-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground/60">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  {...register('password')}
                  className={`w-full bg-forest-950/60 border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground ${
                    errors.password ? 'border-red-500/45 focus:border-red-500' : 'border-gold-300/10'
                  }`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-[10px] mt-1.5 flex items-center gap-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold uppercase tracking-wider text-xs py-6 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(223,185,60,0.15)] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Log In'
                )}
              </Button>
            </div>
          </form>

          {/* Demo Accounts Credentials Box */}
          <div className="mt-6 pt-5 border-t border-gold-300/10 text-[10px] text-muted-foreground space-y-1.5">
            <p className="font-semibold uppercase tracking-wider text-primary mb-1">Seeded Demo Credentials:</p>
            <div className="flex justify-between font-mono">
              <span>Admin:</span>
              <span>admin@restaurant.com / Admin@123</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Manager:</span>
              <span>manager@restaurant.com / Manager@123</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Cashier:</span>
              <span>cashier@restaurant.com / Cashier@123</span>
            </div>
          </div>
        </div>

        {/* Footer redirection */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            ← Back to Sanctuary Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
