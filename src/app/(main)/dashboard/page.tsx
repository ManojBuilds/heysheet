import { currentUser } from "@clerk/nextjs/server";
import { FilesIcon, InboxIcon, ToggleRightIcon } from "lucide-react";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area";
import CreateFormModal from "@/components/CreateFormModal";
import StatisticCard from "@/components/dashboard/statistic-card";
import PageHeader from "@/components/pages/page-header";
import Topforms from "@/components/dashboard/top-forms";
import ReusableChart from "@/components/dashboard/browser-chart";
import { createClient } from "@/lib/supabase/server";
import { parseISO } from "date-fns";
import DateFilter from "@/components/dashboard/date-filter";
import { Country } from "country-state-city";
import { TopFormsAnalyticsData } from "@/types/form-builder";
import { getGoogleAccounts } from "@/actions";
import AllowGooglePermissions from "@/components/AllowGooglePermissions";
import { getGoogleAuthUrl } from "@/lib/google/auth";

const chartConfigs = {
  browsers: {
    value: { label: "Submissions" },
    chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
    safari: { label: "Safari", color: "hsl(var(--chart-2))" },
    firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
    edge: { label: "Edge", color: "hsl(var(--chart-4))" },
    other: { label: "Other", color: "hsl(var(--chart-5))" },
  },
  devices: {
    value: { label: "Users" },
    desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
    mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
    tablet: { label: "Tablet", color: "hsl(var(--chart-3))" },
  },
  os: {
    value: { label: "Sessions" },
    windows: { label: "Windows", color: "hsl(var(--chart-1))" },
    macos: { label: "macOS", color: "hsl(var(--chart-2))" },
    linux: { label: "Linux", color: "hsl(var(--chart-3))" },
    android: { label: "Android", color: "hsl(var(--chart-4))" },
    ios: { label: "iOS", color: "hsl(var(--chart-5))" },
  },
  countries: {
    value: { label: "Visitors" },
    us: { label: "United States", color: "hsl(var(--chart-1))" },
    uk: { label: "United Kingdom", color: "hsl(var(--chart-2))" },
    canada: { label: "Canada", color: "hsl(var(--chart-3))" },
    germany: { label: "Germany", color: "hsl(var(--chart-4))" },
    france: { label: "France", color: "hsl(var(--chart-5))" },
    others: { label: "Others", color: "hsl(var(--chart-6))" },
  },
};

interface DashboardAnalyticsData {
  browsers: BrowserAnalyticsData[];
  devices: DeviceAnalyticsData[];
  os: OSAnalyticsData[];
  countries: CountryAnalyticsData[];
  total_forms: number;
  total_submissions: number;
  active_forms: number;
  submissions_over_time: SubmissionAnalyticsData[];
  top_forms: TopFormsAnalyticsData[];
}

interface BrowserAnalyticsData {
  browser: string;
  count: number;
}

interface DeviceAnalyticsData {
  device_type: string;
  count: number;
}

interface OSAnalyticsData {
  os: string;
  count: number;
}

interface CountryAnalyticsData {
  country: string;
  count: number;
}

interface SubmissionAnalyticsData {
  day: string;
  count: number;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const user = await currentUser();
  const supabase = await createClient();
  const { from, to } = await searchParams;

  const googleAccounts = await getGoogleAccounts(user?.id || "");
  const isGoogleAccountConnected = !!googleAccounts.length;
  const fromDate = from
    ? parseISO(from)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const toDate = to ? parseISO(to) : new Date();
  const { data, error } = await supabase
    .rpc("dashboard_metrics_range", {
      from_date: fromDate.toISOString(),
      to_date: toDate.toISOString(),
      user_id: user?.id,
    })
    .then((res) => res as { data: DashboardAnalyticsData | null; error: any });

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
  const state = JSON.stringify({ redirectUrl: "/dashboard" });
  const googleAuthUrl = getGoogleAuthUrl(redirectUri, state);
  if (error) {
    throw error;
  }
  if (!data) {
    return <div>Error</div>;
  }

  const chartData = {
    browsers: data.browsers?.map((browser) => ({
      key: browser.browser,
      value: browser.count,
      fill: `var(--color-${browser.browser})`,
    })),
    devices: data.devices?.map((device) => ({
      key: device.device_type,
      value: device.count,
    })),
    os: data.os?.map(({ os, count }) => ({
      key: os,
      value: count,
    })),
    countries: data.countries?.map(({ country, count }) => {
      const countryDetails = Country.getCountryByCode(country);
      return {
        key: countryDetails?.isoCode
          ? `${countryDetails?.flag}    ${countryDetails?.name}`
          : country,
        value: count,
      };
    }),
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={user?.firstName ? `Holla, ${user.firstName}` : "Dashboard"}
        action={<CreateFormModal />}
      />
      {isGoogleAccountConnected ? (
        <>
          <DateFilter />
          <div className="grid grid-cols-3 gap-4">
            <StatisticCard
              icon={FilesIcon}
              title="Total forms"
              value={data.total_forms}
              tooltipContent="The total number of forms you've created on your account."
            />
            <StatisticCard
              icon={InboxIcon}
              title="Total submissions"
              value={data.total_submissions}
              tooltipContent="The total number of submissions received across all your forms."
            />
            <StatisticCard
              icon={ToggleRightIcon}
              title="Active forms"
              value={data.active_forms}
              tooltipContent="Forms that are enabled and can receive submissions."
            />
          </div>
          <div className="inline-flex gap-4">
            <div className="flex-1">
              <ChartAreaInteractive data={data.submissions_over_time || []} />
            </div>
            <Topforms forms={data.top_forms} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ReusableChart
              title="Browser Usage"
              data={chartData.browsers}
            />

            <ReusableChart
              title="Device Usage"
              data={chartData.devices}
                          />

            <ReusableChart
              title="Operating Systems"
              data={chartData.os}
                          />
            <ReusableChart
              title="Top Countries"
              data={chartData.countries}
                          />
          </div>
        </>
      ) : (
        <AllowGooglePermissions url={googleAuthUrl} />
      )}
    </div>
  );
}
