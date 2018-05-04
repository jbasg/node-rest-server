// ======================
// Puerto
// ======================

process.env.PORT = process.env.PORT || 3000;


//=======================
// Entorno
//=======================
let urlDB;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=======================
// Vencimiento del token
//=======================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 * 1000



//=======================
// SEED del token
//=======================

process.env.SEED = process.env.SEED || 'este-texto-es-el-seed'


//=======================
// Mongo DB
//=======================


if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;