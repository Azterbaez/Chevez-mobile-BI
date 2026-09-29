const express = require('express');

const router = express.Router();

const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categoria.controller');


// Crear categoría
router.post('/', crearCategoria);

// Obtener todas las categorías
router.get('/', obtenerCategorias);

// Obtener categoría por ID
router.get('/:id', obtenerCategoriaPorId);

// Actualizar categoría
router.put('/:id', actualizarCategoria);

// Eliminar categoría
router.delete('/:id', eliminarCategoria);


module.exports = router;