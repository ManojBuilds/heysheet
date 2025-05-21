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
    id: 'default',
    name: 'Default',
    primaryColor: '#8B5CF6',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px',
  },
  {
    id: 'dark',
    name: 'Dark',
    primaryColor: '#8B5CF6',
    backgroundColor: '#1F2937',
    textColor: '#F3F4F6',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    primaryColor: '#6B7280',
    backgroundColor: '#F9FAFB',
    textColor: '#1F2937',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '4px',
  },
  {
    id: 'rounded',
    name: 'Rounded',
    primaryColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
    textColor: '#1E3A8A',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '16px',
  },
  {
    id: 'playful',
    name: 'Playful',
    primaryColor: '#EC4899',
    backgroundColor: '#FDFCFE',
    textColor: '#831843',
    fontFamily: 'Poppins, sans-serif',
    borderRadius: '12px',
  },
];