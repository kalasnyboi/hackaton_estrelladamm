import { useState } from 'react';
import { LogIn, Mail, User, Calendar, Users } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
  onGoogleLogin: () => void;
  onSwitchToRegister: () => void;
}

export default function Login({ onLogin, onGoogleLogin, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FFF5F5] to-[#FFFBF0] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#333333] mb-4">
            Bienvenido de vuelta
          </h1>
          <p className="text-xl text-[#666666]">
            Ingresa tu email para continuar
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#333333] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#999999]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-[#F5F5F5] rounded-xl focus:border-[#C8102E] outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#C8102E] to-[#D4AF37] text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Iniciar sesión
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E5E5]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#999999]">o continúa con</span>
            </div>
          </div>

          <button
            onClick={onGoogleLogin}
            className="w-full bg-white border-2 border-[#F5F5F5] text-[#333333] font-bold py-4 rounded-xl hover:shadow-lg hover:border-[#E5E5E5] transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div className="mt-6 pt-6 border-t border-[#F5F5F5] text-center">
            <p className="text-[#666666] mb-3">
              ¿No tienes cuenta?
            </p>
            <button
              onClick={onSwitchToRegister}
              className="text-[#C8102E] hover:text-[#D4AF37] font-bold transition-colors"
            >
              Regístrate aquí
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <User className="w-6 h-6 text-[#C8102E] mx-auto mb-2" />
            <p className="text-xs font-medium text-[#666666]">Perfil</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <Users className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
            <p className="text-xs font-medium text-[#666666]">Conectar</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <Calendar className="w-6 h-6 text-[#C8102E] mx-auto mb-2" />
            <p className="text-xs font-medium text-[#666666]">Eventos</p>
          </div>
        </div>
      </div>
    </section>
  );
}
