// server.js (Versión con persistencia JSON)

// 1. Importar el módulo Express y el nuevo módulo de gestión de archivos
const express = require("express");
const cors = require("cors");
const app = express();
const { readTramites, writeTramites } = require("./utils/fileManager"); // Importamos las funciones
const PORT = process.env.PORT || 3000;

function sanitizeInput(text) {
  if (typeof text !== "string") return text;
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/&/g, "&amp;");
}

app.use(cors());
// 2. Base de Datos Simulada (Carga los datos desde el archivo)
// La variable tramites ahora es mutable y se carga al inicio.
let tramites = readTramites(); // ¡Leemos del archivo al iniciar!

// Función para obtener el próximo ID, asegurando que siempre sea el máximo + 1
function getNextId(data) {
  if (data.length === 0) return 1;
  // Encuentra el ID más grande en el array y le suma 1
  const maxId = data.reduce((max, t) => (t.id > max ? t.id : max), 0);
  return maxId + 1;
}
let nextId = getNextId(tramites); // Calcula el nextId basado en los datos cargados.

// 3. Middleware Esencial
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "API de Guía de Trámites",
    endpoints: {
      listar: "GET /tramites",
      obtener: "GET /tramites/:id",
      crear: "POST /tramites",
      actualizar: "PUT /tramites/:id",
      eliminar: "DELETE /tramites/:id",
    },
  });
});

// ----------------------------------------------------
// 4. Endpoints CRUD (Ahora con escritura en disco)
// ----------------------------------------------------

// A. CREAR (CREATE) - Verbo: POST
app.post("/tramites", (req, res) => {
  const nuevoTramite = req.body;

  if (!nuevoTramite.titulo) {
    return res
      .status(400)
      .json({ error: "El título del trámite es obligatorio." });
  }

  const tramiteCompleto = {
    id: nextId++,
    titulo: sanitizeInput(nuevoTramite.titulo),
    descripcion: sanitizeInput(nuevoTramite.descripcion),
    tiempo_estimado: sanitizeInput(nuevoTramite.tiempo_estimado),
    costo: sanitizeInput(nuevoTramite.costo),
    publico_objetivo: sanitizeInput(nuevoTramite.publico_objetivo),
    direccion_tramitacion: sanitizeInput(nuevoTramite.direccion_tramitacion),
  };

  tramites.push(tramiteCompleto);
  writeTramites(tramites);
  res.status(201).json(tramiteCompleto);
});

app.post("/tramites", (req, res) => {
  const nuevoTramite = req.body;

  if (!nuevoTramite.titulo) {
    return res
      .status(400)
      .json({ error: "El título del trámite es obligatorio." });
  }

  const tramiteCompleto = {
    id: nextId++,
    titulo: sanitizeInput(nuevoTramite.titulo),
    descripcion: sanitizeInput(nuevoTramite.descripcion),
    tiempo_estimado: sanitizeInput(nuevoTramite.tiempo_estimado),
    costo: sanitizeInput(nuevoTramite.costo),
    publico_objetivo: sanitizeInput(nuevoTramite.publico_objetivo),
    direccion_tramitacion: sanitizeInput(nuevoTramite.direccion_tramitacion),
  };

  tramites.push(tramiteCompleto);
  writeTramites(tramites);
  res.status(201).json(tramiteCompleto);
});

// B. LEER TODOS (READ ALL) - Verbo: GET
app.get("/tramites", (req, res) => {
  // Si queremos datos actualizados al 100%, podemos leerlos aquí también,
  // pero para este caso, la variable en memoria 'tramites' es suficiente
  // ya que la modificamos en POST/PUT/DELETE.
  res.status(200).json(tramites);
});

// C. LEER UNO (READ ONE) - Verbo: GET
app.get("/tramites/:id", (req, res) => {
  const idBuscado = parseInt(req.params.id);
  const tramiteEncontrado = tramites.find((t) => t.id === idBuscado);

  if (tramiteEncontrado) {
    res.status(200).json(tramiteEncontrado);
  } else {
    res
      .status(404)
      .json({ error: `Trámite con ID ${idBuscado} no encontrado.` });
  }
});

app.put("/tramites/:id", (req, res) => {
  const idBuscado = parseInt(req.params.id);
  const index = tramites.findIndex((t) => t.id === idBuscado);

  if (index !== -1) {
    tramites[index] = {
      id: idBuscado,
      titulo: sanitizeInput(req.body.titulo),
      descripcion: sanitizeInput(req.body.descripcion),
      tiempo_estimado: sanitizeInput(req.body.tiempo_estimado),
      costo: sanitizeInput(req.body.costo),
      publico_objetivo: sanitizeInput(req.body.publico_objetivo),
      direccion_tramitacion: sanitizeInput(req.body.direccion_tramitacion),
    };

    writeTramites(tramites);
    res.status(200).json(tramites[index]);
  } else {
    res.status(404).json({
      error: `Trámite con ID ${idBuscado} no encontrado para actualizar.`,
    });
  }
});

// E. ELIMINAR (DELETE)
app.delete("/tramites/:id", (req, res) => {
  const idBuscado = parseInt(req.params.id);
  const index = tramites.findIndex((t) => t.id === idBuscado);

  if (index !== -1) {
    tramites.splice(index, 1);

    // **NUEVO:** Escribir el array actualizado en el archivo JSON
    writeTramites(tramites);

    // Corregido: Usamos solo 204 como respuesta limpia de eliminación.
    res.status(204).send();
  } else {
    res.status(404).json({
      error: `Trámite con ID ${idBuscado} no encontrado para eliminar.`,
    });
  }
});

// 5. Iniciar el Servidor
app.listen(PORT, () => {
  console.log(
    `Servidor de Guía de Trámites (Persistente en JSON) corriendo en http://localhost:${PORT}`
  );
});
