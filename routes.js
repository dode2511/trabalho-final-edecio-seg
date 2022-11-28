import { Router, json } from 'express'
import cors from 'cors'

import {  produtoDelete, produtoLista, produtoPdf, produtoPesq, produtoqtdEstoque, produtosIndex, produtosPorMarca, produtoUpdate } from './controllers/produtosController.js'
import { clienteDelete, clienteIndex, clienteStore } from './controllers/clienteController.js'
import { lojaDelete, lojasIndex, lojaUpdate } from './controllers/lojasControllers.js'

import upload from './middlewares/FotoStore.js'
//import  verificaLogin from './middlewares/VerificaLogin.js'
import { loginCliente } from './controllers/loginClienteController.js'

const router = Router()


router.use(json())

router.use(cors())


router.get('/produtos', produtosIndex)
      .post('/produtos', upload.single('fotos'), produtoUpdate)
      .put('/produtos/:id', produtoUpdate)
      .delete(`/produtos/:id`, produtoDelete)
      .get('/produtos/pesq/:preco', produtoPesq)
      .get('/produtos/marca', produtosPorMarca)
      .get('/produtos/estoque', produtoqtdEstoque)
      .get('/produtos/lista', produtoLista)
      .get('/produtos/pdf', produtoPdf)

     router.get('/clientes', clienteIndex)
          .post('/clientes', clienteStore)
          .delete(`/produtos/:id`, clienteDelete)


     router.get('/lojas', lojasIndex)
          .delete('/lojas', lojaDelete)
          .put('/produtos/:id', lojaUpdate)

   
     router.get('/login', loginCliente)





export default router