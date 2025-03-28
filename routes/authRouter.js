import express from 'express'
import User from '../models/user.js'

const router = express.Router()

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email : req.body.email, password: req.body.password});
        if(!user) return res.status(401).json({message: 'Invalid credatials'});
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

export default router;