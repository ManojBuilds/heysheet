'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormElement, InputType } from '@/types/form-builder';

interface PropertiesPanelProps {
  element: FormElement;
  onClose: () => void;
  onUpdate: (updatedElement: FormElement) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ element, onClose, onUpdate }) => {
  // Keep track of the properties panel tabs separately
  const [activeTab, setActiveTab] = useState('basic');
  const [openSections, setOpenSections] = useState({
    basic: true,
    validation: true,
    styling: true,
  });
  
  if (!element) {
    return null;
  }

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePropertyChange = (property: string, value: any) => {
    const updatedElement = { 
      ...element,
      [property]: value 
    };
    onUpdate(updatedElement);
  };

  const handleStyleChange = (property: string, value: any) => {
    const updatedElement = { 
      ...element,
      styles: {
        ...element.styles,
        [property]: value
      }
    };
    onUpdate(updatedElement);
  };

  const inputTypes: InputType[] = ['text', 'email', 'url', 'password', 'tel', 'search'];
  const shadowOptions = [
    { label: 'None', value: 'none' },
    { label: 'Small', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    { label: 'Medium', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
    { label: 'Large', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }
  ];
  const borderRadiusOptions = [
    { label: 'None', value: '0' },
    { label: 'Small', value: '0.25rem' },
    { label: 'Medium', value: '0.375rem' },
    { label: 'Large', value: '0.5rem' },
    { label: 'Full', value: '9999px' }
  ];

  return (
    <div className="w-80 flex-shrink-0 border-l bg-white p-4 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Element Properties</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="styling">Styling</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          {/* Basic Properties Section */}
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('basic')}
          >
            <h3 className="font-medium">Basic Properties</h3>
            {openSections.basic ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
          
          {openSections.basic && (
            <div className="space-y-4 pl-2">
              <div className="space-y-2">
                <Label htmlFor="element-label">Label</Label>
                <Input 
                  id="element-label" 
                  value={element.label} 
                  onChange={(e) => handlePropertyChange('label', e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="element-required">Required</Label>
                <Switch 
                  id="element-required" 
                  checked={element.required} 
                  onCheckedChange={(checked) => handlePropertyChange('required', checked)}
                />
              </div>

              {element.type === 'text' && (
                <div className="space-y-2">
                  <Label htmlFor="element-input-type">Input Type</Label>
                  <Select 
                    value={element.inputType || 'text'}
                    onValueChange={(value) => handlePropertyChange('inputType', value as InputType)}
                  >
                    <SelectTrigger id="element-input-type">
                      <SelectValue placeholder="Select input type" />
                    </SelectTrigger>
                    <SelectContent>
                      {inputTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(element.type === 'text' || element.type === 'number' || element.type === 'date' || element.type === 'select') && (
                <div className="space-y-2">
                  <Label htmlFor="element-placeholder">Placeholder</Label>
                  <Input 
                    id="element-placeholder" 
                    value={element.placeholder} 
                    onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                  />
                </div>
              )}

              {element.type === 'textarea' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="element-placeholder">Placeholder</Label>
                    <Input 
                      id="element-placeholder" 
                      value={element.placeholder} 
                      onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="element-rows">Rows</Label>
                    <Input 
                      id="element-rows" 
                      type="number"
                      value={element.rows} 
                      min={1}
                      max={10}
                      onChange={(e) => handlePropertyChange('rows', parseInt(e.target.value))}
                    />
                  </div>
                </>
              )}

              {element.type === 'number' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="element-min">Min Value</Label>
                    <Input 
                      id="element-min" 
                      type="number"
                      value={element.min || ''} 
                      onChange={(e) => handlePropertyChange('min', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="element-max">Max Value</Label>
                    <Input 
                      id="element-max" 
                      type="number"
                      value={element.max || ''} 
                      onChange={(e) => handlePropertyChange('max', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Options Section for select, checkbox, radio */}
          {(element.type === 'select' || element.type === 'checkbox' || element.type === 'radio') && (
            <>
              <div 
                className="flex items-center justify-between cursor-pointer mt-4"
                onClick={() => toggleSection('options')}
              >
                <h3 className="font-medium">Options</h3>
                {openSections.basic ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
              
              {openSections.basic && (
                <div className="space-y-2 pl-2">
                  {element.options.map((option, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input 
                        value={option} 
                        onChange={(e) => {
                          const newOptions = [...element.options];
                          newOptions[index] = e.target.value;
                          handlePropertyChange('options', newOptions);
                        }}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          const newOptions = element.options.filter((_, i) => i !== index);
                          handlePropertyChange('options', newOptions);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const newOptions = [...element.options, `Option ${element.options.length + 1}`];
                      handlePropertyChange('options', newOptions);
                    }}
                  >
                    Add Option
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="styling" className="space-y-4">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('styling')}
          >
            <h3 className="font-medium">Styling</h3>
            {openSections.styling ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
          
          {openSections.styling && (
            <div className="space-y-4 pl-2">
              <div className="space-y-2">
                <Label htmlFor="element-border-radius">Border Radius</Label>
                <Select
                  value={element.styles?.borderRadius || '0.375rem'}
                  onValueChange={(value) => handleStyleChange('borderRadius', value)}
                >
                  <SelectTrigger id="element-border-radius">
                    <SelectValue placeholder="Select border radius" />
                  </SelectTrigger>
                  <SelectContent>
                    {borderRadiusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="element-shadow">Shadow</Label>
                <Select
                  value={element.styles?.shadow || 'none'}
                  onValueChange={(value) => handleStyleChange('shadow', value)}
                >
                  <SelectTrigger id="element-shadow">
                    <SelectValue placeholder="Select shadow" />
                  </SelectTrigger>
                  <SelectContent>
                    {shadowOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="element-bg-color">Background Color</Label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    id="element-bg-color"
                    value={element.styles?.backgroundColor || '#FFFFFF'} 
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} 
                    className="w-10 h-10 rounded-md cursor-pointer"
                  />
                  <Input 
                    value={element.styles?.backgroundColor || '#FFFFFF'} 
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="element-text-color">Text Color</Label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    id="element-text-color"
                    value={element.styles?.textColor || '#000000'} 
                    onChange={(e) => handleStyleChange('textColor', e.target.value)} 
                    className="w-10 h-10 rounded-md cursor-pointer"
                  />
                  <Input 
                    value={element.styles?.textColor || '#000000'} 
                    onChange={(e) => handleStyleChange('textColor', e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="element-border-color">Border Color</Label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    id="element-border-color"
                    value={element.styles?.borderColor || '#E5E7EB'} 
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)} 
                    className="w-10 h-10 rounded-md cursor-pointer"
                  />
                  <Input 
                    value={element.styles?.borderColor || '#E5E7EB'} 
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};