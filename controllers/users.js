const {UnprocessableEntity,Forbidden,NotFound,Unauthorized} = require('http-errors')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const signup = async(req,res,next)=>{
  try{
    console.log(req.body)
    const {name,email,password, phonenumber, gender} = req.body
    if(!name || !email || !password || !phonenumber || !gender) throw UnprocessableEntity('Please provide a valid name,email and password')
    if(await User.findOne({email:email})) throw Forbidden('This email is already registered')
    const user = {
      name:name,
      email:email,
      password:password,
      gender:gender,
      phonenumber:phonenumber
    }
    res.json({success:true,data: await User.create(user)})
  }catch(err){
    console.log(err);
    next(err)
  }
}

const login = async(req, res, next)=>{
  try{
    console.log(req.body)
    const {email,password} = req.body
    if(!email || !password) throw UnprocessableEntity('Please provide email and password')
    const user = await User.findOne({email:email})
    if(!user) throw NotFound('This user does not exist')
    const valid = await bcrypt.compare(password,user.password)
    if(!valid) throw Unauthorized('Please provide a valid email and password')
    const userInfo = {
      id:user._id,
    }
    req.session.user = userInfo
    res.json({success:true})
  }catch(err){
    next(err)
  }
}

const logout = async(req,res,next)=>{
  try{
    req.session.destroy()
    res.json({success:true})
  }catch(err){
    next(err)
  }
}

const updateUser = async(req,res,next)=>{
  try{
    if(!req.params.id ) throw BadRequest('No User_id found')
    const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body,{new:true})
    if(!updatedUser) throw NotFound('Invalid user id or request body keys')
    res.json({success:true,data:updatedUser})
  }catch(err){
    next(err)
  }
}






module.exports = {signup,login,logout,updateUser}