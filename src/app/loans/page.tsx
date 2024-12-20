import { Suspense } from 'react'
import { LoansTable } from '@/components/loans/loans-table'
import { LoansSummary } from '@/components/loans/loans-summary'

export default function LoansPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Loans</h1>
      </div>
      
      <Suspense fallback={<div>Loading...</div>}>
        <LoansSummary />
        <LoansTable />
      </Suspense>
    </div>
  )
} 