import { FormComponentType, FormTheme } from "@/types/form-builder";

export const FORM_COMPONENT_TYPES: { type: FormComponentType; label: string; icon: string; }[] = [
  { type: 'short-text', label: 'Short Text', icon: 'text' },
  { type: 'long-text', label: 'Long Text', icon: 'text' },
  { type: 'multiple-choice', label: 'Multiple Choice', icon: 'check' },
  { type: 'single-choice', label: 'Single Choice', icon: 'circle-check' },
  { type: 'dropdown', label: 'Dropdown', icon: 'chevron-down' },
  { type: 'email', label: 'Email', icon: 'mail' },
  { type: 'phone', label: 'Phone', icon: 'phone' },
  { type: 'number', label: 'Number', icon: 'hash' },
  { type: 'date', label: 'Date', icon: 'calendar' },
  { type: 'rating', label: 'Rating', icon: 'star' },
];

export const FONT_FAMILIES = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Playfair Display', value: 'Playfair Display, serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
];

export const DEFAULT_FORM_THEMES: FormTheme[] = [
  {
    id: 'classic',
    name: 'Classic',
    primaryColor: '#2563EB', // Blue
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    primaryColor: '#6366F1', // Indigo
    backgroundColor: '#18181B',
    textColor: '#F3F4F6',
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    primaryColor: '#10B981', // Emerald
    backgroundColor: '#F9FAFB',
    textColor: '#111827',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    primaryColor: '#0EA5E9', // Sky
    backgroundColor: '#F1F5F9',
    textColor: '#0F172A',
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    primaryColor: '#F59E42', // Orange
    backgroundColor: '#FFF7ED',
    textColor: '#78350F',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    primaryColor: '#A21CAF', // Purple
    backgroundColor: '#F3E8FF',
    textColor: '#3B0764',
  },
];