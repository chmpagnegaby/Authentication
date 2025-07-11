import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Aquí deberías validar que el usuario está autenticado.
// Por ejemplo, comprobando un token válido almacenado o una cookie.
// Para el ejemplo, usaremos localStorage con 'tipo_usuario' guardado en login.

export default function PrivateRoute() {
  const tipo_usuario = localStorage.getItem('tipo_usuario');

  if (!tipo_usuario) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
