export type FormComponentType =
  | "short-text"
  | "long-text"
  | "multiple-choice"
  | "single-choice"
  | "dropdown"
  | "email"
  | "phone"
  | "number"
  | "date"
  | "rating"
  | "file"
  | "url"
  | "heading"
  | "subheading"
  | "paragraph"
  | "address";

export interface FormComponent {
  id: string;
  type: FormComponentType;
  title: string;
  description?: string;
  required: boolean;
  name: string;
  properties: Record<string, any>;
  pageId?: string;
}

export interface FormTheme {
  primary: string;
  primaryForeground: string;
  primaryHover: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  background: string;
  backgroundSecondary: string;
  text: string;
  textSecondary: string;
  border: string;
  font: string;
  radius: string;
  mode: "light" | "dark";
  error: string;
}

export interface FormPage {
  id: string;
  title: string;
}

export interface SuccessPage {
  title: string;
  description: string;
  customContent?: string;
}

export interface FormData {
  id: string;
  title: string;
  description?: string;
  theme: FormTheme;
  components: FormComponent[];
  pages: FormPage[];
  activePage: string;
  successPage: SuccessPage;
}

export interface TopFormsAnalyticsData {
  id: string;
  title: string;
  submission_count: number;
}
