import express from 'express'
import User from '../models/user.js'
import {OAuth2Client} from 'google-auth-library'

const router = express.Router()
const client = new OAuth2Client('414739204309-6tg5ljlcn2d0oofgb51sulcrere6u44h.apps.googleusercontent.com')

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

router.post('/google-login', async (req, res) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: '414739204309-6tg5ljlcn2d0oofgb51sulcrere6u44h.apps.googleusercontent.com'
        });
        const payload = ticket.getPayload();
        const user = await User.findOne({email: payload.email});
        if(!user){
            const newUser = new User({
                name: payload.name,
                email: payload.email,
                password: payload.sub
            });
            await newUser.save();
            return res.status(201).json(newUser);
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message: err.message})
        console.log('Google login error:', error);
    }
})

router.post('register/google', async (req, res) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: '414739204309-6tg5ljlcn2d0oofgb51sulcrere6u44h.apps.googleusercontent.com'
        });
        const payload = ticket.getPayload();
        const user = await User.findOne({email: payload.email});
        if(!user){
            const newUser = new User({
                name: payload.name,
                email: payload.email,
                password: payload.sub
            });
            await newUser.save();
            return res.status(201).json(newUser);
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message: err.message})
    }
})






export default router;
