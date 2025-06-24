import {
  CheckCircle,
  Zap,
  Share,
  Upload,
  Bell,
  BarChart3,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Google Sheets as Backend",
      description: "Form responses instantly sync to your Google Sheets.",
    },
    {
      icon: Zap,
      title: "Drag & Drop Form Builder",
      description: "Build beautiful forms easily — no coding required.",
    },
    {
      icon: Share,
      title: "Sharable Form Link",
      description: "Get a public URL to share your form anywhere.",
    },
    {
      icon: Upload,
      title: "File Upload Support",
      description: "Collect images, documents, and other files with submissions.",
      badge: "Starter & Pro",
    },
    {
      icon: Bell,
      title: "Slack & Email Notifications",
      description: "Stay notified when someone submits your form.",
      badge: "Starter & Pro",
    },
    {
      icon: BarChart3,
      title: "Built-in Analytics",
      description: "Track submission trends, devices, countries, and more.",
      badge: "Starter & Pro",
    },
  ];

  return (
    <section id='features' className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Everything you need to collect data
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Powerful features that make form building and data collection effortless
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-card p-8 rounded-xl transition-all duration-300 hover:shadow-xl">
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
