import { Request, Response } from 'express';

/**
 * @controller /api/uploads/chat : POST
 */
 export const stripeIntentController = async(req: Request, res: Response) => {
  try {
    return res.json({
      msg: 'Stripe Intent'
    });
  } catch (error:any) {
    return res.json({
      msg: 'Error'
    })
  }
}