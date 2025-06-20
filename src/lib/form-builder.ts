import { FormComponentType, FormTheme } from "@/types/form-builder";

export const FORM_COMPONENT_TYPES: {
  type: FormComponentType;
  label: string;
  icon: string;
  content?: string;
}[] = [
  { type: "short-text", label: "Short Text", icon: "text" },
  { type: "long-text", label: "Long Text", icon: "text" },
  { type: "multiple-choice", label: "Multiple Choice", icon: "check" },
  { type: "single-choice", label: "Single Choice", icon: "circle-check" },
  { type: "dropdown", label: "Dropdown", icon: "chevron-down" },
  { type: "email", label: "Email", icon: "mail" },
  { type: "phone", label: "Phone", icon: "phone" },
  { type: "number", label: "Number", icon: "hash" },
  { type: "date", label: "Date", icon: "calendar" },
  { type: "rating", label: "Rating", icon: "star" },
  { type: "file", label: "File Upload", icon: "file" },
  { type: "url", label: "URL Input", icon: "link" },
  {
    type: "heading",
    label: "Heading",
    icon: "heading",
    content: "Start typing",
  },
  {
    type: "subheading",
    label: "Subheading",
    icon: "heading-2",
    content: "Start typing",
  },
  {
    type: "paragraph",
    label: "Paragraph",
    icon: "align-left",
    content: "Start typing",
  },
  // { type: "address", label: "Address", icon: "align-left" },
];

export const FONT_FAMILIES = [
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Playfair Display", value: "Playfair Display, serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
  { name: "Lato", value: "Lato, sans-serif" },
  { name: "Merriweather", value: "Merriweather, serif" },
];
