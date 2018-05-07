const express = require('express');
const fileUpload = require('express-fileupload');

const { verificaToken, verificaAdmin_Role } = require('../middelwares/autenticacion');

const fs = require('fs');
const path = require('path');


const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

const app = express();
app.use(fileUpload());



app.put('/upload/:tipo/:id', (req, res) => {


    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                message: 'No es un tipo valido',
                tipo
            })
    }

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'svg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                message: 'La extension del fichero no está permitida'
            })

    }

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extension}`;


    archivo.mv(`./uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'error en el sistema de archivos',
                    err

                }
            })
        }

        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchivo)
                break;
        }


        /*
        res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        })
*/
    })


});


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                err: false,
                err
            })
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                err: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        /*
                let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${ usuarioDB.img }`);

                if (fs.existsSync(pathImagen)) {
                    fs.unlinkSync(pathImagen);
                }
        */
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    err: false,
                    err
                })
            }
            res.json({
                ok: true,
                ususario: usuarioGuardado,
                img: nombreArchivo
            })

        })

    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                err: false,
                err
            })
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                err: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    err: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })

        })

    })

}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}


module.exports = app;