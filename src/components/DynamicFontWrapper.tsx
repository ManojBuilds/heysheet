import Head from "next/head";
import { ReactNode } from "react";

interface Props {
  font: string; 
  children: ReactNode;
}

export function DynamicFontWrapper({ font, children }: Props) {
  const fontName = font.replace(/ /g, "+"); 
  const fontFamily = `'${font}', sans-serif`;

  return (
    <>
      <Head>
        <link
          href={`https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;700&display=swap`}
          rel="stylesheet"
        />
      </Head>
      <div style={{ fontFamily: `${fontFamily} !important` }}>{children}</div>
    </>
  );
}
