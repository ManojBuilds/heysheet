import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FAQ = () => {
  const faqs = [
    {
      question: "What counts as a submission?",
      answer:
        "Every time someone fills out and submits your form, it counts as one submission. Partial submissions and spam are automatically filtered out.",
    },
    {
      question: "Can I upgrade anytime?",
      answer:
        "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
    },
    {
      question: "How does the Google Sheets integration work?",
      answer:
        "Simply connect your Google account and select the spreadsheet. New form submissions will appear as rows in real-time - no delays, no manual exports needed.",
    },
    {
      question: "Do you store my form responses?",
      answer:
        "We temporarily store responses to ensure reliable delivery to your Google Sheets. Data is encrypted and automatically deleted after 30 days for security.",
    },
    // {
    //   question: "Can I export data from the dashboard?",
    //   answer:
    //     "Yes! Starter and Pro users can export all form data and analytics in CSV, Excel, or JSON formats. Free users have basic export capabilities.",
    // },
    // {
    //   question: "What happens if I exceed my submission limit?",
    //   answer:
    //     "We'll notify you when you're approaching your limit. If exceeded, your forms will still work, but you'll need to upgrade to continue receiving new submissions.",
    // },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 bg-clip-text text-transparent">
              Frequently asked questions
            </span>
          </h2>
          <p className="text-xl text-zinc-400">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="">
              <AccordionTrigger className="">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-zinc-400 pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-zinc-400 mb-4">Still have questions?</p>
          <Button
            variant="outline"
            className="border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:border-green-400"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
