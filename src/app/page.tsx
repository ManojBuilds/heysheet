import { Metadata } from 'next';
import { heysheetSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Heysheet: The Ultimate Form Backend for Google Sheets & Notion',
  description: 'Streamline your data collection with Heysheet, the leading form backend for developers. Instantly send form submissions to Google Sheets and Notion. Features real-time sync, a visual form builder, and robust analytics. Perfect for HTML forms and serverless applications.',
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(heysheetSchema) }}
      />
      <main className="flex flex-col items-center justify-center min-h-screen p-8 md:p-24">
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold">
            Heysheet: Your New Favorite Form Backend
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Tired of complex backend setups for your forms? Heysheet is the developer-friendly solution for sending form submissions directly to Google Sheets and Notion in real-time. No more tedious API integrations or database management.
          </p>
        </section>

        <section className="mt-16 md:mt-24 w-full max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Why Developers Love Heysheet</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold">Real-time Sync</h3>
              <p className="mt-2">Instantly sync your form responses to Google Sheets or a Notion database. No delays, no hassle.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold">Powerful Form Builder</h3>
              <p className="mt-2">Use our intuitive drag-and-drop visual builder or markdown syntax to create your forms in minutes.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold">Instant Notifications</h3>
              <p className="mt-2">Get Slack and email alerts for new submissions so you never miss a lead.</p>
            </div>
          </div>
        </section>

        <section className="mt-16 md:mt-24 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">The Perfect Tool for Your Stack</h2>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
                Whether you're building a simple contact form or a complex data collection system, Heysheet is the perfect companion for your serverless architecture. It's the modern, efficient way to handle form submissions, just like ShitMonkey and NotionMonkey, but with a focus on simplicity and developer experience.
            </p>
        </section>
      </main>
    </>
  );
}
