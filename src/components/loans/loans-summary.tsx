'use client'

import { useQuery } from "@tanstack/react-query"
import { loansApi } from "@/lib/api/loans"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LoansSummary() {
  const { data: loans } = useQuery({
    queryKey: ['loans'],
    queryFn: () => loansApi.getLoans()
  })

  const totalOutstanding = loans?.reduce((sum, loan) => 
    sum + loan.remaining_balance, 0) || 0

  const activeLoans = loans?.filter(loan => 
    loan.status === 'active').length || 0

  const totalInterest = loans?.reduce((sum, loan) => {
    if (loan.status === 'active') {
      const interestAmount = (loan.amount * loan.interest_rate / 100)
      return sum + interestAmount
    }
    return sum
  }, 0) || 0

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Outstanding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Loans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeLoans}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Interest Accrued
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalInterest)}</div>
        </CardContent>
      </Card>
    </div>
  )
} 