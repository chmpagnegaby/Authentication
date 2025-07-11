import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error en login');
        return;
      }

      localStorage.setItem('tipo_usuario', data.tipo_usuario);

      if (data.tipo_usuario === 'creador') {
        navigate('/dashboard/creador');
      } else if (data.tipo_usuario === 'marca') {
        navigate('/dashboard/marca');
      } else {
        setError('Tipo de usuario desconocido');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-8">
          Inicia sesión en tu cuenta
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link to="/register" className="text-blue-600 hover:underline">
            Registrarse
          </Link>
        </div>

        <div className="mt-6">
          <button
            onClick={() => alert('Aquí iría la integración con Google OAuth')}
            className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Google_icon.svg" alt="Google" className="w-5 h-5" />
            <span className="text-gray-700 font-medium">Continuar con Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
