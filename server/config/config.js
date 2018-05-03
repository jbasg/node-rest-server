// ======================
// Puerto
// ======================

process.env.PORT = process.env.PORT || 3000;

//=======================
// Entorno
//=======================
let urlDB;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if (process.env.NODE_ENV === 'dev'){
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;
