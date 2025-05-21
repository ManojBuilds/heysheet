"use client";

import { createContext, useContext, useState } from "react";

type Element = 'input' | 'textarea' | 'dropdown' | 'file-upload';

interface FormBuilderField {
    element: Element;
    isRequired: boolean;
    label: string;
    placeholder?: string;
}

interface FormPage {
    id: string;
    title: string;
    fields: FormBuilderField[];
}

interface Theme {
    primary: string;
    secondary: string;
    background: string;
    text: string;
}

interface IFormBuilder {
    title: string;
    setTitle: (title: string) => void;
    id: string;
    setId: (id: string) => void;
    pages: FormPage[];
    setPages: (pages: FormPage[]) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const defaultTheme: Theme = {
    primary: "#000000",
    secondary: "#ffffff",
    background: "#f5f5f5",
    text: "#222222",
};

export const FormBuilderContext = createContext<IFormBuilder>({
    title: "",
    setTitle: () => {},
    id: "",
    setId: () => {},
    pages: [],
    setPages: () => {},
    theme: defaultTheme,
    setTheme: () => {},
});

export const FormBuilderProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [title, setTitle] = useState("");
    const [id, setId] = useState("");
    const [pages, setPages] = useState<FormPage[]>([]);
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    return (
        <FormBuilderContext.Provider
            value={{
                title,
                setTitle,
                id,
                setId,
                pages,
                setPages,
                theme,
                setTheme,
            }}
        >
            {children}
        </FormBuilderContext.Provider>
    );
};

export const useFormBuilder = () => useContext(FormBuilderContext);
