'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { loansApi } from "@/lib/api/loans"
import { formatCurrency, getBadgeVariant } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function LoanDetails({ id }: { id: number }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  
  const { data: loan, isLoading: isLoadingLoan } = useQuery({
    queryKey: ['loan', id],
    queryFn: () => loansApi.getLoanById(id)
  })

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['loan-payments', id],
    queryFn: () => loansApi.getPayments(id)
  })

  const { data: purchaseOrders, isLoading: isLoadingPOs } = useQuery({
    queryKey: ['loan-purchase-orders', id],
    queryFn: () => loansApi.getPurchaseOrders(id)
  })

  const updatePayment = useMutation({
    mutationFn: (data: { 
      id: number, 
      status: 'pending' | 'completed' | 'failed',
      total_amount?: number,
      principal_amount?: number,
      interest_amount?: number
    }) => loansApi.updatePayment(data.id, { status: data.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan', id] })
      queryClient.invalidateQueries({ queryKey: ['loan-payments', id] })
    }
  })

  if (isLoadingLoan || isLoadingPayments || isLoadingPOs) return <div>Loading...</div>
  if (!loan) return <div>Loan not found</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Loan Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Loans
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">{formatCurrency(loan.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest Rate:</span>
              <span className="font-medium">{loan.interest_rate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium">{loan.status}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Total Paid:</span>
              <span className="font-medium">{formatCurrency(loan.total_paid)}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining Balance:</span>
              <span className="font-medium">{formatCurrency(loan.remaining_balance)}</span>
            </div>
            <div className="flex justify-between">
              <span>Next Payment:</span>
              <span className="font-medium">
                {loan.next_payment_date 
                  ? new Date(loan.next_payment_date).toLocaleDateString()
                  : '-'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Payment History ({payments?.length || 0} payments)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Late Fees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.scheduled_date).toLocaleDateString()}</TableCell>
                  <TableCell>{formatCurrency(payment.total_amount)}</TableCell>
                  <TableCell>{formatCurrency(payment.principal_amount)}</TableCell>
                  <TableCell>{formatCurrency(payment.interest_amount)}</TableCell>
                  <TableCell>{payment.payment_type}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>{payment.late_fees ? formatCurrency(payment.late_fees) : '-'}</TableCell>
                </TableRow>
              ))}
              {!payments?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No payments found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="col-span-full mt-6">
        <CardHeader>
          <CardTitle>Purchase Orders ({purchaseOrders?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Expected Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders?.map((po) => (
                <TableRow key={po.id}>
                  <TableCell>{po.po_number}</TableCell>
                  <TableCell>{formatCurrency(po.amount)}</TableCell>
                  <TableCell>{po.buyer_name}</TableCell>
                  <TableCell>
                    {new Date(po.expected_payment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(po.status)}>
                      {po.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!purchaseOrders?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No purchase orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 