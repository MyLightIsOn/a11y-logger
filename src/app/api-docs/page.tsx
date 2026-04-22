'use client';

import dynamic from 'next/dynamic';

const RedocStandalone = dynamic(() => import('redoc').then((mod) => mod.RedocStandalone), {
  ssr: false,
});

export default function ApiDocsPage() {
  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <RedocStandalone
        specUrl="/api/openapi.json"
        options={{
          hideDownloadButton: false,
          theme: {
            colors: { primary: { main: '#2563eb' } },
            rightPanel: { backgroundColor: '#1e2a3a' },
            sidebar: { backgroundColor: '#f8fafc' },
            codeBlock: { backgroundColor: '#1e293b' },
          },
        }}
      />
    </div>
  );
}
