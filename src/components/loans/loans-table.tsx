'use client'

import { useState } from "react"
import { useLoans } from "@/hooks/use-loans"
import { LoansFilter } from "./loans-filter"
import { LoanStatus, Loan } from "@/lib/types/loan"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { ArrowUpDown } from "lucide-react"

type SortConfig = {
  key: keyof Loan | null
  direction: 'asc' | 'desc'
}

export function LoansTable() {
  const { data: loans, isLoading } = useLoans()
  const router = useRouter()
  const [filters, setFilters] = useState<{
    status?: LoanStatus
    minAmount?: number
    maxAmount?: number
  }>({})
  const [sort, setSort] = useState<SortConfig>({ key: null, direction: 'asc' })

  const filteredLoans = loans?.filter((loan) => {
    if (filters.status && loan.status !== filters.status) {
      return false
    }
    if (filters.minAmount && loan.amount < filters.minAmount) {
      return false
    }
    if (filters.maxAmount && loan.amount > filters.maxAmount) {
      return false
    }
    return true
  })

  const sortedAndFilteredLoans = filteredLoans?.sort((a, b) => {
    if (!sort.key) return 0
    
    const aValue = a[sort.key]
    const bValue = b[sort.key]

    if (typeof aValue === 'string') {
      return sort.direction === 'asc' 
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue as string)
    }

    return sort.direction === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number)
  })

  const toggleSort = (key: keyof Loan) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }: { row: { original: Loan } }) => formatCurrency(row.original.amount),
    },
    {
      header: "Interest Rate",
      accessorKey: "interest_rate",
      cell: ({ row }: { row: { original: Loan } }) => `${row.original.interest_rate}%`,
    },
    {
      header: "Term (Days)",
      accessorKey: "term_days",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Total Paid",
      accessorKey: "total_paid",
      cell: ({ row }: { row: { original: Loan } }) => formatCurrency(row.original.total_paid),
    },
    {
      header: "Remaining Balance",
      accessorKey: "remaining_balance",
      cell: ({ row }: { row: { original: Loan } }) => formatCurrency(row.original.remaining_balance),
    }
  ]

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <LoansFilter onFilterChange={setFilters} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => toggleSort('id')} className="cursor-pointer hover:bg-accent">
                ID <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => toggleSort('borrower')} className="cursor-pointer hover:bg-accent">
                Borrower <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => toggleSort('amount')} className="cursor-pointer hover:bg-accent">
                Amount <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => toggleSort('interest_rate')} className="cursor-pointer hover:bg-accent">
                Interest Rate <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => toggleSort('status')} className="cursor-pointer hover:bg-accent">
                Status <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead>Total Paid</TableHead>
              <TableHead>Remaining Balance</TableHead>
              <TableHead>Next Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredLoans?.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.borrower?.company_name || 'askljfd;laksjdf'}</TableCell>
                <TableCell>{formatCurrency(loan.amount)}</TableCell>
                <TableCell>{loan.interest_rate}%</TableCell>
                <TableCell>{loan.status}</TableCell>
                <TableCell>{formatCurrency(loan.total_paid)}</TableCell>
                <TableCell>{formatCurrency(loan.remaining_balance)}</TableCell>
                <TableCell>{loan.next_payment_date ? new Date(loan.next_payment_date).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/loans/${loan.id}`)}
                    >
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Record Payment</DropdownMenuItem>
                        <DropdownMenuItem>Send Payment Reminder</DropdownMenuItem>
                        <DropdownMenuItem>Generate Statement</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Default</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}