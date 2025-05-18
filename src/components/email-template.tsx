import * as React from "react";

interface EmailTemplateProps {
  data: Record<string, any>;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  data,
}) => (
  <div>
    <h1>Hey, You just got new submission</h1>
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
    {/* Render more fields from data as needed */}
  </div>
);
