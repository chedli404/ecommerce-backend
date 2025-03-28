import express from 'express';
import User from '../models/user.js';
import Cart from '../models/cart.js';


const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) return res.status(404).json({ message: 'No users found' });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const cart = new Cart({ userId: user._id });
        await cart.save();
        res.status(201).json({ user, cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await Cart.findOneAndDelete({ user: user._id });
        await user.remove()
        res.status(200).json({ message: 'User and Cart deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

