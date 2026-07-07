import { Home, PawPrint, PlusCircle, BarChart3, Users, Heart, UserCog, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/animals', icon: PawPrint, label: 'Animais' },
  { to: '/animals/new', icon: PlusCircle, label: 'Cadastrar' },
  { to: '/stats', icon: BarChart3, label: 'Relatórios' },
    { to: '/admins', icon: Users, label: 'Administradores' },
];

export function Sidebar() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-tight">PataFeliz</h1>
            <p className="text-xs text-gray-500 leading-tight">Abrigo de Animais</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
            {admin && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">{admin.name[0].toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{admin.name}</p>
                        <p className="text-xs text-gray-400 truncate">{admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</p>
                    </div>
                </div>
            )}
            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
            >
                <LogOut className="w-4 h-4" />
                Sair
            </button>
        </div>
    </aside>
  );
}
