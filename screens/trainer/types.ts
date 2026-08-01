export type TrainerOrder = {
  id: string;
  number: string;
  customerName: string;
  finalAmount: string;
  referralSource: string;
  status: string;
  createdAt: string;
};

export type CommissionTotals = Record<string, number>;
