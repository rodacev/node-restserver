//=================
//puerto
//=================

process.env.PORT = process.env.PORT || 3000;


//================
//entorno
//================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//================
//Vencimiento de token
//================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//================
//Seed de autenticacion
//================


process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'


//=================
//base de datos
//=================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.mongo_uri;
}


process.env.URLDB = urlDB;


//=================
//Google Client ID
//=================

process.env.CLIENT_ID = process.env.CLIENT_ID || '908470435742-t66ss4oiktbbdhitiplu2ssma7fe29v1.apps.googleusercontent.com';