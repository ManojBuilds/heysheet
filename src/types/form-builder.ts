
export type FormComponentType = 
  | 'short-text'
  | 'long-text'
  | 'multiple-choice'
  | 'single-choice'
  | 'dropdown'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'rating'

export interface FormComponent {
  id: string;
  type: FormComponentType;
  title: string;
  description?: string;
  required: boolean;
  name: string
  properties: Record<string, any>;
  pageId?: string;
}


export interface FormTheme {
  id: string;
  name: string;
  primaryColor: string;         // Main action color
  secondaryColor: string;       // Secondary actions/hover states
  accentColor: string;         // Highlights and accents
  backgroundColor: string;      // Main background
  backgroundSecondary: string;  // Secondary background (cards, sections)
  textColor: string;           // Primary text
  textColorSecondary: string;  // Secondary/muted text
  borderColor: string;         // Borders and dividers
  errorColor: string;          // Error states
}

export interface FormPage {
  id: string;
  title: string;
}

export interface SuccessPage {
  title: string;
  description: string;
  customContent?: string
}

export interface FormData {
  id: string;
  title: string;
  description?: string;
  theme: FormTheme;
  components: FormComponent[];
  pages: FormPage[];
  activePage: string;
  successPage: SuccessPage
}
