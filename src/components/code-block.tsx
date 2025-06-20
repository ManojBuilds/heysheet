import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ code, lang }: { code: string; lang: string }) => (
  <SyntaxHighlighter language={lang} style={oneDark}>
    {code}
  </SyntaxHighlighter>
);

export default CodeBlock;
