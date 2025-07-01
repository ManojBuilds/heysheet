export const NOTION_DATABASE_TEMPLATES = {
  "Simple CRM": {
    title: "Simple CRM",
    description: "Track contacts, companies, and deals.",
    properties: {
      Name: { title: {} },
      Email: { email: {} },
      Company: { rich_text: {} },
      "Deal Stage": { select: { options: [] } },
      Notes: { rich_text: {} },
    },
  },
  "Bug Tracker": {
    title: "Bug Tracker",
    description: "Log and manage bugs for your product.",
    properties: {
      Title: { title: {} },
      Status: { select: { options: [] } },
      Priority: { select: { options: [] } },
      Reporter: { rich_text: {} },
      Description: { rich_text: {} },
    },
  },
  "Content Calendar": {
    title: "Content Calendar",
    description: "Plan and schedule your content.",
    properties: {
      Title: { title: {} },
      Status: { select: { options: [] } },
      "Publish Date": { date: {} },
      Owner: { rich_text: {} },
      Notes: { rich_text: {} },
    },
  },
  "User Feedback": {
    title: "User Feedback",
    description: "Collect and organize user feedback.",
    properties: {
      Name: { title: {} },
      Email: { email: {} },
      Feedback: { rich_text: {} },
      Rating: { number: { format: "number" } },
    },
  },
  "Project Tasks": {
    title: "Project Tasks",
    description: "Manage project tasks and assignments.",
    properties: {
      Task: { title: {} },
      Assignee: { rich_text: {} },
      "Due Date": { date: {} },
      Status: { select: { options: [] } },
      Notes: { rich_text: {} },
    },
  },
};
