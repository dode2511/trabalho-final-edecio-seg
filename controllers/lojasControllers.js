import dbKnex from '../dados/db_config.js'


export const lojasIndex = async (req, res) => {
  try {
   
    const vendedores = await dbKnex.select("*").from("lojas").orderBy("nome")
    res.status(200).json(vendedores)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}



export const lojaDelete = async (req, res) => {

    const { id } = req.params;
  
  
    try {
      await dbKnex("lojas").where({ id }).del()
      res.status(200).json({ id, msg: "Excluído com sucesso" })
    } catch (error) {
      res.status(400).json({ id: 0, msg: "Erro: " + error.message })
    }
  }

  
export const lojaUpdate = async (req, res) => {
  
    const { id } = req.params;
  
    const { CEP, cidade, nome,rua,numero } = req.body
  
    if (!CEP || !cidade || !rua || !nome || !numero) {
      res.status(400).json(
        {
          id: 0,
          msg: "Erro... informe nome, cidade,rua,numero  e CEP da loja"
        })
      return
    }
  
    try {
      await dbKnex("produtos").where({ id })
        .update({ marca, modelo, preco })
  
      res.status(200).json({ id, msg: "Ok! Alterado com sucesso" })
    } catch (error) {
      res.status(400).json({ id: 0, msg: "Erro: " + error.message })
    }
  
  }
  