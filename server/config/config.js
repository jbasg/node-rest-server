// ======================
// Puerto
// ======================

process.env.PORT = process.env.PORT || 3000;

//=======================
// Entorno
//=======================
let urlDB;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if (process.env.NODE_ENV === 'dev3'){
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = 'mongodb://cafeuser:123456@ds115799.mlab.com:15799/cafe'
}

process.env.URLDB = urlDB;
