export type SubscriptionData = {
  plan: string;
  status: string;
  next_billing: string;
  customer_id: string;
  billing_interval: "monthly" | "annually";
  subscription_id: string;
};
