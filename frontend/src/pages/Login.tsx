import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'register';

export function Login() {
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [mode, setMode] = useState<Mode>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
            } else {
                if (name.trim().length < 2) { setError('Nome deve ter ao menos 2 caracteres.'); return; }
                if (password.length < 6) { setError('Senha deve ter ao menos 6 caracteres.'); return; }
                await register(name, email, password);
            }
            navigate('/');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg || (mode === 'login' ? 'E-mail ou senha incorretos.' : 'Não foi possível cadastrar. Verifique os dados.'));
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (m: Mode) => {
        setMode(m);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl shadow-lg mb-4">
                        <Heart className="w-8 h-8 text-white" fill="white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">PataFeliz</h1>
                    <p className="text-gray-500 text-sm mt-1">Sistema de Gestão do Abrigo</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => switchMode('login')}
                            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                                mode === 'login'
                                    ? 'text-green-700 border-b-2 border-green-600 bg-green-50/50'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => switchMode('register')}
                            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                                mode === 'register'
                                    ? 'text-green-700 border-b-2 border-green-600 bg-green-50/50'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Criar conta
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">

                        {/* Title */}
                        <div className="mb-2">
                            <h2 className="text-lg font-bold text-gray-900">
                                {mode === 'login' ? 'Bem-vindo de volta!' : 'Criar conta de administrador'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {mode === 'login'
                                    ? 'Entre com suas credenciais para acessar o sistema.'
                                    : 'Preencha os dados para criar sua conta.'}
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Name (register only) */}
                        {mode === 'register' && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome completo</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Seu nome"
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Senha</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Hint for login */}
                        {mode === 'login' && (
                            <p className="text-xs text-gray-400">
                                Conta padrão: <span className="font-mono text-gray-500">admin@patafeliz.com</span> / <span className="font-mono text-gray-500">admin123</span>
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm mt-2"
                        >
                            {loading
                                ? <><Loader2 className="w-4 h-4 animate-spin" />Aguarde...</>
                                : mode === 'login' ? 'Entrar no sistema' : 'Criar minha conta'
                            }
                        </button>

                    </form>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    PataFeliz © {new Date().getFullYear()} — Sistema de gestão de abrigo
                </p>
            </div>
        </div>
    );
}
