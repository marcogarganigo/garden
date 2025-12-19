// components/AdsterraBanner.tsx
import Script from 'next/script';

const AdsterraBanner = () => {
  return (
    <div>
      {/* Script di configurazione */}
      <Script
        id="adsterra-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            atOptions = {
              'key' : '4fec492b1d10c0ec6fe34a7ba2e84252',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };
          `,
        }}
      />
      {/* Script esterno */}
      <Script
        src="https://www.highperformanceformat.com/4fec492b1d10c0ec6fe34a7ba2e84252/invoke.js"
        strategy="afterInteractive"
      />
    </div>
  );
};

export default AdsterraBanner;
