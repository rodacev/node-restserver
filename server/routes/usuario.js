const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore'); // _ por convencion

const Usuario = require('../models/usuarioModel');

const { verificaToken, verifica_adminRole } = require('../middlewares/autenticacion');

const app = express();



app.get('/usuario', verificaToken, (req, res) => {

    //retornando los datos del usuario según su token verificado
    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // })


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 100;
    limite = Number(limite);

    // filtrando solo los estado true
    Usuario.find({ estado: true }, 'nombre email estado role') // puedo filtrar por lo que quiero ver de cada documento
        .skip(desde)
        .limit(limite) // paginar de a 5 registros
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            // contando solo los estado true
            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios: usuarios,
                    conteo
                })
            })

        })
})

app.post('/usuario', [verificaToken, verifica_adminRole], (req, res) => {

    let body = req.body;

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
                err: err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

})

app.put('/usuario/:id', [verificaToken, verifica_adminRole], (req, res) => {

    let id = req.params.id;
    // let body = req.body;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    // PARA NO ACTUALIZAR OBJETOS ESPECIFICOS SE PUEDE REEMPLAZAR CON LA LIBRERIA UNDERSCORE
    // delete body.password;
    // delete body.google;

    // {new:true} para que se vean los cambios en el json
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })


})

app.delete('/usuario/:id', [verificaToken, verifica_adminRole], (req, res) => {
    //res.json('delete usuario');

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    // NO LO ELIMINO, SOLO CAMBIO SU PROPIEDAD ESTADO A FALSE
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            usuarioDB
        })

    })

    // Usuario.findByIdAndRemove(id, (err, usuarioDB) => {

    //     if (err) {

    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         usuarioDB
    //     })

    // })

})


module.exports = app;