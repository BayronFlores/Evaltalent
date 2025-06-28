import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login, clearError } from '../redux/slices/authSlises';
import { BarChart3, Eye, EyeOff, Mail, Lock, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from '../services/tokenManager';

import type { AppDispatch, RootState } from '../redux/store';
import type { LoginForm } from '../types/FormType';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [isAuthenticated, user?.role, navigate]);

  const onSubmit = async (data: LoginForm) => {
    dispatch(clearError());
    try {
      console.log('🔄 Submitting login form:', data);
      const result = await dispatch(login(data));
      console.log('📡 Login result:', result);
    } catch (error) {
      console.error('❌ Login form error:', error);
    }
  };

  // Función para llenar credenciales de ejemplo
  const fillCredentials = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
    setShowCredentials(false);
  };

  // Credenciales actualizadas que coinciden con el backend
  const exampleCredentials = [
    { role: 'Administrador', email: 'admin', password: 'admin123' },
    { role: 'Manager', email: 'manager', password: 'manager123' },
    { role: 'Empleado', email: 'employee', password: 'employee123' },
  ];

  // Debug: mostrar estado de autenticación
  useEffect(() => {
    console.log('🔍 Auth Debug:');
    console.log('- isAuthenticated:', isAuthenticated);
    console.log('- Token exists:', !!tokenManager.getToken());
    console.log('- User exists:', !!tokenManager.getUser());
    tokenManager.debug();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f9ff] to-[#f1f5f9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#0284c7] rounded-2xl flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#0f172a]">EvalTalent</h2>
          <p className="mt-2 text-sm text-[#475569]">
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Demo Credentials Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Credenciales de prueba
              </h3>
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {showCredentials ? 'Ocultar' : 'Ver credenciales disponibles'}
              </button>

              {showCredentials && (
                <div className="mt-3 space-y-2">
                  {exampleCredentials.map((cred, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white rounded p-2 text-xs"
                    >
                      <div>
                        <span className="font-medium text-blue-800">
                          {cred.role}:
                        </span>
                        <br />
                        <span className="text-blue-600">
                          Usuario: {cred.email}
                        </span>
                        <br />
                        <span className="text-blue-600">
                          Contraseña: {cred.password}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          fillCredentials(cred.email, cred.password)
                        }
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Usar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#334155] mb-2"
              >
                Usuario o Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#94a3b8]" />
                </div>
                <input
                  {...register('email', {
                    required: 'El usuario o correo electrónico es requerido',
                  })}
                  type="text"
                  className="w-full px-3 py-2 pl-10 border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent"
                  placeholder="admin o admin@evaltalent.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#334155] mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#94a3b8]" />
                </div>
                <input
                  {...register('password', {
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 pl-10 pr-10 border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#94a3b8] hover:text-[#64748b]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#94a3b8] hover:text-[#64748b]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0284c7] hover:bg-[#0369a1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0284c7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-[#64748b]">
            © 2024 EvalTalent. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
