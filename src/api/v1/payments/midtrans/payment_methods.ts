export type PaymentType = string
export type PaymentTypes = PaymentType[]

export enum PaymentMethod {
  BankTransfer = 'bank_transfer',
  PermataVA = 'permata_va',
  BCAVA = 'bca_va',
  BbmMoney = 'bbm_money',
  BcaKlikpay = 'bca_klikpay',
  BriEpay = 'bri_epay',
  CreditCard = 'credit_card',
  CimbClicks = 'cimb_clicks',
  ConvStore = 'cstore',
  KlikBca = 'bca_klikbca',
  Echannel = 'echannel',
  MandiriClickpay = 'mandiri_clickpay',
  TelkomselCash = 'telkomsel_cash',
  XlTunai = 'xl_tunai',
  IndosatDompetku = 'indosat_dompetku',
  MandiriEcash = 'mandiri_ecash',
  Kioson = 'kioson',
  Indomaret = 'indomaret',
  GiftCardIndo = 'gci'
}

export const AllPaymentSources: PaymentTypes = [
  PaymentMethod.BankTransfer,
  PaymentMethod.PermataVA,
  PaymentMethod.BCAVA,
  PaymentMethod.BbmMoney,
  PaymentMethod.BcaKlikpay,
  PaymentMethod.BriEpay,
  PaymentMethod.CreditCard,
  PaymentMethod.CimbClicks,
  PaymentMethod.ConvStore,
  PaymentMethod.KlikBca,
  PaymentMethod.Echannel,
  PaymentMethod.MandiriClickpay,
  PaymentMethod.TelkomselCash,
  PaymentMethod.XlTunai,
  PaymentMethod.IndosatDompetku,
  PaymentMethod.MandiriEcash,
  PaymentMethod.Kioson,
  PaymentMethod.Indomaret,
  PaymentMethod.GiftCardIndo
]
