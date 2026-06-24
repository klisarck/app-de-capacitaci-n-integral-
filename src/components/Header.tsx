import { useI18n } from '@/contexts/I18nContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Menu, X, LogOut, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/hooks/useUserRole';
import { signOut } from '@/lib/auth';

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
}

const Header = ({ isLoggedIn = false, userName = 'Estudiante' }: HeaderProps) => {
  const { t, lang, setLang } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isStaff } = useUserRole();

  const toggleLang = () => setLang(lang === 'es' ? 'en' : 'es');
  const handleLogout = async () => { await signOut(); navigate('/'); };

  const navLinks = isLoggedIn
    ? [
        { to: '/dashboard', label: t.nav.dashboard },
        { to: '/courses', label: t.nav.courses },
        { to: '/regulations', label: lang === 'es' ? 'Reglamentos' : 'Regulations' },
        { to: '/simulations', label: t.nav.simulations },
        { to: '/profile', label: t.nav.profile },
        ...(isStaff ? [{ to: '/admin', label: lang === 'es' ? 'Admin' : 'Admin' }] : []),
      ]
    : [];


  return (
    <header className="border-b-2 border-foreground bg-background sticky top-0 z-50">
      {/* Military stamp band */}
      <div className="military-stamp h-3 w-full relative overflow-hidden border-b-2 border-foreground">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8px] tracking-[0.4em] font-black text-white/80 font-mono whitespace-nowrap">
            ★ UNEFA · INSTRUCCIÓN PREMILITAR · DISCIPLINA · HONOR · LEALTAD · UNEFA · INSTRUCCIÓN PREMILITAR · DISCIPLINA · HONOR · LEALTAD ★
          </span>
        </div>
      </div>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={isLoggedIn ? '/dashboard' : '/'} className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" strokeWidth={2.5} />
          <span className="font-heading font-black text-lg tracking-tight hidden sm:inline">
            {t.app.shortName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-semibold uppercase tracking-widest transition-colors hover:text-foreground ${
                location.pathname === link.to ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-sm font-mono font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t.common.language}
          >
            <Globe className="h-4 w-4" />
            {lang.toUpperCase()}
          </button>

          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-foreground font-semibold uppercase tracking-wider text-xs"
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              {t.nav.logout}
            </Button>
          ) : (
            <Link to="/login">
              <Button size="sm" className="font-semibold uppercase tracking-wider text-xs">
                {t.nav.login}
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleLang} className="text-muted-foreground hover:text-foreground">
            <Globe className="h-5 w-5" />
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-foreground bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold uppercase tracking-widest py-2"
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <button
                onClick={async () => { setMobileMenuOpen(false); await handleLogout(); }}
                className="text-sm font-semibold uppercase tracking-widest py-2 text-left"
              >
                {t.nav.logout}
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-widest py-2">
                {t.nav.login}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
