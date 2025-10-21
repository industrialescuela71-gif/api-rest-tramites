// netlify/functions/api.js

const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const { readTramites, writeTramites } = require("../../utils/fileManager");

const app = express();
const router = express.Router(); // Usamos un Router para las rutas de la API

// --- Carga Inicial de Datos (Sólo Lectura al inicio de la función) ---
let tramites = readTramites();

function getNextId(data) {
  if (data.length === 0) return 1;
  const maxId = data.reduce((max, t) => (t.id > max ? t.id : max), 0);
  return maxId + 1;
}
let nextId = getNextId(tramites);

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// 4. Endpoints CRUD usando el Router
// ----------------------------------------------------

// CREAR (CREATE) - POST /api/tramites
router.post("/tramites", (req, res) => {
  const nuevoTramite = req.body;

  if (!nuevoTramite.titulo) {
    return res
      .status(400)
      .json({ error: "El título del trámite es obligatorio." });
  }

  const tramiteCompleto = {
    id: nextId++, // El incremento de nextId solo durará el ciclo de la función
    ...nuevoTramite,
  };

  tramites.push(tramiteCompleto);

  // ESTO FALLARÁ EN NETLIFY, PERO MANTENEMOS LA LLAMADA PARA DEMOSTRACIÓN
  writeTramites(tramites);

  res.status(201).json(tramiteCompleto);
});

// LEER TODOS (READ ALL) - GET /api/tramites
router.get("/tramites", (req, res) => {
  // Aquí siempre leerás los datos que existían en el momento del despliegue,
  // ya que la escritura falla y los datos en memoria se pierden.
  res.status(200).json(tramites);
});

// ... (Implementar rutas GET /:id, PUT /:id, DELETE /:id con la misma lógica) ...
// (La lógica es idéntica a tu server.js, pero usando 'router.VERBO')

// --- Envolver la aplicación Express ---
// Base de la ruta para Netlify Functions: /.netlify/functions/api/
app.use("/api", router);

// Exportar la función Lambda
module.exports.handler = serverless(app);

// Nota: Asegúrate de completar las rutas GET /:id, PUT y DELETE en la misma forma que lo hiciste en el server.js original.
// La única diferencia es usar router.VERBO en lugar de app.VERBO.
