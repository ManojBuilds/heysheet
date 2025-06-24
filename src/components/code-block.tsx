import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "./CopyToClipboard";

const CodeBlock = ({ code, lang }: { code: string; lang: string }) => (
  <div className="relative group">
    <CopyToClipboard
      text={code}
      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
    />
    <SyntaxHighlighter language={lang} style={oneDark}>
      {code}
    </SyntaxHighlighter>
  </div>
);

export default CodeBlock;
