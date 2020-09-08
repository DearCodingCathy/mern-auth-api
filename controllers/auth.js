const User = require('../models/user');
const jwt = require('jsonwebtoken');

//sendgrid
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//The method below works fine, but is subjectable to a lot of junk users;

// exports.signup = (req, res) => {
//   // console.log('REQ BODY ON SIGNUP', req.body);
  
//   const { name, email, password } = req.body
  
//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: 'That email is already in use'
//       })
//     }
//   })

//   let newUser = new User({ name, email, password })
//   newUser.save((error, success) => {
//     if (error) {
//       console.log('SIGNUP ERROR', err)
//       return res.status(400).json({
//         error: error
//       });
//     }
//     res.json({
//       message: 'Signup success! Please Signin'
//     })
//   })
// };

exports.signup = (req, res) => {
  const { name, email, password } = req.body
  
    User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'That email is already in use'
      });
    }
      
      const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' })
      
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email, 
        subject: `Account activation link`,
        html: `
        <h1>Please use th following link to activate your account</h1>
        <p>${process.env.CLIENT_URL}/auth/activate</p>
        <hr />
        <p>This email may contain sensetive information</p>
        <p>${process.env.CLIENT_URL}</p>
        `
      }
      sgMail.send(emailData).then(sent => {
        console.log('SIGNUP EMAIL SENT, sent')
        return res.json({
          message: `Email has been sent to ${email}. Follow the instructions to activate your account`
        });
      });
  });
};