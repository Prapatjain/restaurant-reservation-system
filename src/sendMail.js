const { name } = require("ejs");
const path = require('path');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "prapat.trade@gmail.com", // 
      pass: "qojv ttma wzbh jwze",   // enter google generated less secure app password
    },
  });


  const mailOptions = {
    from: {
        name: 'TableShare',
        address:"prapat.trade@gmail.com"
    }, // sender address
    to: "prapat.jain_cs21@gla.ac.in", // list of receivers
    subject: "TABLESHARE: confirmation email of booking!", // Subject line
    text: "Hello world?", // plain text body
    html: "<h1>Hey! Welcome to TableShare.</h1><br><h3>Your seat has been booked!</h3>",
    attachments:[
        {
          filename:'tableshare.png',
          path: path.join('./assets/tableshare.png'),
          contentType:'image/png'
        },
        // {
        //     filename:"globalLogic.pdf",
        //     // path:'./assets/globalLogic.pdf',
        //     path: path.join('./assets/globalLogic.pdf'),
        //     contentType:'application/pdf'
        // },
        {
            filename:'facilities.jpg',
            path: path.join('./assets/about-2.jpg'),
            contentType:'image/jpg'
        }
    ] // html body
  }

  const sendMail = async(transporter,mailOptions)=>{
    try{
        await transporter.sendMail(mailOptions);
        console.log("email has been sent!")
    }
    catch(error){
        console.error(error , 'error in sending mail');
    }
  }

  // sendMail(transporter,mailOptions);

//   const adminData=new mongoose.model("admin",adminSchema);
// module.exports= adminData;

var mailreq = sendMail(transporter,mailOptions);
module.exports = mailreq;