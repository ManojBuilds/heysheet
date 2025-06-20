import { ChartAreaInteractive } from "@/components/dashboard/chart-area";
import DateFilter from "@/components/dashboard/date-filter";
import StatisticCard from "@/components/dashboard/statistic-card";
import { InboxIcon } from "lucide-react";
import { Country } from "country-state-city";
import ReusableChart from "@/components/dashboard/browser-chart";

type FormAnalyticsData = {
  total_submissions: number;
  submissions_over_time?: any[];
  browsers?: { browser: string; count: number }[];
  devices?: { device_type: string; count: number }[];
  os?: { os: string; count: number }[];
  countries?: { country: string; count: number }[];
};

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



export const FormAnalytics = ({ data }: { data: FormAnalyticsData }) => {
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
    <div className="space-y-4">
      <div className="flex justify-between gap-2 items-center">
        <h2 className="sm:text-lg">Submission Analytics</h2>
        <DateFilter />
      </div>
      <StatisticCard
        icon={InboxIcon}
        title="Total submissions"
        value={data.total_submissions}
        tooltipContent="The total number of submissions received across all your forms."
      />
      <ChartAreaInteractive data={data.submissions_over_time || []} />
      <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
};
