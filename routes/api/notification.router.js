const {Router} = require ("express")
const mailSender = require('../../service/mail.sender.js');
const {mail}= require ("../../config/config.js")

const router = Router()

router.get("/mail", (req, res) =>{

  const resetLink = "http://localhost:8080/resetpassword"
  const timestamp = req.query.timestamp;

  if (Date.now() - timestamp > 3600000) {
    const newResetLink = "http://localhost:8080/resetpassword";
    mailSender.send(mail.GMAIL_ADDRESS, newResetLink);
    res.send("Nuevo correo de recuperación de contraseña enviado.");
  }else{

    mailSender.send(mail.GMAIL_ADDRESS, resetLink)
    res.send("Ok")

  }

})


module.exports = router