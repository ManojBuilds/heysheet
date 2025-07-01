import { currentUser } from "@clerk/nextjs/server";
import { getAllAnalyticsGroups } from "@/lib/data";
import ReusableChart from "@/components/dashboard/browser-chart";
import { Country } from "country-state-city";

export default async function FormAnalyticsCharts({
  formId,
  fromDate,
  toDate,
}: {
  formId: string;
  fromDate: string;
  toDate: string;
}) {
  const user = await currentUser();
  const analyticsData = await getAllAnalyticsGroups({
    userId: user?.id || "",
    fromDate,
    toDate,
    formId,
  });

  const chartData = {
    browsers: analyticsData.browser?.map((browser) => ({
      key: browser.key,
      value: browser.value,
      fill: `var(--color-${browser.key})`,
    })),
    devices: analyticsData.device_type?.map((device) => ({
      key: device.key,
      value: device.value,
    })),
    os: analyticsData.os?.map(({ key, value }) => ({
      key: key,
      value: value,
    })),
    countries: analyticsData.country?.map(({ key, value }) => {
      const countryDetails = Country.getCountryByCode(key);
      return {
        key: countryDetails?.isoCode
          ? `${countryDetails?.flag}    ${countryDetails?.name}`
          : key,
        value: value,
      };
    }),
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <ReusableChart title="Browser Usage" data={chartData.browsers} />
      <ReusableChart title="Device Usage" data={chartData.devices} />
      <ReusableChart title="Operating Systems" data={chartData.os} />
      <ReusableChart title="Top Countries" data={chartData.countries} />
    </div>
  );
}
