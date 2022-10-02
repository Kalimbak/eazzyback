const {UnprocessableEntity,Forbidden,NotFound,Unauthorized} = require('http-errors')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const signup = async(req,res,next)=>{
  try{
    console.log(req.body)
    const {name,email,password, gender, phonenumber} = req.body
    if(!name || !email || !password || !gender || !phonenumber) throw UnprocessableEntity('Please provide a valid name,email and password')
    if(await User.findOne({password:password})) throw Forbidden('This email is already registered')
    const user = {
      name:name,
      email:email,
      password:password,
      gender:gender,
      phonenumber:phonenumber
    }
    res.json({success:true,data: await User.create(user)})
  }catch(err){
    next(err)
  }
}
const register = async(req,res,next)=>{
  try{
    console.log(req.body)
    const {email,password} = req.body
    if(!email || !password) throw UnprocessableEntity('Please provide a valid name,email and password')
    if(await User.findOne({password:password})) throw Forbidden('This password  is already registered')
    const user = {
    
      email:email,
      password:password,

    }
    res.json({success:true,data: await User.create(user)})
  }catch(err){
    next(err)
  }
}

const login = async(req, res, next)=>{
  try{
    console.log(req.body)
    const {email,password} = req.body
    if(!email || !password) throw UnprocessableEntity('Please provide email and password')
    const user = await User.findOne({email:email})
    if(!user) alert ("user not found")

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
    if(!req.body.email ) throw BadRequest('No User_id found')
    const updatedUser = await User.findByIdAndUpdate(req.body.email,req.body,{new:true})
    if(!updatedUser) throw NotFound('Invalid user id or request body keys')
    res.json({success:true,data:updatedUser})
  }catch(err){
    next(err)
  }
}

 const getUsers = async(req, res) => {
  try {
      const allUsers = await User.findAll({})
      res.status(200).json({
          message: "users retrieved",
          result:allUsers
      })
  } catch (error) {
      res.status(500).json({
          message: error
      })
  }
}



module.exports = {register, getUsers , signup,login,logout,updateUser}