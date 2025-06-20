import { FileText, Link, Share2 } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Create",
      description: "Build your form with our visual builder or markdown syntax",
    },
    {
      number: "02",
      icon: Link,
      title: "Connect",
      description: "Link it to your Google Sheets with one click",
    },
    {
      number: "03",
      icon: Share2,
      title: "Share",
      description: "Embed or share the link — responses go live instantly",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 bg-clip-text text-transparent">
              How it works
            </span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Get up and running in minutes with our simple 3-step process
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 text-6xl font-bold text-zinc-800 group-hover:text-zinc-700 transition-colors duration-300">
                  {step.number}
                </div>

                {/* Icon container */}
                <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-green-500/25">
                  <step.icon className="h-10 w-10 text-white" />
                </div>

                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-400/50 to-emerald-400/50 transform translate-x-10" />
                )}
              </div>

              <h3 className="text-2xl font-bold mb-4 text-zinc-100 group-hover:text-green-400 transition-colors duration-300">
                {step.title}
              </h3>

              <p className="text-zinc-400 text-lg leading-relaxed max-w-sm mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
