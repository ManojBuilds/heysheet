import { WithContext, SoftwareApplication } from 'schema-dts';

export const heysheetSchema: WithContext<SoftwareApplication> = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  'name': 'Heysheet',
  'applicationCategory': 'DeveloperApplication',
  'operatingSystem': 'Web',
  'description': 'Heysheet is a form backend for developers that sends submissions to Google Sheets and Notion in real-time. It offers a visual form builder, analytics, and notifications.',
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD',
  },
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.8',
    'reviewCount': '25',
  },
  'keywords': ['form backend', 'google sheets', 'notion', 'developer tools', 'html forms', 'serverless forms'],
};
