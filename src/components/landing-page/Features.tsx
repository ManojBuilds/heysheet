import { CheckCircle, Zap, Bell, BarChart3 } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Google Sheets Sync",
      description: "Responses update your spreadsheet instantly.",
    },
    {
      icon: Zap,
      title: "Customizable Forms",
      description: "Add custom fields, branding, and logic.",
    },
    {
      icon: Bell,
      title: "Slack & Email Alerts",
      description: "Get notified instantly when someone fills your form.",
      badge: "Starter & Pro",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track submissions, countries, browsers and more.",
      badge: "Starter & Pro",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="">Everything you need to collect data</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Powerful features that make form building and data collection
            effortless
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-card p-8">
              <div className="relative mb-6">
                <div className="w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 bg-muted rounded">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                {feature.badge && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-400 text-zinc-900 text-xs px-2 py-1 rounded-full font-medium">
                    {feature.badge}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-3 text-zinc-100 group-hover:text-green-400 transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
