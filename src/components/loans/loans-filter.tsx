'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LoanStatus } from "@/lib/types/loan"
import { useState } from "react"

interface LoansFilterProps {
  onFilterChange: (filters: {
    status?: LoanStatus
    minAmount?: number
    maxAmount?: number
  }) => void
}

export function LoansFilter({ onFilterChange }: LoansFilterProps) {
  const [status, setStatus] = useState<LoanStatus>()
  const [minAmount, setMinAmount] = useState<string>("")
  const [maxAmount, setMaxAmount] = useState<string>("")

  const handleFilterChange = () => {
    onFilterChange({
      status,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
    })
  }

  const handleReset = () => {
    setStatus(undefined)
    setMinAmount("")
    setMaxAmount("")
    onFilterChange({})
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg mb-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <label>Status</label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as LoanStatus)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label>Min Amount</label>
          <Input
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            placeholder="Min amount"
            className="w-[150px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Max Amount</label>
          <Input
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            placeholder="Max amount"
            className="w-[150px]"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleFilterChange}>Apply Filters</Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  )
} 