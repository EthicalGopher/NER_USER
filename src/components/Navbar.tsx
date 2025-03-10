
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import SearchDialog from './SearchDialog';
import CartDialog from './CartDialog';
import SignInDialog from './SignInDialog';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const { totalItems } = useCart();

  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = () => {
    localStorage.removeItem("password");
    localStorage.removeItem("aadhar");
    setIsSignedIn(false);
  };

  useEffect(() => {
    const checkSignInStatus = () => {
      if (localStorage.getItem("createAccountData")){
        if (localStorage.getItem("password") || localStorage.getItem("aadhar")) {
          setIsSignedIn(false);
        } else {
          setIsSignedIn(true);
        }
      } else {
        setIsSignedIn(false);
      }
    };

    checkSignInStatus();
    
    // Listen for storage changes to handle sign-in/sign-out from other tabs/windows
    window.addEventListener('storage', checkSignInStatus);

    return () => {
      window.removeEventListener('storage', checkSignInStatus);
    };
  }, []);

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-xl sm:text-2xl font-bold text-agri-green">AgriRoad</h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`nav-link ${isActive('/') ? 'text-agri-green' : ''}`}>
            HOME
          </Link>
          <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'text-agri-green' : ''}`}>
            SHOP
          </Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'text-agri-green' : ''}`}>
            CONTACT
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:text-agri-green"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:text-agri-green relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-agri-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
          {isSignedIn ? (
            <Button
              variant="default"
              className="bg-red-500 hover:bg-red-600 text-white transition-colors"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 w-4 h-4"/>
              Sign Out
            </Button>
          ) : (
            <Button
              variant="default"
              className="bg-agri-green hover:bg-agri-dark-green text-white transition-colors"
              onClick={() => setSignInOpen(true)}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <CartDialog open={cartOpen} onOpenChange={setCartOpen} />
      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
    </header>
  );
};

export default Navbar;
