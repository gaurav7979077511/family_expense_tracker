export interface Expense {
  id: string;
  date: string;
  amount: number;
  note: string;
  created_at: string;
}

export interface Contribution {
  id: string;
  date: string;
  amount: number;
  partner_name: string;
  given_to: string;
  note: string;
  created_at: string;
}

export interface RequiredFund {
  id: string;
  date: string;
  amount: number;
  note: string;
  created_at: string;
}

export type ContributorName =
  | "Ajay Kumar"
  | "Ranjay Kumar"
  | "Pawan Kumar"
  | "Rishi Kumar";

export const CONTRIBUTORS: ContributorName[] = [
  "Ajay Kumar",
  "Ranjay Kumar",
  "Pawan Kumar",
  "Rishi Kumar",
];

export const FUND_MANAGER = "Lalbihari Ram";

export interface ContributorStats {
  name: ContributorName;
  contributed: number;
  share: number;
  remaining: number;
  balance: number; // contributed - share (positive = overpaid, negative = underpaid)
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface DashboardMetrics {
  totalExpense: number;
  totalContribution: number;
  totalRequiredFund: number;
  perContributorShare: number;
  actualRequiredFund: number;
  treasuryBalance: number;
  contributorStats: ContributorStats[];
  settlements: Settlement[];
}
