import DateFilter from "@/components/dashboard/date-filter";
import StatisticCard from "@/components/dashboard/statistic-card";
import { InboxIcon } from "lucide-react";
import { Country } from "country-state-city";
import ReusableChart from "@/components/dashboard/browser-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChartAreaContent from "@/components/dashboard/chart-area-content";

type FormAnalyticsData = {
  total_submissions: number;
  submissions_over_time?: any[];
  browsers?: { browser: string; count: number }[];
  devices?: { device_type: string; count: number }[];
  os?: { os: string; count: number }[];
  countries?: { country: string; count: number }[];
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
      <Card className="pt-0 bg-transparent">
        <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Submissions Over Time</CardTitle>
            <CardDescription className="sr-only">Interactive area chart showing submission trends</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ChartAreaContent data={data.submissions_over_time || []} />
        </CardContent>
      </Card>
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
