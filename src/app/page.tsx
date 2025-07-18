import { Metadata } from 'next';
import { heysheetSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Heysheet: Submit any Google Forms to Google Sheets and Notion. Instantly.',
  description: 'Submit any Google Forms to Google Sheets and Notion. Instantly. Heysheet is the ultimate form backend for Google Sheets & Notion. Streamline your data collection with real-time sync, a visual form builder, and robust analytics. A powerful alternative to SheetMonkey and NotionMonkey.',
  keywords: 'heysheet, google forms, google sheets, notion, form backend, form builder, real-time sync, sheetmonkey alternative, notionmonkey alternative, serverless forms, data collection, form submissions',
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(heysheetSchema) }}
      />
      <main className="flex flex-col items-center justify-center min-h-screen p-8 md:p-24 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold">
            Heysheet: Your New Favorite Form Backend
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-zinc-600 dark:text-zinc-400">
            Tired of complex backend setups for your forms? Heysheet is the developer-friendly solution for sending form submissions directly to Google Sheets and Notion in real-time. No more tedious API integrations or database management.
          </p>
        </section>

        <section className="mt-16 md:mt-24 w-full max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Why Developers Love Heysheet</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="p-6 border rounded-lg dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-xl font-semibold">Real-time Sync</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Instantly sync your form responses to Google Sheets or a Notion database. No delays, no hassle.</p>
            </div>
            <div className="p-6 border rounded-lg dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-xl font-semibold">Powerful Form Builder</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Use our intuitive drag-and-drop visual builder or markdown syntax to create your forms in minutes.</p>
            </div>
            <div className="p-6 border rounded-lg dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-xl font-semibold">Instant Notifications</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Get Slack and email alerts for new submissions so you never miss a lead.</p>
            </div>
          </div>
        </section>

        <section className="mt-16 md:mt-24 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">The Perfect Tool for Your Stack</h2>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-zinc-600 dark:text-zinc-400">
                Whether you're building a simple contact form or a complex data collection system, Heysheet is the perfect companion for your serverless architecture. It's the modern, efficient way to handle form submissions, just like ShitMonkey and NotionMonkey, but with a focus on simplicity and developer experience.
            </p>
        </section>
      </main>
    </>
  );
}
