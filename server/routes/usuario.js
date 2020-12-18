const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore'); // _ por convencion

const Usuario = require('../models/usuarioModel');

const app = express();



app.get('/usuario', (req, res) => {
    //res.json('get usuario LOCAL');

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // filtrando solo los estado true
    Usuario.find({ estado: true }, 'nombre email estado') // puedo filtrar por lo que quiero ver de cada documento
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

app.post('/usuario', (req, res) => {

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

app.put('/usuario/:id', (req, res) => {

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

app.delete('/usuario/:id', (req, res) => {
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