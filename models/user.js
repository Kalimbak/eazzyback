const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  gender: { type: String },
  phonenumber: { type: String },

});

userSchema.pre('save',async function(next){
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(this.password,salt)
  this.password = hash
})

module.exports = mongoose.model('User', userSchema);
