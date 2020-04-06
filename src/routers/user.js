const express = require('express')
const User = require('../models/user')
const path = require('path')
const auth = require('../middleware/auth')
const router = new express.Router()
// const Window = require('window')
const {sendWelcomeEmail,meetingSent} = require('../emails/account')
const publicDirectoryPath = path.join(__dirname, '../../public')
// const window = new Window()
console.log(publicDirectoryPath)

//create a user
router.post('/register', (req,res)=>{
    console.log("test")
    const user = new User (req.body)
    console.log(user)
    const token = user.getSignedJwtToken()
    user.save().then(()=>{
        // res.status(201).send(user)
        sendWelcomeEmail(user.email, user.username)
        // res.sendFile(path.join(publicDirectoryPath, '/home-page.html'))
        res.status(300).send(user)


    }).catch((e)=>{
        res.status(401).send(e)
        // res.status(400).sendFile(path.join(publicDirectoryPath, '/notfound.html'))
    })
})
//logOut user
router.post('/users/logout',auth,async(req,res)=>{
    console.log("rew")
    console.log(req.token)
     try{
        req.user.tokens = 
        req.user.tokens.filter((token)=>{
            if(token.token !== req.token){
                return token.token
            }

        })
        console.log("test 22")
        await req.user.save()
        
        res.send()
     }catch(e){
        res.status(500).send()
     }
})
//login user
router.post('/users/login', async (req,res)=>{

    console.log(req.body)
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.getSignedJwtToken()
        // res.send(user)
        user.save().then(()=>{
            // res.status(201).send(user)

            // res.send({user, token})
            res.status(400).sendFile(path.join(publicDirectoryPath, '/notfound.html'))
        }).catch((e)=>{
            res.status(403).send(e)
        })
        

    }catch(e){
        res.status(400).sendFile(path.join(publicDirectoryPath, '/notfound.html'))
    }

})
router.get('/thank',(req,res)=>{
    meetingSent(req.query.email,req.query.date,req.query.comment,req.query.group )
    res.status(400).sendFile(path.join(publicDirectoryPath, '/thankyou.html'))

})
router.get('',(req,res)=>{
    res.status(400).sendFile(path.join(publicDirectoryPath, '/thankyou.html'))

})
//get all the users
router.get('/users',auth, (req,res)=>{
    console.log(req.session)
    User.find({}).then((users)=>{
        res.status(200).send(users)
            // console.log(req.body)

    }).catch((e)=>{
        res.status(500).send(e)
    })
})

//get a user by id
router.get('/users/:id',(req,res)=>{
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
            return res.status(404).send()
        }

        res.send(user)
  
  
}).catch((e)=>{
    res.status(500).send(e)
})
})

module.exports = router