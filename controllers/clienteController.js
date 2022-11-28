import dbKnex from '../dados/db_config.js'
import bcrypt from 'bcrypt';

const saltRounds = 8;

export const clienteIndex = async (req, res) => {
  try {
   
    const vendedores = await dbKnex.select("*").from("clientes").orderBy("nome")
    res.status(200).json(vendedores)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}



export const clienteDelete = async (req, res) => {

    const { id } = req.params;
  
  
    try {
      await dbKnex("clientes").where({ id }).del()
      res.status(200).json({ id, msg: "Excluído com sucesso" })
    } catch (error) {
      res.status(400).json({ id: 0, msg: "Erro: " + error.message })
    }
  }
  




export const clienteStore = async (req, res) => {
    // atribui via desestruturação
    const { nome, email, senha } = req.body
  
    if (!nome || !email || !senha) {
      res.status(400).json({ id: 0, msg: "Erro... informe nome, email e senha" })
      return
    }
  

    if (senha.length < 6) {
      res.status(400).json({ id: 0, msg: "Erro... a senha deve conter pelo menos 6 caracteres" })
      return
    }
  
    
    let pequenas = 0
    let grandes = 0
    let numeros = 0
    let simbolos = 0
  

  
   
    for (const letra of senha) {
      if ((/[a-z]/).test(letra)) {
        pequenas++
      }
      else if ((/[A-Z]/).test(letra)) {
        grandes++
      }
      else if ((/[0-9]/).test(letra)) {
        numeros++
      } else {
        simbolos++
      }
    }
  
    if (pequenas == 0 || grandes == 0 || numeros == 0 || simbolos == 0) {
      res.status(400).json({ id: 0, msg: "Erro... senha deve possuir letras minúsculas, maiúsculas, números e símbolos" })
      return
    }
  
    const salt = bcrypt.genSaltSync(saltRounds);
    // console.log(salt)
  
    const hash = bcrypt.hashSync(senha, salt);
    // console.log(hash)
  
    try {
      const novo = await dbKnex('clientes')
        .insert({ nome, email, senha: hash })
                      
      res.status(201).json({ id: novo[0], msg: "Ok! Inserido com sucesso" })
    } catch (error) {
      res.status(400).json({ id: 0, msg: "Erro: " + error.message })
    }
  }


  
  async function send_email(nome, email, hash) {

    let transporter = nodemailer.createTransport({
      host: "smtp://smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "1a7adf5e5588c7:ff2bf70f4ee08a",
        pass: "f57ff7290777b4"
      }
    });
  
    const urlConfirmacao = "http://localhost:3001/clientes/confirma/"+hash
  
    let mensa = "<h3>Confirmacao de conta</h3>"
    mensa += "<p>Por favor, confirme seu cadastro clicando no link:</p>"
    mensa += `<a href=${urlConfirmacao}>Confirmar Voto</a>`
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fenadoce 2023" <BrechoAvenida@senac.com>', 
      to: email, 
      subject: "Confirmação de cadastro", 
      text: `Para confirmar o cadastro, copie e cole o link:\n${urlConfirmacao}`, 
      html: mensa, 
    });
  
  }
  
