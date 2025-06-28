import ReusableChart from "@/components/dashboard/browser-chart";
import { getAllAnalyticsGroups } from "@/lib/data";
import { auth } from "@clerk/nextjs/server";
import { Country } from "country-state-city";

export default async function DashboardCharts({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) {
  const { userId } = await auth();
  const { browser, country, device_type, os } = await getAllAnalyticsGroups({
    userId: userId as string,
    fromDate,
    toDate,
  });
  return (
    <div className="grid grid-cols-4 gap-4">
      <ReusableChart title="Browser Usage" data={browser} />
      <ReusableChart title="Device Usage" data={device_type} />
      <ReusableChart title="Operating Systems" data={os} />
      <ReusableChart
        title="Top Countries"
        data={country.map((c) => {
          const countryInfo = Country.getCountryByCode(c.key);
          const key = countryInfo?.name
            ? `${countryInfo.flag} ${countryInfo.name}`
            : c.key;
          return { key, value: c.value };
        })}
      />
    </div>
  );
}
