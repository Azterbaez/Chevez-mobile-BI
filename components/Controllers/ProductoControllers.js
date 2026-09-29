
import db from "../firebase.js";
import supabase from "../supabase.js";

export const registrarProducto = async (req, res) => {
  try {
    const {
      productoId,
      nombre,
      descripcion,
      precio,
      categoriaId,
    } = req.body || {};

    const imagen = req.file;

    // Validar campos obligatorios
    if (
      !productoId ||
      !nombre ||
      !descripcion ||
      !precio ||
      !categoriaId
    ) {
      return res.status(400).json({
        mensaje:
          "Todos los campos son obligatorios: productoId, nombre, descripcion, precio y categoriaId.",
      });
    }

    // Validar imagen
    if (!imagen) {
      return res.status(400).json({
        mensaje: "La imagen del producto es obligatoria.",
      });
    }

    // Validar que sea una imagen
    if (!imagen.mimetype.startsWith("image/")) {
      return res.status(400).json({
        mensaje: "El archivo debe ser una imagen.",
      });
    }

    // Obtener extensión de la imagen
    const extension = imagen.originalname
      .split(".")
      .pop()
      .toLowerCase();

    // Crear nombre único para la imagen
    const nombreArchivo = `producto-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`;

    // Ruta donde se almacenará la imagen
    const rutaImagen = `productos/${nombreArchivo}`;

    // Subir imagen a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("imagenes_productos")
      .upload(rutaImagen, imagen.buffer, {
        contentType: imagen.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error al subir imagen:", uploadError);

      return res.status(500).json({
        mensaje: "Error al subir la imagen a Supabase.",
        error: uploadError.message,
      });
    }

    // Obtener URL pública de la imagen
    const { data: publicUrlData } = supabase.storage
      .from("imagenes_productos")
      .getPublicUrl(rutaImagen);

    const imagenUrl = publicUrlData.publicUrl;

    // Registrar producto en Firebase
    const docRef = await db.collection("productos").add({
      productoId,
      nombre,
      descripcion,
      precio: Number(precio),
      imagen: imagenUrl,
      categoriaId,
      fecha: new Date().toISOString(),
    });

    // Respuesta
    res.status(201).json({
      mensaje: `¡Producto registrado con éxito! ID: ${productoId} | Nombre: ${nombre} | Precio: C$${precio} | Categoría: ${categoriaId}`,
      id: docRef.id,
      productoId,
      nombre,
      descripcion,
      precio: Number(precio),
      imagen: imagenUrl,
      categoriaId,
    });

  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      mensaje: "Error al registrar el producto.",
      error: error.message,
    });
    
  }  

};

