require('dotenv').config();

const express = require('express');
const app = express();

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json())
app.use(express.urlencoded({extended: true}))


const promoCodes = {
  'BACKTOSCHOOL': 0.20,
  'STUDENT15': 0.15,
  'SUMMER15': 0.15
};

app.post('/api/validate-promo', async (req, res) => {
  const { promoCode } = req.body;

  if (promoCodes[promoCode]) {
    return res.status(200).json({
      valid: true,
      discount: promoCodes[promoCode],
    });
  } else {
    return res.status(400).json({
      valid: false,
      message: 'Invalid promo code',
    });
  }
});

app.post('/api/payment', async (req, res) => {
    const body = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: body?.amount, // Amt in cents
        currency: body?.currency,
      });
      
      if (paymentIntent?.status !== 'completed') {
        console.log('===== in');
        return res.status(200).json({
          message: "Confirm payment please",
          client_secret: paymentIntent?.client_secret,
        });
      }
  
      return res.status(200).json({ message: "Payment Completed Successfully" });
    } catch (err) {
      console.log('error: ' + err);
    }
  });
  
  app.listen(5050, () => console.log('PORT listening on 5050'));