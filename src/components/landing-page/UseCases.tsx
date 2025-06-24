import { Briefcase, Users, CalendarCheck2, MessageSquare, ClipboardList, FilePlus } from "lucide-react";

const useCases = [
  {
    icon: Users,
    title: "Lead Capture",
    description: "Embed forms on landing pages to collect leads directly into Google Sheets.",
  },
  {
    icon: ClipboardList,
    title: "Feedback & Surveys",
    description: "Easily gather customer insights, reviews, and survey responses.",
  },
  {
    icon: CalendarCheck2,
    title: "Event Registrations",
    description: "Manage RSVPs and guest lists seamlessly with real-time syncing.",
  },
  {
    icon: Briefcase,
    title: "Job Applications",
    description: "Collect resumes and application data directly into your spreadsheet.",
  },
  {
    icon: MessageSquare,
    title: "Contact Forms",
    description: "Add branded forms to your website to collect messages and inquiries.",
  },
  {
    icon: FilePlus,
    title: "Internal Requests",
    description: "Use forms for internal teams — IT helpdesk, HR requests, and more.",
  },
];

const UseCases = () => {
  return (
    <section id="use-cases" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Built for every use case
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            From startups to enterprises — Heysheet helps teams collect and organize data with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, idx) => (
            <div
              key={idx}
              className="group bg-card rounded-xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-5 flex items-center justify-center w-12 h-12 rounded bg-muted group-hover:scale-110 transition-transform duration-300">
                <useCase.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-100 group-hover:text-green-400 transition-colors duration-300">
                {useCase.title}
              </h3>
              <p className="text-zinc-400">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
