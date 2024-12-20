'use client'

import { LoanDetails } from "@/components/loans/loan-details"
import { Suspense, use } from "react"

interface PageProps {
  params: {
    id: string
  }
}

export default function LoanPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const id = parseInt(resolvedParams.id)

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <LoanDetails id={id} />
      </Suspense>
    </div>
  )
} 