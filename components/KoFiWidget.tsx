'use client'

import { useEffect } from 'react';

export default function KoFiWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
    script.async = true;

    script.onload = () => {
      if ((window as any).kofiWidgetOverlay) {
        (window as any).kofiWidgetOverlay.draw('marcogarganigo', {
          type: 'floating-chat',
          'floating-chat.donateButton.text': 'Support me',
          'floating-chat.donateButton.background-color': '#7dc781ff',
          'floating-chat.donateButton.text-color': '#fff',
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
