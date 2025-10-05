
import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `text-base md:text-lg transition-colors duration-200 hover:underline ${isActive ? 'underline' : 'no-underline'}`;

  return (
    <header className="border-b-2 border-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Jinwoo Im's Blog
            </h1>
          </div>
          <nav className="flex items-center space-x-4 md:space-x-6">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/biography" className={navLinkClass}>Biography</NavLink>
            <NavLink to="/publications" className={navLinkClass}>Publications</NavLink>
            <NavLink to="/study-record" className={navLinkClass}>Study-Record</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;