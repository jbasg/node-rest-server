const express = require('express');
const { verificaToken ,verificaAdmin_Role} = require('../middelwares/autenticacion');


const app = express();


let Categoria = require('../models/categoria');

app.get('/categoria',verificaToken,(req,res)=>{

  let desde = req.query.desde || 0;
  let limite = Number(req.query.limite || 5);

  desde = Number(desde);
  Categoria.find({})
      .sort('descripcion')
      .populate('usuario','nombre email')
      .skip(desde)
      .limit(limite)
      .exec((err, categorias) => {
          if (err) {
              return res.status(400).json({
                  ok: false,
                  err
              })
          }

          Categoria.count({}, (err, conteo) => {
              res.json({
                  ok: true,
                  categorias,
                  conteo
              })
          })

      });

})

app.get('/categoria/:id',verificaToken,(req,res)=>{
  let id = req.params.id;
  Categoria.findById(id)
    .exec((err,categoriaDB)=>{
      if (err) {
        return res.status(500).json({
            ok: false,
            err
        })
      }
      if (!categoriaDB) {
        return res.status(400).json({
            ok: false,
            err : {
              message : 'No existe la categoria'
            }
        })
      }
      res.json({
        ok : true,
        categoriaDB
      })
    })
})

app.post('/categoria',verificaToken,(req,res)=>{

  let body = req.body;

  let categoria = new Categoria({
    descripcion : body.descripcion,
    usuario : req.usuario._id
  })

  categoria.save(( err,categoriaDB )=>{
    if (err) {
      return res.status(500).json({
          ok: false,
          err
      })
    }
    if (!categoriaDB) {
      return res.status(400).json({
          ok: false,
          err
      })
    }

    res.json({
      ok: true,
      categoria : categoriaDB
    })
  });
})


app.put('/categoria/:id',(req,res)=>{
  let id = req.params.id;
  let body = req.body;

  let descCategoria = {
    descripcion : body.descripcion
  }
  Categoria.findByIdAndUpdate(id,
    descCategoria,
    {new : true,runValidators:true},
    (err,categoriaDB)=>{
      if (err) {
        return res.status(500).json({
            ok: false,
            err
        })
      }
      if (!categoriaDB) {
        return res.status(400).json({
            ok: false,
            err
        })
      }
  
      res.json({
        ok: true,
        categoria : categoriaDB
      })

    })

})


app.delete('/categoria/:id',[verificaToken,verificaAdmin_Role],(req,res)=>{
  let id = req.params.id;
  Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{
    if (err) {
      return res.status(500).json({
          ok: false,
          err
      })
    }
    if (!categoriaDB) {
      return res.status(400).json({
          ok: false,
          err : {
            message : 'el id no existe'
          }
      })
    }

    res.json({
      ok : true,
      message : 'Categoria borrada'
    })

  })
})

module.exports = app;