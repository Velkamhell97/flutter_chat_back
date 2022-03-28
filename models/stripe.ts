import S from 'stripe';

class Stripe {
  private stripe;

  constructor() {
    this.stripe = new S(
      process.env.STRIPE_SECRET_KEY!,
      {
        apiVersion: '2020-08-27',
        // stripeAccount: 'acct_1KgYZCGTdPdEZ8k1',
        typescript: true
      }
    );
  }


  //------------------- Customers Methods----------------------//
  async createCustomer(params: S.CustomerCreateParams) : Promise<S.Customer> {
    return await this.stripe.customers.create(params);
  }

  async createCustomerSource(customerId: string, params: S.CustomerSourceCreateParams) : Promise<S.CustomerSource> {
    return await this.stripe.customers.createSource(customerId, params);
  } 

  async updateCustomer(customerId: string, params: S.CustomerUpdateParams) : Promise<S.Customer> {
    return await this.stripe.customers.update(customerId, params);
  }

  async updateCustomerSource(customerId: string, sourceId: string, params: S.CustomerSourceUpdateParams) : Promise<S.Card | S.BankAccount | S.Source> {
    return await this.stripe.customers.updateSource(customerId, sourceId, params);
  }


  //------------------- Get Methods----------------------//
  async getCustomers(params: S.CustomerListParams) : Promise<S.ApiList<S.Customer>> {
    return await this.stripe.customers.list(params);
  }

  async getCustomerCards(customerId:string, limit:number = 10) : Promise<S.ApiList<S.CustomerSource>> {
    return await this.stripe.customers.listSources(customerId, {object: 'card', limit});
  }

  async getCustomerPaymentMethods(customerId: string) : Promise<S.ApiList<S.PaymentMethod>> {
    return await this.stripe.customers.listPaymentMethods(customerId, {type: 'card'});
  }

  async getPaymentMethod(paymentMethodId:string) : Promise<S.PaymentMethod> {
    return await this.stripe.paymentMethods.retrieve(paymentMethodId);
  }

  //------------------- Payments  Methods----------------------//
  async createPaymentIntent(params: S.PaymentIntentCreateParams) : Promise<S.PaymentIntent> {
    return await this.stripe.paymentIntents.create(params);
  }

  async createSetupIntent(params: S.SetupIntentCreateParams) : Promise<S.SetupIntent> {
    return await this.stripe.setupIntents.create(params);
  }

  async applyCharge(params: S.ChargeCreateParams) : Promise<S.Charge> {
    return await this.stripe.charges.create(params);
  }


  //------------------- Helpers  Methods----------------------//
  async createEphemeralKey(params: S.EphemeralKeyCreateParams) : Promise<S.EphemeralKey> {
    return await this.stripe.ephemeralKeys.create(params, {apiVersion: '2020-08-27'});
  }

  async confirmPaymentIntent(intentId: string, params ?: S.PaymentIntentConfirmParams) : Promise<S.PaymentIntent> {
    return await this.stripe.paymentIntents.confirm(intentId, params);
  }


  //------------------- Webhooks Methods----------------------//
  getWebhookEvent(payload: string, signature: string, secret: string) : S.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }
}

export default new Stripe();