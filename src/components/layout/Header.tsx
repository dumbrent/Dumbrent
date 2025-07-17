import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [notificationChannel, setNotificationChannel] = useState<any>(null);
  const [isSettingUpNotifications, setIsSettingUpNotifications] = useState(false);
  const hasSetupNotifications = useRef(false);

  useEffect(() => {
    checkAuth();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session);
      setIsAuthenticated(!!session);
      setIsLoading(false);
      
      if (session && !hasSetupNotifications.current) {
        getUnreadCount();
        setupNotifications();
      } else if (!session) {
        setUnreadCount(0);
        hasSetupNotifications.current = false;
        // Clean up notification channel when user logs out
        if (notificationChannel) {
          supabase.removeChannel(notificationChannel);
          setNotificationChannel(null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      // Clean up notification channel on component unmount
      if (notificationChannel) {
        supabase.removeChannel(notificationChannel);
      }
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session && !hasSetupNotifications.current) {
        getUnreadCount();
        setupNotifications();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupNotifications = async () => {
    // Prevent multiple simultaneous setup attempts
    if (isSettingUpNotifications || hasSetupNotifications.current) return;
    
    setIsSettingUpNotifications(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Remove existing channel if it exists
      if (notificationChannel) {
        supabase.removeChannel(notificationChannel);
        setNotificationChannel(null);
      }

      // Subscribe to new notifications
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            getUnreadCount();
          }
        )
        .subscribe();

      setNotificationChannel(channel);
      hasSetupNotifications.current = true;
    } catch (error) {
      console.error('Error setting up notifications:', error);
    } finally {
      setIsSettingUpNotifications(false);
    }
  };

  const getUnreadCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('read', false);

      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error getting unread count:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUnreadCount(0);
      hasSetupNotifications.current = false;
      navigate('/', { replace: true });
      // Force reload to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center py-2">
            <img 
              src="/Untitled design (9).png" 
              alt="Dumb Rent NYC" 
              className="h-24 w-auto"
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-[#4f46e5] transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-[#4f46e5] transition-colors">
                About
              </Link>
              <Link to="/neighborhoods" className="text-gray-600 hover:text-[#4f46e5] transition-colors">
                Neighborhoods
              </Link>
              <Link to="/submit-listing" className="text-gray-600 hover:text-[#4f46e5] transition-colors">
                Submit Listing
              </Link>
              <Link to="/submit-highlight" className="text-gray-600 hover:text-[#4f46e5] transition-colors">
                Add Neighborhood Highlight
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Link 
                        to="/profile"
                        className="relative"
                      >
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {unreadCount}
                          </span>
                        )}
                        <Bell className="h-6 w-6 text-gray-600 hover:text-[#4f46e5] transition-colors" />
                      </Link>
                      <Link 
                        to="/profile"
                        className="px-4 py-2 rounded-md text-[#4f46e5] border border-[#4f46e5] hover:bg-[#4f46e5]/5 transition-colors"
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-md bg-[#4f46e5] text-white hover:bg-[#4f46e5]/90 transition-colors"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login"
                        className="px-4 py-2 rounded-md text-[#4f46e5] border border-[#4f46e5] hover:bg-[#4f46e5]/5 transition-colors"
                      >
                        Log In
                      </Link>
                      <Link 
                        to="/signup"
                        className="px-4 py-2 rounded-md bg-[#4f46e5] text-white hover:bg-[#4f46e5]/90 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 shadow-lg">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-[#4f46e5] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-[#4f46e5] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/neighborhoods" 
                className="text-gray-600 hover:text-[#4f46e5] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Neighborhoods
              </Link>
              <Link 
                to="/submit-listing" 
                className="text-gray-600 hover:text-[#4f46e5] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Submit Listing
              </Link>
              <Link 
                to="/submit-highlight" 
                className="text-gray-600 hover:text-[#4f46e5] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Add Neighborhood Highlight
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                {!isLoading && (
                  <>
                    {isAuthenticated ? (
                      <>
                        <Link 
                          to="/profile"
                          className="relative px-4 py-2 rounded-md text-[#4f46e5] border border-[#4f46e5] text-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                              {unreadCount}
                            </span>
                          )}
                          Profile
                        </Link>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="px-4 py-2 rounded-md bg-[#4f46e5] text-white text-center"
                        >
                          Log Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/login"
                          className="px-4 py-2 rounded-md text-[#4f46e5] border border-[#4f46e5] text-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Log In
                        </Link>
                        <Link 
                          to="/signup"
                          className="px-4 py-2 rounded-md bg-[#4f46e5] text-white text-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;