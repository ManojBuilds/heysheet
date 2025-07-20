"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "./CopyToClipboard";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const CodeBlock = ({ code, lang }: { code: string; lang: string }) => {
  const { theme } = useTheme();
  return (
    <div className={cn("relative group")}>
      <CopyToClipboard
        text={code}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
      />
      <SyntaxHighlighter
        language={lang}
        style={theme === "dark" ? vscDarkPlus : oneLight}
        customStyle={{
          borderRadius: "0.5rem",
          background: "transparent",
          margin: 0,
          padding: "1.5em 1em 1em 1em",
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
