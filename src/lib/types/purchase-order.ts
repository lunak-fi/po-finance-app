export type POStatus = 'pending' | 'approved' | 'fulfilled' | 'paid' | 'cancelled'

export interface PurchaseOrder {
  id: number
  po_number: string
  amount: number
  buyer_name: string
  expected_payment_date: string
  actual_payment_date: string | null
  borrower_id: number
  loan_id: number
  status: POStatus
  created_at: string
  updated_at: string
} 