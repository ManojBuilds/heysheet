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
    primaryColor: '#2563EB',      // Blue
    secondaryColor: '#3B82F6',    // Lighter blue
    accentColor: '#10B981',       // Success green
    backgroundColor: '#FFFFFF',    // White
    backgroundSecondary: '#F8FAFC', // Light gray
    textColor: '#1F2937',         // Dark gray
    textColorSecondary: '#4B5563', // Medium gray
    borderColor: '#E2E8F0',       // Light gray border
    errorColor: '#DC2626',        // Error red
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    primaryColor: '#6366F1',      // Indigo
    secondaryColor: '#818CF8',    // Lighter indigo
    accentColor: '#8B5CF6',       // Purple
    backgroundColor: '#18181B',    // Dark background
    backgroundSecondary: '#27272A', // Slightly lighter dark
    textColor: '#F3F4F6',         // Light gray
    textColorSecondary: '#D1D5DB', // Medium gray
    borderColor: '#374151',        // Dark border
    errorColor: '#EF4444',         // Error red
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    primaryColor: '#10B981',      // Emerald
    secondaryColor: '#34D399',    // Lighter emerald
    accentColor: '#06B6D4',       // Cyan
    backgroundColor: '#F9FAFB',    // Light gray
    backgroundSecondary: '#F3F4F6', // Slightly darker gray
    textColor: '#111827',         // Near black
    textColorSecondary: '#374151', // Dark gray
    borderColor: '#E5E7EB',       // Light border
    errorColor: '#EF4444',        // Error red
  },
  {
    id: 'corporate',
    name: 'Corporate',
    primaryColor: '#0EA5E9',      // Sky blue
    secondaryColor: '#38BDF8',    // Lighter sky
    accentColor: '#0284C7',       // Darker sky
    backgroundColor: '#F1F5F9',    // Light slate
    backgroundSecondary: '#E2E8F0', // Slate
    textColor: '#0F172A',         // Dark slate
    textColorSecondary: '#334155', // Medium slate
    borderColor: '#CBD5E1',       // Light slate border
    errorColor: '#DC2626',        // Error red
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    primaryColor: '#F59E42',      // Orange
    secondaryColor: '#FBBF24',    // Amber
    accentColor: '#EF4444',       // Red
    backgroundColor: '#FFF7ED',    // Light orange
    backgroundSecondary: '#FFEDD5', // Lighter orange
    textColor: '#78350F',         // Dark brown
    textColorSecondary: '#92400E', // Medium brown
    borderColor: '#FED7AA',       // Light orange border
    errorColor: '#DC2626',        // Error red
  },
  {
    id: 'elegant',
    name: 'Elegant',
    primaryColor: '#A21CAF',      // Purple
    secondaryColor: '#C026D3',    // Lighter purple
    accentColor: '#7C3AED',       // Violet
    backgroundColor: '#F3E8FF',    // Light purple
    backgroundSecondary: '#EDE9FE', // Light violet
    textColor: '#3B0764',         // Dark purple
    textColorSecondary: '#581C87', // Medium purple
    borderColor: '#E9D5FF',       // Light purple border
    errorColor: '#DC2626',        // Error red
  }
];

