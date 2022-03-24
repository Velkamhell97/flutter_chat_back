import StripeInstance from 'stripe';

class Stripe {
  private stripe;

  constructor() {
    this.stripe = new StripeInstance(
      process.env.STRIPE_SECRET_KEY!,
      {
        apiVersion: '2020-08-27',
        typescript: true
      }
    );

  }

  init() {

  }
}