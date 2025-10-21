// utils/fileManager.js

const fs = require("fs");
const path = require("path");

// Se asume que el archivo tramites.json está en la carpeta 'data/' relativa al directorio raíz del proyecto
// En Netlify Functions, la ruta de la función es diferente, por eso usamos process.cwd()
// para intentar apuntar a la raíz del proyecto.
const JSON_FILE_PATH = path.join(process.cwd(), "data", "tramites.json");

function readTramites() {
  try {
    const data = fs.readFileSync(JSON_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // En un entorno de Netlify Function, si esto falla,
    // puede ser que el archivo no esté disponible o que la ruta sea incorrecta.
    console.error("Error al leer el archivo JSON:", error.message);
    // Si hay error, devuelve los trámites iniciales si puedes obtenerlos
    return [];
  }
}

function writeTramites(tramites) {
  // ESTA FUNCIÓN ES PROBABLE QUE FALLE EN NETLIFY
  // Netlify Functions se ejecutan en modo SOLO LECTURA.
  // No pueden escribir en el sistema de archivos.
  console.warn(
    "ADVERTENCIA: La escritura en el sistema de archivos fallará en el entorno de Netlify Functions."
  );
  try {
    const data = JSON.stringify(tramites, null, 2);
    // Intentamos escribir, pero sabemos que Netlify bloqueará esta operación.
    fs.writeFileSync(JSON_FILE_PATH, data, "utf8");
  } catch (error) {
    console.error("Error FATAL al escribir en el archivo JSON:", error.message);
    // En un entorno real, aquí usarías una base de datos externa.
  }
}

module.exports = {
  readTramites,
  writeTramites,
};
