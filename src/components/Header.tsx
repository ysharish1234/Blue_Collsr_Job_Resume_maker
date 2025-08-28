import { HardHat, Globe, HelpCircle, LogOut, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onLanguageClick?: () => void;
  onHelpClick?: () => void;
}

export const Header = ({ onLanguageClick, onHelpClick }: HeaderProps) => {
  const { user, signOut } = useAuth();
  return (
    <header className="glass-card border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <HardHat className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <h1 className="text-foreground text-xl font-bold">Smart Resume Maker</h1>
              <p className="text-muted-foreground text-sm">For Blue-Collar Professionals</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/my-resumes">
                  <Button
                    variant="glass"
                    size="sm"
                    className="text-sm"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    My Resumes
                  </Button>
                </Link>
                <span className="text-muted-foreground text-sm">{user.email}</span>
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-sm"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button
                  variant="glass"
                  size="sm"
                  className="text-sm"
                >
                  Sign In
                </Button>
              </Link>
            )}
            {onLanguageClick && (
              <Button
                variant="glass"
                size="sm"
                onClick={onLanguageClick}
                className="text-sm"
              >
                <Globe className="w-4 h-4 mr-1" />
                English
              </Button>
            )}
            {onHelpClick && (
              <Button
                variant="glass"
                size="icon"
                onClick={onHelpClick}
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};