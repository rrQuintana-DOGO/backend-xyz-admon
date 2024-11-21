export enum BillingScheme {
    PER_UNIT = 'per_unit',
    TIERED = 'tiered',
}

export enum CollectionScheme {
    CHARGE_AUTOMATICALLY = 'charge_automatically',
    SEND_INVOICE = 'send_invoice',
}

export enum PaymentMethodScheme {
    ACH_CREDIT_TRANSFER = 'ach_credit_transfer',
    ACH_DEBIT = 'ach_debit',
    ACSS_DEBIT = 'acss_debit',
    AMAZON_PAY = 'amazon_pay',
    AU_BECS_DEBIT = 'au_becs_debit',
    BACS_DEBIT = 'bacs_debit',
    BANCONTACT = 'bancontact',
    BOLETO = 'boleto',
    CARD = 'card',
    CASHAPP = 'cashapp',
    CUSTOMER_BALANCE = 'customer_balance',
    EPS = 'eps',
    FPX = 'fpx',
    GIROPAY = 'giropay',
    GRABPAY = 'grabpay',
    IDEAL = 'ideal',
    KONBINI = 'konbini',
    LINK = 'link',
    MULTIBANCO = 'multibanco',
    P24 = 'p24',
    PAYNOW = 'paynow',
    PAYPAL = 'paypal',
    PROMPTPAY = 'promptpay',
    REVOLUT_PAY = 'revolut_pay',
    SEPA_CREDIT_TRANSFER = 'sepa_credit_transfer',
    SEPA_DEBIT = 'sepa_debit',
    SOFORT = 'sofort',
    SWISH = 'swish',
    US_BANK_ACCOUNT = 'us_bank_account',
    WECHAT_PAY = 'wechat_pay',
}
export enum TierMode {
    GRADUATED = 'graduated',
    VOLUME = 'volume',
}

export enum Interval {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
}

export class StripeRecurring {
    public interval: Interval
}

export class StripeTier {
    public up_to: number;
    public unit_amount: number;
}

export class StripePrice {
    public id: string;
    public currency: string;
    public recurring: StripeRecurring;
    public product: string;
    public billing_scheme: BillingScheme;
    public tiers_mode: TierMode;
    public tiers: StripeTier[];

}