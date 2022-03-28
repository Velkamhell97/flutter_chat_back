import { Response, Request } from 'express';
import { catchError, errorTypes } from '../errors';

import { StripeRequest } from '../interfaces/stripe';
import stripe from '../models/stripe';


/**
 * @controller /api/payments/stripe/payment-methods : POST 
 * Obtiene las tarjetas de un usuario
 */
 export const stripeGetPaymentMethodsController = async(req: StripeRequest, res: Response) => {
  const { email, paymentMethodId } = req.body;
  
  try {
    let customer = (await stripe.getCustomers({email})).data[0];

    if(!customer) {
      return catchError({error: 'User not found', type: errorTypes.user_not_found, res});
    }

    if(paymentMethodId){
      const paymentMethod = await stripe.getPaymentMethod(paymentMethodId);
      return res.json({
        data: [paymentMethod]
      });
    } else {
      const paymentMethods = await stripe.getCustomerPaymentMethods(customer.id);
      return res.json({
        data: paymentMethods.data
      });
    }
  } catch (error:any) {
    return catchError({error, type: errorTypes.stripe_error, res: res, extra: {message: error.message, code: error.code}});
  }
}


/**
 * @controller /api/payments/stripe/payment-intent : POST
 * Crea el intento de pago y devuelve el secret al cliente alli se confirma el pago
 */
 export const stripePaymentIntentController = async(req: StripeRequest, res: Response) => {
  const { email, currency, amount } = req.body;
  
  try {
    //-Tambien existen los metodos get, update, delete, list
    let customer = (await stripe.getCustomers({email})).data[0];

    if(!customer){
      customer = await stripe.createCustomer({
        //*-El email no es unico, cada customer tiene un ID unico pero puede repetirse el email
        email, 
        /* Extra params...
          name: 'customer name',
          description: 'customer description',
          phone: 'customer phone',
          address: {},
          preferred_locales: ['en', 'es'],
          shipping: ShipingObject() -> informacion de envio,
          balance: 10 -> descuentos que afectan las facturas
          coupon: 'coupon name -> cupones de descuentos,
          payment_method: 'id payment method',
          tax: enum -> Impuestos,
        */
      });
    }

    //-Utilizado para hacer operaciones en la api que requieran una llave secreta
    const ephemeralKey = await stripe.createEphemeralKey({customer: customer.id});

    const paymentIntent = await stripe.createPaymentIntent({
      amount: amount,
      currency: currency,
      customer: customer.id,
      setup_future_usage: "on_session", //Si se guarda la tarjeta con autenticacion o sin ella
      payment_method_types: ['card'] //existen muchos mas
      /* Extra params...
        *-Habilita unicamente los pagos configurados en el dashboard de stripe, solo este o los types
        automatic_payment_methods: {
          enabled: true
        },

        *-Se intenta confirmar el pago inmediatamente, ej: cuando se quiere guardar datos de la tarjet
        *-sin pasar la validacion en el cliente o cuando se usa un flujo personalizado
        confirm: true
        *-Indica que el usuario no esta presente en el checkout (compra) solo se usa con el confirm en true
        off_session: true

        *-Define si se maneja el proceso de pago automaticamente con stripe o manualmente por el cliente
        *-El manual se utiliza generalamente con el confirm en true, para un custom flow
        confirmation_method: 'automatic'

        *-solo con 'manual', permite hacer unas validaciones adicionales en IOS y android;
        *-Se utiliza generalmente con un custom flow
        use_stripe_sdk: false

        description: 'payment description'
        payment_method: 'id of the payment used'
        shipping: ShipingObject() -> informacion de envio,
        payment_method_options: { -> opciones adicionales de los metodos de pago
          card: {
            request_three_d_secure: request_three_d_secure ?? 'automatic',
          },
        }
      */
    })

    return res.json({
      ...paymentIntent,
      ephemeralKey: ephemeralKey.secret
    });
  } catch (error:any) {
    return catchError({error, type: errorTypes.stripe_error, res: res, extra: {message: error.message, code: error.code}});
  }
}


/**
 * @controller /api/payments/stripe/manual-intent : POST
 * Intentos de pago para diferentes casos en que no se utilza el checkout personalizado de stripe
 * por ejemplo el paymentSheet para flutter
 */
 export const stripeManualIntentController = async(req: StripeRequest, res: Response) => {
  const { email, currency, amount, cvcToken, useStripeSdk, paymentMethodId, paymentIntentId } = req.body;
  
  try {
    if(cvcToken && email){
      const customer = (await stripe.getCustomers({email})).data[0];

      /* The list all Customers endpoint can return multiple customers that share the same email address.
        For this example we're taking the first returned customer but in a production integration
        you should make sure that you have the right Customer.
      */
      if(!customer){
        return res.status(400).json({
          msg: 'Error',
          error: 'There is no associated customer object to the provided e-mail'
        })
      }

      const paymentMethod = (await stripe.getCustomerPaymentMethods(customer.id)).data[0];

      if (!paymentMethod) {
        return res.status(400).json({
          msg: 'Error',
          error: `There is no associated payment method to the provided customer's e-mail`,
        })
      }

      const paymentIntent = await stripe.createPaymentIntent({
        currency,
        amount,
        confirm: true,
        confirmation_method: 'manual',
        payment_method: paymentMethod.id,
        payment_method_options: {
          card: {
            cvc_token: cvcToken
          }
        },
        use_stripe_sdk: useStripeSdk,
        customer: customer.id
      })

      return res.json({
        ...paymentIntent,
      });
    } else if(paymentMethodId){
      let customer = (await stripe.getCustomers({email})).data[0];

      if(!customer){
        customer = await stripe.createCustomer({email});
      }

      const paymentIntent = await stripe.createPaymentIntent({
        currency,
        amount,
        confirm: true,
        customer: customer.id,
        confirmation_method: 'manual',
        payment_method: paymentMethodId,
        use_stripe_sdk: useStripeSdk
      })

      // After create, if the PaymentIntent's status is succeeded, fulfill the order.
      return res.json({
        ...paymentIntent,
      });
    } else if(paymentIntentId){
      // Confirm the PaymentIntent to finalize payment after handling a required action on the client.
      const paymentIntent = await stripe.confirmPaymentIntent(paymentIntentId);

      // After confirm, if the PaymentIntent's status is succeeded, fulfill the order.
      return res.json({
        ...paymentIntent,
      });
    }
  } catch (error:any) {
    return res.status(400).json({
      msg: 'Error',
      error: error.message
    })
  }
}


/**
 * @controller /api/payments/stripe/apply-charge : POST
 * Recibimos un token de nuestro front, este representa el metodo de pago y aqui hacemos el cargo al metodo
 */
 export const stripeChargeController = async(req: StripeRequest, res: Response) => {
  const { email, currency, amount, paymentToken } = req.body;
  
  try {
    //-Aveces es mejor que el token sea de un solo uso que no pertenezca a ningun usuario y no se
    //-cree una tarjeta, esto para manejar solo metodos de pago y no combinarlos con tarjetas
    let customer = (await stripe.getCustomers({email})).data[0];

    if(!customer){
      //-Recordar que el uso de token es principalmente para tarjetas que no esten creadas
      customer = await stripe.createCustomer({email});
    } 

    //-Como puede que el usuario logeado no tenga esa tarjeta se deja esta funcion para ambos casos
    // const card = await stripe.createCustomerSource(customer.id, {source: paymentToken})

    const charge = await stripe.applyCharge({
      amount: amount,
      currency: currency,
      // customer: customer.id,
      // source: card.id,
      source: paymentToken
    })

    const {source, ...chargeResponse} = charge

    return res.json({
      ...chargeResponse,
      source: source?.id
    });
  } catch (error:any) {
    console.log(error);
    return catchError({error, type: errorTypes.stripe_error, res: res, extra: {message: error.message, code: error.code}});
  }
}


/**
 * @controller /api/payments/stripe/setup-intent : POST
 * Configura un futuro intento de pago
 */
 export const stripeSetupIntentController = async(req: StripeRequest, res: Response) => {
  const { email } = req.body;
  
  try {
    let customer = (await stripe.getCustomers({email})).data[0];

    if(!customer){
      customer = await stripe.createCustomer({email});
    }

    const setupIntent = await stripe.createSetupIntent({
      customer: customer.id,
      payment_method_types: ['card'],
      usage: 'on_session', //Si el metodo de pago unicamente sera usado con el customer o sin el
      /* Extra params ...
        description: 'Payment description',
        *- Establece parametros como amount y currency para ser usado solo 1 vez en el futuro
        single_use: SingleUse object
        confirm: true
        payment_method: 'payment method id',
        payment_method_options: {
          card: {
            request_three_d_secure: request_three_d_secure ?? 'automatic',
          },
        },
      */
    })

    return res.json({
      ...setupIntent
    });
  } catch (error:any) {
    console.log(error);
    return catchError({error, type: errorTypes.stripe_error, res: res, extra: {message: error.message, code: error.code}});
  }
}


/**
 * @controller /api/payments/stripe/webhook : POST
 * Webhooks para escuchar eventos de las transacciones
 */
 export const stripeWebhookController = async(req: Request, res: Response) => {
  //-Webhook sin validacion puede setearse la respuesta json
  // console.log(req.body),

  //-Webhook con validacion se necesita la data en bytes
  const payload = req.body;
  const sig = req.headers['stripe-signature'] as string;

  //-se obtiene del comando stripe listen --print-secret del stripe cli, al parecer despues de estar esuchando un webhook
  const endpointSecret = process.env.STRIPE_WEBHOOK_KEY!;
 
  let event;

  try {
    event = stripe.getWebhookEvent(payload, sig, endpointSecret);

    if(event.type === 'payment_intent.created'){
      console.log('Payment Intent Created');
    }
 
    return res.json({success: true})
  } catch (error:any) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}


/**
 * @controller /api/payments/stripe/charge-card-off-session : POST
 * Utilizado para cargar metodos de pago off-session
 */
 export const stripeChargeCardOffSessionController = async(req: StripeRequest, res: Response) => {
  const { email, amount, currency } = req.body;
  
  try {
    const customer = (await stripe.getCustomers({email})).data[0];

    if(!customer){
      return res.status(400).json({
        msg: 'Error',
        error: 'There is no associated customer object to the provided e-mail'
      })
    }

    const paymentMethod = (await stripe.getCustomerPaymentMethods(customer.id)).data[0];

    if (!paymentMethod) {
      return res.status(400).json({
        msg: 'Error',
        error: `There is no associated payment method to the provided customer's e-mail`,
      })
    }

    const paymentIntent = await stripe.createPaymentIntent({
      amount,
      currency,
      payment_method: paymentMethod.id,
      customer: customer.id,
      off_session: true,
      confirm: true,
    })

    return res.json({
      msg: 'Payment intent created successfully',
      paymentIntent,
    });
  } catch (error:any) {
    if (error.code === 'authentication_required') {
      // Bring the customer back on-session to authenticate the purchase
      // You can do this by sending an email or app notification to let them know
      // the off-session purchase failed
      // Use the PM ID and client_secret to authenticate the purchase
      // without asking your customers to re-enter their details
      return res.status(400).json({
        error: 'authentication_required',
        paymentMethod: error.raw.payment_method.id,
        clientSecret: error.raw.payment_intent.client_secret,
        amount,
        card: {
          brand: error.raw.payment_method.card.brand,
          last4: error.raw.payment_method.card.last4,
        },
      });
    } else if (error.code) {
      // The card was declined for other reasons (e.g. insufficient funds)
      // Bring the customer back on-session to ask them for a new payment method
      return res.status(400).json({
        error: error.code,
        clientSecret: error.raw.payment_intent.client_secret,
      });
    } else {
      return res.status(500).json({
        msg: 'Unknown error occurred',
        error: error
      });
    }
  }
}