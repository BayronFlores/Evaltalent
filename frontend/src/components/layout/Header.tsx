import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../redux/store';
import { logout } from '../../redux/slices/authSlises';
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Refs for click outside detection
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/login');
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'Nueva evaluación asignada',
      message: 'Tienes una nueva evaluación pendiente de Juan Pérez',
      time: '5 min',
      read: false,
    },
    {
      id: 2,
      title: 'Evaluación completada',
      message: 'María García ha completado su autoevaluación',
      time: '1 hora',
      read: false,
    },
    {
      id: 3,
      title: 'Recordatorio',
      message: 'La evaluación de Q1 vence mañana',
      time: '2 horas',
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white shadow-sm border-b border-[#e2e8f0]">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
          >
            <Menu className="w-5 h-5 text-[#475569]" />
          </button>

          {/* Search bar */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#94a3b8]" />
            </div>
            <input
              type="text"
              className="block w-80 pl-10 pr-3 py-2 border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
              placeholder="Buscar evaluaciones, usuarios..."
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] relative"
            >
              <Bell className="w-5 h-5 text-[#475569]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-[#e2e8f0] z-50">
                <div className="p-4 border-b border-[#e2e8f0]">
                  <h3 className="text-lg font-medium text-[#0f172a]">
                    Notificaciones
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-[#f1f5f9] hover:bg-[#f8fafc] cursor-pointer ${
                        !notification.read ? 'bg-[#f0f9ff]' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#0f172a]">
                            {notification.title}
                          </p>
                          <p className="text-sm text-[#475569] mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-[#64748b] ml-2">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2">
                  <button className="w-full text-center text-sm text-[#0284c7] hover:text-[#0369a1] py-2">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
            >
              <div className="w-8 h-8 bg-[#e0f2fe] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-[#0284c7]" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-[#0f172a]">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-[#64748b]">
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : ''}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#e2e8f0] z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-[#334155] hover:bg-[#f1f5f9] rounded-lg"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center w-full px-3 py-2 text-sm text-[#334155] hover:bg-[#f1f5f9] rounded-lg"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Configuración
                  </button>
                  <hr className="my-2 border-[#e2e8f0]" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#94a3b8]" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
            placeholder="Buscar..."
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
