// src/components/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Calendario', path: '/calendario' },
    { label: 'Pacientes', path: '/pacientes' },
    { label: 'Pagos', path: '/pagos' },
    { label: 'Gastos', path: '/gastos' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className={`${darkMode ? 'bg-slate-900' : 'bg-white'} shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            📋 KineGest
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  darkMode
                    ? 'text-gray-300 hover:bg-slate-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition ${
                darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded text-sm font-medium ${
                  darkMode
                    ? 'text-gray-300 hover:bg-slate-700'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}