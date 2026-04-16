import {
  Expense,
  Contribution,
  RequiredFund,
  ContributorStats,
  Settlement,
  DashboardMetrics,
  CONTRIBUTORS,
  ContributorName,
  FUND_MANAGER,
} from "@/types";

export function calcTotalExpense(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
}

export function calcTotalContribution(contributions: Contribution[]): number {
  return contributions.reduce((sum, c) => {
    return c.given_to === FUND_MANAGER ? sum + Number(c.amount) : sum;
  }, 0);
}

export function calcTotalRequiredFund(requiredFunds: RequiredFund[]): number {
  return requiredFunds.reduce((sum, r) => sum + Number(r.amount), 0);
}

export const DEFAULT_SHARE_PERSONS = 4;

export function calcPerContributorShare(
  totalContribution: number,
  sharePersons: number = DEFAULT_SHARE_PERSONS
): number {
  return totalContribution / sharePersons;
}

export function calcActualRequiredFund(
  totalRequiredFund: number,
  totalContribution: number
): number {
  return totalRequiredFund - totalContribution;
}

export function calcTreasuryBalance(
  totalContribution: number,
  totalExpense: number
): number {
  return totalContribution - totalExpense;
}

export function calcContributorStats(
  contributions: Contribution[],
  share: number
): ContributorStats[] {
  const creditedAmounts = CONTRIBUTORS.reduce<Record<ContributorName, number>>(
    (acc, name) => {
      acc[name] = 0;
      return acc;
    },
    {} as Record<ContributorName, number>
  );

  contributions.forEach((contribution) => {
    const amount = Number(contribution.amount);
    const contributor = contribution.partner_name as ContributorName;

    if (CONTRIBUTORS.includes(contributor)) {
      creditedAmounts[contributor] += amount;
    }

    const recipient = contribution.given_to;
    if (recipient === FUND_MANAGER) {
      return;
    }

    if (CONTRIBUTORS.includes(recipient as ContributorName)) {
      // Internal settlements increase the payer's net contribution
      // and decrease the receiver's net contribution.
      creditedAmounts[recipient as ContributorName] -= amount;
    }
  });

  return CONTRIBUTORS.map((name) => {
    const contributed = creditedAmounts[name];
    const remaining = share - contributed;
    const balance = contributed - share;
    return { name, contributed, share, remaining, balance };
  });
}

export function calcSettlements(
  contributorStats: ContributorStats[]
): Settlement[] {
  const settlements: Settlement[] = [];

  const underpaid = contributorStats
    .filter((cs) => cs.balance < 0)
    .map((cs) => ({ name: cs.name, amount: Math.abs(cs.balance) }));
  const overpaid = contributorStats
    .filter((cs) => cs.balance > 0)
    .map((cs) => ({ name: cs.name, amount: cs.balance }));

  let i = 0;
  let j = 0;
  while (i < underpaid.length && j < overpaid.length) {
    const transfer = Math.min(underpaid[i].amount, overpaid[j].amount);
    if (transfer > 0.01) {
      settlements.push({
        from: underpaid[i].name,
        to: overpaid[j].name,
        amount: transfer,
      });
    }
    underpaid[i].amount -= transfer;
    overpaid[j].amount -= transfer;
    if (underpaid[i].amount < 0.01) i++;
    if (overpaid[j].amount < 0.01) j++;
  }

  return settlements;
}

export function calcDashboardMetrics(
  expenses: Expense[],
  contributions: Contribution[],
  requiredFunds: RequiredFund[]
): DashboardMetrics {
  const totalExpense = calcTotalExpense(expenses);
  const totalContribution = calcTotalContribution(contributions);
  const totalRequiredFund = calcTotalRequiredFund(requiredFunds);
  const perContributorShare = calcPerContributorShare(totalContribution);
  const actualRequiredFund = calcActualRequiredFund(
    totalRequiredFund,
    totalContribution
  );
  const treasuryBalance = calcTreasuryBalance(totalContribution, totalExpense);
  const contributorStats = calcContributorStats(contributions, perContributorShare);
  const settlements = calcSettlements(contributorStats);

  return {
    totalExpense,
    totalContribution,
    totalRequiredFund,
    perContributorShare,
    actualRequiredFund,
    treasuryBalance,
    contributorStats,
    settlements,
  };
}

export function getContributorSettlement(
  name: string,
  settlements: Settlement[]
): { type: "paying" | "receiving" | "settled"; amount: number; counterparts: { name: string; amount: number }[] } {
  // Find all settlements where this person is paying
  const payingSettlements = settlements.filter((s) => s.from === name);
  if (payingSettlements.length > 0) {
    const totalAmount = payingSettlements.reduce((sum, s) => sum + s.amount, 0);
    const counterparts = payingSettlements.map((s) => ({ name: s.to, amount: s.amount }));
    return { type: "paying", amount: totalAmount, counterparts };
  }

  // Find all settlements where this person is receiving
  const receivingSettlements = settlements.filter((s) => s.to === name);
  if (receivingSettlements.length > 0) {
    const totalAmount = receivingSettlements.reduce((sum, s) => sum + s.amount, 0);
    const counterparts = receivingSettlements.map((s) => ({ name: s.from, amount: s.amount }));
    return { type: "receiving", amount: totalAmount, counterparts };
  }

  return { type: "settled", amount: 0, counterparts: [] };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}
