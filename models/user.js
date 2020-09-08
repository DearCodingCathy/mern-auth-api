const mongoose = require('mongoose')
const crypto = require('crypto')
const { timeStamp } = require('console')
// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },

  hashed_password: {
    type: String,
    required: true
  },

  // salt will define how stron the hash will be
  salt: String,

  role: {
    type: String,
    default: 'subscriber'
  },

  resetPasswordLink: {
    data: String,
    default: ''
  },

}, { timestamps: true })

// timestamp will always be available ^

// virtual - take password as input and hash it

userSchema.virtual('password')
  // do not use arrow function here
  .set(function (password) {
    this._password = password 
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return timeStamp._password
  })



// methods for makeSalt and encryptPassword

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto.createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    
    } catch (error) {
      return ''
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  }
};

module.exports = mongoose.model('User', userSchema)