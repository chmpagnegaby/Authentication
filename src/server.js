require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { PrismaClient } = require('../generated/prisma/client');
const cookieParser = require('cookie-parser');

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: 'http://localhost:5173',  // Aquí pones la URL de tu frontend (Vite)
  credentials: true, // Esto permite enviar cookies (muy importante para autenticación)
}));
app.use(cookieParser());
app.use(express.json());

const JWT_SECRET = 'super_secret_jwt_key'; // Puedes mover esto a .env

// Registro
app.post('/register', async (req, res) => {
  const { email, password, nombre, tipo_usuario } = req.body;

  const password_hash = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
    data: { email, password_hash, nombre, tipo_usuario },
  });

  res.json({ message: 'Usuario creado', usuario });
});

// Login
// Login con cookie
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' });

  const validPassword = await bcrypt.compare(password, usuario.password_hash);
  if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign(
    { id: usuario.id, tipo_usuario: usuario.tipo_usuario },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Enviar token en una cookie segura
  res.cookie('token', token, {
    httpOnly: true,    // No accesible por JavaScript del cliente
    secure: false,     // true si usas HTTPS (en local puede ser false)
    sameSite: 'lax'    // Previene CSRF
  });

  res.json({ message: 'Login exitoso', tipo_usuario: usuario.tipo_usuario });
});


// Ruta protegida según tipo de usuario
app.get('/protected', async (req, res) => {
const token = req.cookies.token;  // ✅ Lee el token desde la cookie
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: `Bienvenido ${decoded.tipo_usuario}`, ruta: `/${decoded.tipo_usuario}/dashboard` });
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
