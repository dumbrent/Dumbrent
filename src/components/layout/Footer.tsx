import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
    // Smooth scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-white text-black">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-[#6b46c1]" />
              <span className="text-2xl font-bold text-black">Dumb Rent NYC</span>
            </div>
            <p className="text-gray-600 mb-4">
              Find your perfect apartment in NYC without the dumb broker fee. 
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/dumbrentnyc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/DumbRent" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#6b46c1]">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => handleLinkClick('/')}
                className="text-gray-600 hover:text-black transition-colors text-left"
              >
                Home
              </button>
              <button 
                onClick={() => handleLinkClick('/about')}
                className="text-gray-600 hover:text-black transition-colors text-left"
              >
                About
              </button>
              <button 
                onClick={() => handleLinkClick('/feedback')}
                className="text-gray-600 hover:text-black transition-colors text-left"
              >
                Feedback
              </button>
            </nav>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#6b46c1]">NYC Boroughs</h3>
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => handleLinkClick('/neighborhoods?borough=1')}
                className="text-gray-600 hover:text-black transition-colors text-left"
              >
                Manhattan
              </button>
              <button 
                onClick={() => handleLinkClick('/neighborhoods?borough=2')}
                className="text-gray-600 hover:text-black transition-colors text-left"
              >
                Brooklyn
              </button>
              <button 
                onClick={() => handleLinkClick('/neighborhoods?borough=3')}
                className="text-gray-600 hover:text-black transition-colors text-left"
              >
                Queens
              </button>
              <button 
                onClick={() => handleLinkClick('/neighborhoods?borough=4')}
                className="text-gray-600 hover:text-black transition-colors text-left"
              >
                The Bronx
              </button>
              <button 
                onClick={() => handleLinkClick('/neighborhoods?borough=5')}
                className="text-gray-600 hover:text-black transition-colors text-left"
              >
                Staten Island
              </button>
            </nav>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#6b46c1]">Contact Us</h3>
            <div className="flex flex-col space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                <span className="text-gray-600">123 Broadway, New York, NY 10001</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-600" />
                <a href="mailto:info@dumbrent.com" className="text-gray-600 hover:text-black transition-colors">
                  info@dumbrent.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-600" />
                <a href="tel:+12125551234" className="text-gray-600 hover:text-black transition-colors">
                  (212) 555-1234
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-center md:text-left">
              © {new Date().getFullYear()} Dumb Rent inc. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button 
                onClick={() => handleLinkClick('/terms')}
                className="text-gray-600 hover:text-black transition-colors text-sm"
              >
                Terms & Conditions
              </button>
              <button 
                onClick={() => handleLinkClick('/privacy')}
                className="text-gray-600 hover:text-black transition-colors text-sm"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => handleLinkClick('/about')}
                className="text-gray-600 hover:text-black transition-colors text-sm"
              >
                About Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;