import { StripeSubscriptionItem } from "@stripe/entities/stripe-subscription-item-entity";

export class StripeSubscription {
    public customer: string;
    public trial_period_days: number;
    public collection_method: string;
    public payment_method: string;
    public days_until_due: number;
    public units: number;
    public temperature_module: boolean;
    public fuel_module: boolean;
    public maintenance_module: boolean;
    public items: StripeSubscriptionItem[];
}