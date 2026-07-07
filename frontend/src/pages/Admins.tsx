import { useEffect, useState } from 'react';
import { Shield, ShieldCheck, Trash2, UserPlus, Clock, Mail } from 'lucide-react';
import { AdminInfo, authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function formatDateTime(str?: string): string {
    if (!str) return '—';
    const d = new Date(str);
    return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function Admins() {
    const { admin: me } = useAuth();
    const [admins, setAdmins] = useState<AdminInfo[]>([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        authService.listAdmins().then(setAdmins).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: number, name: string) => {
        if (id === me?.id) { alert('Você não pode remover sua própria conta.'); return; }
        if (!confirm(`Remover o administrador "${name}"?`)) return;
        await authService.deleteAdmin(id);
        load();
    };

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Administradores</h1>
                    <p className="text-gray-500 mt-1">Gerencie quem tem acesso ao sistema</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-sm px-3 py-1.5 rounded-xl">
                    <UserPlus className="w-4 h-4" />
                    Novos admins via tela de cadastro
                </div>
            </div>

            {/* My account card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
                <p className="text-green-100 text-xs font-semibold uppercase tracking-wide mb-3">Sua conta</p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-xl font-bold">{me?.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                        <p className="font-semibold text-lg">{me?.name}</p>
                        <p className="text-green-100 text-sm">{me?.email}</p>
                    </div>
                    <div className="ml-auto">
            <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
              {me?.role === 'SUPER_ADMIN' ? '⭐ Super Admin' : 'Admin'}
            </span>
                    </div>
                </div>
            </div>

            {/* Admins list */}
            <div className="bg-white rounded-2xl border border-gray-100">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <h2 className="font-semibold text-gray-900 text-sm">Todos os administradores</h2>
                    <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{admins.length}</span>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-400 text-sm">Carregando...</div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {admins.map(admin => (
                            <div key={admin.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                {/* Avatar */}
                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-sm">{admin.name[0].toUpperCase()}</span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-gray-900 text-sm truncate">{admin.name}</p>
                                        {admin.id === me?.id && (
                                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">você</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Mail className="w-3 h-3" />{admin.email}
                    </span>
                                    </div>
                                    {admin.lastLoginAt && (
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                            <Clock className="w-3 h-3" />
                                            Último acesso: {formatDateTime(admin.lastLoginAt)}
                                        </div>
                                    )}
                                </div>

                                {/* Role badge */}
                                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      admin.role === 'SUPER_ADMIN'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-gray-50 text-gray-600 border border-gray-100'
                  }`}>
                    {admin.role === 'SUPER_ADMIN'
                        ? <><ShieldCheck className="w-3 h-3" /> Super Admin</>
                        : <><Shield className="w-3 h-3" /> Admin</>
                    }
                  </span>

                                    {/* Delete */}
                                    {admin.id !== me?.id && (
                                        <button
                                            onClick={() => handleDelete(admin.id, admin.name)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                                            title="Remover administrador"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
                <p className="font-medium mb-1">ℹ️ Como adicionar novos administradores</p>
                <p className="text-blue-600 text-xs leading-relaxed">
                    Compartilhe o link do sistema e peça para a pessoa criar uma conta na tela de <strong>Cadastro</strong>.
                    Novas contas são criadas com o papel de <strong>Admin</strong> por padrão.
                </p>
            </div>
        </div>
    );
}
