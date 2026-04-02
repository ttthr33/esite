const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 PUT YOUR STRIPE SECRET KEY HERE
const stripe = Stripe();

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { cart } = req.body;

    const line_items = cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: 'https://your-site.com/success',
      cancel_url: 'https://your-site.com/cancel',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating checkout');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));