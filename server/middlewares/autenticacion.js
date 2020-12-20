const jwt = require('jsonwebtoken');

// Verificar tokens

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {

            res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();

    })

    console.log(token);

    return token;

};


let verifica_adminRole = (req, res, next) => {

    let usuario = req.usuario;

    console.log(usuario)

    if (usuario.role === 'ADMIN_ROLE') {

        next();

    } else {

        res.status(401).json({
            ok: false,
            err: {
                message: 'No tienes los permisos necesarios'
            }
        })
    }
}


module.exports = {
    verificaToken,
    verifica_adminRole
};