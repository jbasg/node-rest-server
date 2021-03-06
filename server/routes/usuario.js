const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdmin_Role } = require('../middelwares/autenticacion');

app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = Number(req.query.limite || 5);

    desde = Number(desde);
    Usuario.find({ estado: true }, 'nombre email rol estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            })

        });

})

app.post('/usuario/', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //usuarioDB.password = null;
        res.json({ ok: true, usuario: usuarioDB });
    })

})

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    //let body = req.body;

    let body = _.pick(req.body, ['nombre', 'email', 'estado', 'img', 'role', 'estado'])

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
            estado: false
        }
        //Usuario.findByIdAndRemove(id, (err, usuario) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario
        })

    })




})

module.exports = app;