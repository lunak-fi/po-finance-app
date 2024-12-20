import { useQuery } from '@tanstack/react-query'
import { loansApi } from '@/lib/api/loans'
import type { Loan } from '@/lib/types/loan'

export function useLoans() {
  return useQuery<Loan[]>({
    queryKey: ['loans'],
    queryFn: () => loansApi.getLoans()
  })
} 