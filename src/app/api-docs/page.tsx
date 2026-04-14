'use client';

import dynamic from 'next/dynamic';

const RedocStandalone = dynamic(() => import('redoc').then((mod) => mod.RedocStandalone), {
  ssr: false,
});

export default function ApiDocsPage() {
  return (
    <RedocStandalone
      specUrl="/api/openapi.json"
      options={{
        hideDownloadButton: false,
        theme: { colors: { primary: { main: '#2563eb' } } },
      }}
    />
  );
}
