import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "./CopyToClipboard";
import { cn } from "@/lib/utils";

const CodeBlock = ({ code, lang }: { code: string; lang: string }) => (
  <div className={cn("relative group")}>
    <CopyToClipboard
      text={code}
      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
    />
    <SyntaxHighlighter
      language={lang}
      style={vscDarkPlus}
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

export default CodeBlock;
