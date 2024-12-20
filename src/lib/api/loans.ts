import axios from 'axios'
import { Loan, Payment } from '@/lib/types/loan'
import { PurchaseOrder, POStatus } from '@/lib/types/purchase-order'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export const loansApi = {
  getLoans: async () => {
    const response = await api.get<Loan[]>('/loans')
    return response.data
  },

  getLoanById: async (id: number) => {
    const response = await api.get<Loan>(`/loans/${id}`)
    return response.data
  },

  getPurchaseOrders: async (loanId: number) => {
    const response = await api.get<PurchaseOrder[]>(`/loans/${loanId}/purchase-orders`)
    return response.data
  },

  createLoan: async (data: {
    amount: number
    interest_rate: number
    term_days: number
    borrower_id: number
    purchase_order_ids?: number[]
  }) => {
    const response = await api.post<Loan>('/loans', data)
    return response.data
  },

  updateLoan: async (id: number, data: {
    status?: string
    notes?: string
    total_paid?: number
    disbursement_date?: string
    term_days?: number
    interest_rate?: number
  }) => {
    const response = await api.put<Loan>(`/loans/${id}`, data)
    return response.data
  },

  getPayments: async (loanId: number) => {
    const response = await api.get<Payment[]>(`/loans/${loanId}/payments`)
    return response.data
  },

  updatePayment: async (paymentId: number, data: { 
    status: 'pending' | 'completed' | 'failed'
    total_amount?: number
    principal_amount?: number
    interest_amount?: number
    payment_type?: string
    scheduled_date?: string
    late_fees?: number
  }) => {
    const response = await api.put<Payment>(`/payments/${paymentId}`, data)
    return response.data
  },

  updatePurchaseOrder: async (id: number, data: { 
    status: POStatus,
    notes?: string,
    actual_payment_date?: string
  }) => {
    const response = await api.put<PurchaseOrder>(`/purchase-orders/${id}`, data)
    return response.data
  }
} 