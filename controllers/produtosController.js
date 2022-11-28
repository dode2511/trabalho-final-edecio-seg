import dbKnex from '../dados/db_config.js'
import ejs from 'ejs'
import puppeteer from 'puppeteer'

export const produtosIndex = async (req, res) => {
  try {
    const produtos = await dbKnex.select("*").from("produtos")
    res.status(200).json(produtos)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

export const produtoUpdate = async (req, res) => {
  
  const { id } = req.params;

  const { marca, modelo, preco ,foto} = req.body

  if (!marca || !modelo || !preco || !foto) {
    res.status(400).json(
      {
        id: 0,
        msg: "Erro... informe marca, modelo,foto e preco do produto"
      })
    return
  }

  try {
    await dbKnex("produtos").where({ id })
      .update({ marca, modelo, preco,foto })

    res.status(200).json({ id, msg: "Ok! Alterado com sucesso" })
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }

}

export const produtoDelete = async (req, res) => {

  const { id } = req.params;


  try {
    await dbKnex("produtos").where({ id }).del()
    res.status(200).json({ id, msg: "Excluído com sucesso" })
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}


export const produtoPesq = async (req, res) => {

  const { preco } = req.params

  try {

    const produtos = await dbKnex("produtos").where('preco', '>=', preco)
    res.status(200).json(produtos)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

export const produtosPorMarca = async (req, res) => {
  try {
    
    const pesq = await dbKnex("produtos").select("marca")
          .count({num: "*"}).groupBy("marca")
    res.status(200).json(pesq)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

export const produtoqtdEstoque = async (req, res) => {
  try {
 
    const consulta = await dbKnex("produtos")
           .select("modelo", "qtdEstoque")
           .orderBy("qtdEstoque", "desc")
           .limit(5)
    res.status(200).json(consulta)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}





export const produtoStore = async (req, res) => {

  
  console.log(req.file.originalname);
  console.log(req.file.filename);
  console.log(req.file.mimetype);
  console.log(req.file.size);

  const fotos = req.file.path; 

  if ((req.file.mimetype != "image/jpeg" && req.file.mimetype != "image/png") || req.file.size > 1024 * 1024) {
    fs.unlinkSync(foto); 
    res
      .status(400)
      .json({ msg: "Formato inválido da imagem ou imagem muito grande" });
    return;
  }

  // atribui via desestruturação
  const { marca, modelo, cor , loja_id,preco,qtdEstoque } = req.body

  // se não informou estes atributos
  if (!marca || !modelo || !cor || !fotos || !loja_id|| !preco || !qtdEstoque) {
    res.status(400).json({ id: 0, msg: "Erro... informe modelo, cor, marca, loja_id,foto,quantidade em estoque e preco do produto" })
    return
  }

  try {
    const novo = await dbKnex('produtos').insert({ marca, modelo, cor, fotos, vendedor_id,preco,qtdEstoque })
                  
    res.status(201).json({ id: novo[0], msg: "Ok! Inserido com sucesso" })
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}


export const produtoLista = async (req, res) => {
  try {
    
    const produtos = await dbKnex.select("*", "modelo")
                              .from("produtos")
                             

    ejs.renderFile('views/listaProdutos.ejs', {produtos}, (err, html) => {
      if (err) {
        return res.status(400).send("Erro na geração da página")
      }
      res.status(200).send(html)                              
    });
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}


export const produtoPdf = async(req, res) => {
  
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
   
    await page.goto('http://localhost:3001/produtos/lista');
  
    await page.waitForNetworkIdle(0)
  
    
    const pdf = await page.pdf({
      printBackground: true,
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    })
  
    await browser.close();
  
    
    res.contentType('application/pdf')
  
    res.status(200).send(pdf)
  }

