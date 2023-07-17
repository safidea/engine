export type Invoice = {
  customer: string
  address: string
  zip_code: string
  country: string
  items: {
    activity: string
    quantity: number
    unity: string
    unit_price: number
  }[]
  status: string
  number: number
  finalised_date: string
  total_amount: number
}
