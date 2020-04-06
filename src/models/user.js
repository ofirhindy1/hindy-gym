const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a name'],
        trim:true,
        unique:true,
        minlength:3
        },
        email:{
            type:String,
            required: [true, 'Please add an email'],
            trim:true,
            // unique:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Email is invalid!')
                }
            }
        },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        trim:true,
        minlength:6
        },
        tokens:[{
            token:{
            type:String,
            required:true
}
        }]
})

UserSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email})
    
    if(!user){
        throw new Error('Unable to login')
        console.log("bot")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error ('Unable to login')
    }
    return user
}
UserSchema.methods.getSignedJwtToken = async function() {
    const user = this
    const token= jwt.sign({ _id: user._id.toString()}, 'secretismysecret')

    user.tokens = user.tokens.concat({token})
    
    return token
};
  
  // Match user entered password to hashed password in database
  UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  // Generate and hash password token
  UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };

//hash the password 
UserSchema.pre('save', async function(next){
    const user = this

    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
// userSchema.post('/users/login/:password-:email',async function(next){
//     window.location.href(publicDirectoryPath+"/home-page.html")
//     console.log("2")
//     next()
// })

const User = mongoose.model('User', UserSchema)

module.exports= User