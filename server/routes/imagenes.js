const express = require('express');

const { verificaToken, verificaAdmin_Role, verificaTokenImg } = require('../middelwares/autenticacion');

const fs = require('fs');
const path = require('path');
const app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    console.log(tipo, img);
    let pathImg = `./uploads/${ tipo }/${ img }`;


    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath)
    }
})






module.exports = app;