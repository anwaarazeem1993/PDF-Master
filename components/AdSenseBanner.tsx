import React, { useEffect } from 'react';

interface AdSenseBannerProps {
  client?: string;
  slot?: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  client = "ca-pub-1234567890123456",
  slot = "1234567890",
  format = "auto",
  responsive = true,
  className = ""
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const win = window as any;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense Error:', e);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center relative shadow-inner border border-slate-100 dark:border-slate-800 ${className}`}>
      <span className="absolute text-slate-300 dark:text-slate-600/50 text-[10px] font-black uppercase tracking-[0.3em] pointer-events-none z-0">
        Advertisement
      </span>
      <div className="relative z-10 w-full min-h-[90px]">
        <ins className="adsbygoogle w-full"
             style={{ display: 'block' }}
             data-ad-client={client}
             data-ad-slot={slot}
             data-ad-format={format}
             data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
};

export default AdSenseBanner;
