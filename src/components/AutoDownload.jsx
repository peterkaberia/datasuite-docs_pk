"use client";

import { useEffect, useState } from 'react';
import { Callout } from 'nextra/components'
import Link from 'next/link'

// Map the short 'dv' URL parameters to the strict API format and a friendly display name
const platformMap = {
  'win64user': { api: 'win32-x64-user' },
  'win64': { api: 'win32-x64-system' },
  'winzip': { api: 'win32-x64-archive' },
  
  'winarm64user': { api: 'win32-arm64-user' },
  'winarm64': { api: 'win32-arm64-system' },
  'winarm64zip': { api: 'win32-arm64-archive' },
  
  'linux64_deb': { api: 'linux-x64' } 
};

export function AutoDownload({ 
  messageText = "Your download of DataSuite should start shortly.", 
  linkText = "Click here if your download doesn't start." 
}) {
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    // 1. Grab the URL parameter on the client-side
    const params = new URLSearchParams(window.location.search);
    const dv = params.get('dv') || 'win64user'; // Fallback to standard Windows System setup
    
    // 2. Look up the mapping. If an unknown 'dv' is passed, gracefully fallback.
    const mappedConfig = platformMap[dv] || { api: dv };
    
    // 3. Construct the API route dynamically using the mapped API string
    const url = `/api/download/${mappedConfig.api}/stable`;
    
    setDownloadUrl(url);

    // 4. Trigger the download after 2 seconds
    const timer = setTimeout(() => {
      window.location.href = url;
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Don't render the button until the URL is built
  if (!downloadUrl) return null;

  return (

    <Callout type="info">
      {messageText} 
      <Link 
        href={downloadUrl}
        style={{ 
          color: '#0066cc', 
          textDecoration: 'underline', 
          textUnderlineOffset: '3px',
          fontWeight: 500 
        }}
      >
        {linkText}
      </Link>
    </Callout>
  );
}