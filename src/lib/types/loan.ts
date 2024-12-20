export type LoanStatus = 'pending' | 'active' | 'paid' | 'default'

export interface Loan {
  id: number
  amount: number
  interest_rate: number
  term_days: number
  borrower_id: number
  borrower: {
    company_name: string
    contact_name: string
  }
  status: LoanStatus
  disbursement_date: string | null
  total_paid: number
  remaining_balance: number
  next_payment_date: string | null
  created_at: string
  updated_at: string
}

export interface Payment {
  id: number
  total_amount: number
  principal_amount: number
  interest_amount: number
  loan_id: number
  purchase_order_id?: number
  payment_type: 'po_payment' | 'direct_payment' | 'scheduled' | 'extra' | 'late'
  scheduled_date: string
  status: 'pending' | 'completed' | 'failed'
  processed_at: string | null
  late_fees: number | null
  created_at: string
  updated_at: string
}