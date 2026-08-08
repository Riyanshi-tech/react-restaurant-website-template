import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotAuthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (user) {
      // Redirect back to their dashboard role
      navigate(`/dashboard/${user.role.toLowerCase()}`, { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest-950 text-foreground px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-forest-900/40 p-8 rounded-3xl border border-gold-300/10 backdrop-blur-md">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-400 mx-auto shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <ShieldAlert className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="font-playfair text-2xl md:text-3xl font-bold tracking-wide">Access Denied</h1>
          <p className="text-muted-foreground text-sm">
            Your current administrative clearance does not permit you to access this workspace.
          </p>
        </div>

        <div className="pt-2">
          <Button 
            onClick={handleGoBack}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider text-xs px-6 py-5 rounded-full flex items-center justify-center gap-2 mx-auto transition-transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
