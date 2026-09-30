// controllers/categoria.controller.js

const db = require('../config/db');

// POST - Crear una categoría
const crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        // Validaciones
        if (!nombre || !descripcion) {
            return res.status(400).json({
                mensaje: 'El nombre y la descripción son obligatorios'
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO categorias (nombre, descripcion)
             VALUES (?, ?)`,
            [nombre, descripcion]
        );

        res.status(201).json({
            mensaje: 'Categoría creada correctamente',
            categoria: {
                categoriaId: resultado.insertId,
                nombre,
                descripcion
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear la categoría',
            error: error.message
        });
    }
};


// GET - Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
    try {
        const [categorias] = await db.query(
            'SELECT * FROM categorias'
        );

        res.status(200).json(categorias);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener las categorías',
            error: error.message
        });
    }
};


// GET - Obtener una categoría por ID
const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [categorias] = await db.query(
            'SELECT * FROM categorias WHERE categoriaId = ?',
            [id]
        );

        if (categorias.length === 0) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        res.status(200).json(categorias[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener la categoría',
            error: error.message
        });
    }
};


// PUT - Actualizar categoría
const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        if (!nombre || !descripcion) {
            return res.status(400).json({
                mensaje: 'El nombre y la descripción son obligatorios'
            });
        }

        const [resultado] = await db.query(
            `UPDATE categorias
             SET nombre = ?, descripcion = ?
             WHERE categoriaId = ?`,
            [nombre, descripcion, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            mensaje: 'Categoría actualizada correctamente'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar la categoría',
            error: error.message
        });
    }
};


// DELETE - Eliminar categoría
const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query(
            'DELETE FROM categorias WHERE categoriaId = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            mensaje: 'Categoría eliminada correctamente'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar la categoría',
            error: error.message
        });
    }
};


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria
};

