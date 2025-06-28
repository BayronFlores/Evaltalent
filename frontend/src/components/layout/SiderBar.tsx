import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { getAppRoutes } from '../routing/RouteConfig';
import { BarChart3, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user?.role) return null;

  // Llamar sin argumentos
  const routes = getAppRoutes();

  // Filtrar rutas que el usuario puede ver (según allowedRoles)
  const filteredRoutes = routes.filter((route) =>
    route.allowedRoles.includes(user.role),
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#e2e8f0]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#0284c7] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0f172a]">EvalTalent</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-[#f1f5f9]"
          >
            <X className="w-5 h-5 text-[#64748b]" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {filteredRoutes.map(({ path, name, icon: Icon }) => {
              const isActive = location.pathname === `/${user.role}/${path}`;
              return (
                <li key={path}>
                  <NavLink
                    to={`/${user.role}/${path}`}
                    onClick={onClose}
                    className={`${
                      isActive ? 'active' : ''
                    } flex items-center p-2 text-gray-900 rounded-lg hover:text-white hover:bg-gray-700 group`}
                  >
                    <Icon className="w-5 h-5 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="ms-3">{name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Info usuario abajo */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#e2e8f0]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#e0f2fe] rounded-full flex items-center justify-center">
              {/* Icono usuario */}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0f172a] truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-[#64748b] truncate">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
