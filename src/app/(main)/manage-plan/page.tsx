import ManagePlanPage from "./MangePlanPage";

export const metadata = {
  title: "Manage Plan - Heysheet",
  description:
    "Manage your HeySheet plan, view billing details, and update your subscription.",
};

export default async function ManagePlan() {
  return <ManagePlanPage />;
}
