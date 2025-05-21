
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
  properties: Record<string, any>;
  pageId?: string;
}

export interface FormTheme {
  id: string;
  name: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface FormPage {
  id: string;
  title: string;
}

export interface FormData {
  id: string;
  title: string;
  description?: string;
  theme: FormTheme;
  components: FormComponent[];
  pages: FormPage[];
  activePage: string;
}
