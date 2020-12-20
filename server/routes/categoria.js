const express = require('express');
const { verificaToken, verifica_adminRole } = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoriaModel');
const _ = require('underscore');


app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 20;
    limite = Number(limite);

    Categoria.find({}, 'usuario nombre estado')
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }


            Categoria.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    categorias,
                    conteo

                });

            });
        });
});


app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {

            res.status(400).json({

                ok: false,
                err: {
                    message: 'No existe esta categoria'
                }
            })
        }

        res.json({

            ok: true,
            categoriaDB
        })

    })

})


app.post('/categoria', [verificaToken, verifica_adminRole], (req, res) => {

    let body = req.body;

    let usuario = req.usuario._id;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });
});


app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'estado']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {

            return res.status(400).json({

                ok: false,
                err
            })
        }

        res.json({

            ok: true,
            categoriaDB
        })

    });

});


app.delete('/categoria/:id', [verificaToken, verifica_adminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, { new: true }, (err, categoriaDB) => {

        if (err) {

            res.status(400).json({

                ok: false,
                err
            })
        }

        res.json({

            ok: true,
            categoriaDB,
            eliminado: true
        })

    })

})





// 1 listar categorias
// 2 buscar categoria por id
// 3 crear nueva categoria
// 4 actualizar categoria por id
// 5 eliminar categoria ---> solo un ADMIN_ROLE puede eliminar














module.exports = app;