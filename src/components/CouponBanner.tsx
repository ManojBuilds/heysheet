'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import { config } from '@/config';

const CouponBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const couponCode = config.couponeCode;

  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1); // 24 hours from now
    return date;
  }, []);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const difference = +targetDate - +now;

    if (difference <= 0) return null;

    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);

      if (!updated) {
        clearInterval(timer);
        setShowBanner(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const handleCopy = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!showBanner || !couponCode || !timeLeft) return null;

  const renderTime = (label: string, value: number) => (
    <span className="font-bold ml-1">
      {value.toString().padStart(2, '0')}
      {label}
    </span>
  );

  return (
    <div className="bg-yellow-400 text-black text-center py-2 px-4 relative shadow-md z-50">
      <p className="text-sm font-medium">
        🎉 Get <span className="font-bold">10% off</span>on your first submission!
        Use coupon code <span className="font-bold">{couponCode}</span>
        <span
          className="font-bold cursor-pointer underline"
          onClick={handleCopy}
          title="Click to copy coupon code"
        >
          {copied ? "Copied!" : "(Click to copy)"}
        </span>
        • 
        <br className='sm:hidden'/>
        Offer ends in:
        {renderTime('h', timeLeft.hours)}::
        {renderTime('m', timeLeft.minutes)}::
        {renderTime('s', timeLeft.seconds)}
      </p>

      <button
        onClick={() => setShowBanner(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CouponBanner;
