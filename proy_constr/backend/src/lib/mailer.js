import nodemailer from "nodemailer";

const transportador = nodemailer.createTransport({
  service: "gmail", // se puede cambiar el servicio
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
}); // transporter de emails

export const enviarNotificacionEstado = async(emailDestino, nuevoEstado, motivoObservacion) => {
  const mailData = {
    from: process.env.EMAIL_USER,
    to: emailDestino,
    subject: 'Actualizacion de estado impresion 3D',
    html: `
      <h2>Hola,</h2>
      <p>El estado de tu solicitud de impresión ha cambiado a: <strong>${nuevoEstado}</strong>.</p>
      ${motivoObservacion ? `<p><strong>Mensaje del ayudante:</strong> ${motivoObservacion}</p>` : ''}
      <p>Saludos,<br>Grupo 8. Construccion de software</p>
    `
  };

  try {
    await transportador.sendMail(mailData);
    console.log("Correo enviado con exito a", emailDestino)

  } catch (error){
    console.error ("Error enviando al correo", error)
  }
}