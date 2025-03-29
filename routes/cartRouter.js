import express from 'express';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
const router = express.Router();

// Helper middleware to get cart and product
const getCartAndProduct = async (cartId, productId) => {
  const cart = await Cart.findById(cartId);
  if (!cart) throw new Error('Cart not found');
  
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');
  
  return { cart, product };
};

// Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    
    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({
        userId: req.params.userId,
        items: [],
        totalPrice: 0
      });
      await cart.save();
    }
    
    res.status(200).json(cart);
  } catch (err) {
    console.error('Error getting cart:', err);
    res.status(500).json({ message: err.message });
  }
});

// Empty cart
router.put('/empty/:id', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    
    res.status(200).json({ message: 'Cart emptied', cart });
  } catch (err) {
    console.error('Error emptying cart:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add product to cart
router.put('/:id/add-product/:prodId', async (req, res) => {
  try {
    const { id: cartId, prodId } = req.params;
    const { cart, product } = await getCartAndProduct(cartId, prodId);

    const existingItem = cart.items.find(item => 
      item.productId.toString() === product._id.toString()
    );

    if (existingItem) {
      cart.items = cart.items.map(item => 
        item.productId.toString() === product._id.toString()
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      cart.items.push({ productId: product._id, quantity: 1 });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (product.price * item.quantity);
    }, 0);

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: err.message });
  }
});

// Remove product from cart
router.put('/:id/remove-product/:prodId', async (req, res) => {
  try {
    const { id: cartId, prodId } = req.params;
    const { cart, product } = await getCartAndProduct(cartId, prodId);

    cart.items = cart.items.filter(
      item => item.productId.toString() !== product._id.toString()
    );

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (product.price * item.quantity);
    }, 0);

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (err) {
    console.error('Error removing product:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update product quantity
router.put('/:id/update-quantity/:prodId', async (req, res) => {
  try {
    const { id: cartId, prodId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const { cart, product } = await getCartAndProduct(cartId, prodId);

    cart.items = cart.items.map(item => 
      item.productId.toString() === product._id.toString()
        ? { ...item, quantity }
        : item
    );

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (product.price * item.quantity);
    }, 0);

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (err) {
    console.error('Error updating quantity:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
