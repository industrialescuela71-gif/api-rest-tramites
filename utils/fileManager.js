// utils/fileManager.js

const fs = require("fs");
const path = require("path");

// Define la ruta completa al archivo JSON de manera segura
const JSON_FILE_PATH = path.join(__dirname, "..", "data", "tramites.json");

/**
 * Función para leer el archivo JSON de forma síncrona.
 * @returns {Array} El array de trámites.
 */
function readTramites() {
  try {
    // Lee el contenido del archivo como una cadena de texto
    const data = fs.readFileSync(JSON_FILE_PATH, "utf8");
    // Convierte la cadena JSON en un array de objetos JavaScript
    return JSON.parse(data);
  } catch (error) {
    // Si hay un error (ej: el archivo no existe o está mal formateado),
    // devuelve un array vacío.
    console.error("Error al leer el archivo JSON:", error.message);
    return [];
  }
}

/**
 * Función para escribir el array de trámites en el archivo JSON.
 * @param {Array} tramites El array de trámites a guardar.
 */
function writeTramites(tramites) {
  try {
    // Convierte el array de objetos JavaScript de vuelta a una cadena JSON
    const data = JSON.stringify(tramites, null, 2); // 'null, 2' formatea el JSON para que sea legible
    // Escribe la cadena en el archivo, sobrescribiendo el contenido anterior
    fs.writeFileSync(JSON_FILE_PATH, data, "utf8");
  } catch (error) {
    console.error("Error al escribir en el archivo JSON:", error.message);
  }
}

module.exports = {
  readTramites,
  writeTramites,
};
