import Stripe from "stripe"

export class StripeSubscriptionProductCustom {
    id: string
    name: string
    quantity: number
}
export class StripeSubscriptionCustom {
    subscription: Stripe.Subscription
    products: StripeSubscriptionProductCustom[]
    latest_payment_status:  Stripe.Invoice.Status
    total_spent: number 
}