const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Producto = require('../models/productoModel');
const _ = require('underscore');


app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let usuario = req.usuario;

    let producto = new Producto({

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario
    });


    producto.save((err, productoDB) => {

        if (err) {

            return res.status(500).json({

                ok: false,
                err
            })
        }

        if (!productoDB) {

            return res.status(400).json({

                ok: false,
                error: {
                    message: 'algo malo pasó'
                }
            })
        }


        res.json({

            ok: true,
            productoDB
        })


    })

})


app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 20;
    limite = Number(limite);

    Producto.find({ disponible: true }, 'nombre precioUni descripcion disponible')
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) {

                return res.status(500).json({

                    ok: false,
                    err
                })
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {

                res.json({

                    ok: true,
                    productos,
                    conteo
                })
            })
        })
})


app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({

                    ok: false,
                    err: {
                        message: 'El id ingresado no existe'
                    }
                })
            }

            if (!productoDB) {

                return res.status(400).json({

                    ok: false,
                    err: {
                        message: 'El id ingresado no existe'
                    }
                })
            }

            res.json({

                ok: true,
                productoDB
            })
        })
})



app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {

            return res.status(500).json({

                ok: false,
                err
            })
        }

        if (!productoDB) {

            return res.status(400).json({

                ok: false,
                err
            })
        }

        res.json({

            ok: true,
            productoDB
        })

    })

})


app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let cambiaDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoDB) => {

        if (err) {

            return res.status(500).json({

                ok: false,
                err

            })
        }

        res.json({

            ok: true,
            productoDB
        })

    })

})



// ===== BUSCAR PRODUCTOS ======

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    // para una busqueda mas flexibe se usa una expresion regular
    // 'i' para que sea insensible a mayusculas y minusculas, para que busque por palabra, etc..
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {

                return res.status(500).json({

                    ok: false,
                    err
                })
            }

            res.json({

                ok: true,
                productos
            })



        })


})
























module.exports = app;