'use client';

import { useState, useEffect } from 'react';
import { FaRegEnvelope, FaCheck, FaCopy } from 'react-icons/fa';

// Default obfuscated parts (user + domain) to prevent crawler harvesting
const DEFAULT_USER = 'austinmaina.dev';
const DEFAULT_DOMAIN = 'gmail.com';

interface ObfuscatedEmailProps {
  user?: string;
  domain?: string;
  className?: string;
  showIcon?: boolean;
  subject?: string;
  asButton?: boolean;
}

export default function ObfuscatedEmail({
  user = DEFAULT_USER,
  domain = DEFAULT_DOMAIN,
  className = '',
  showIcon = true,
  subject = 'Inquiry - AM Softwares Ke',
  asButton = false,
}: ObfuscatedEmailProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = `${user}@${domain}`;
    const mailtoUrl = subject
      ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
      : `mailto:${email}`;
    window.location.href = mailtoUrl;
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const email = `${user}@${domain}`;
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Static SSR fallback: renders obfuscated placeholder that cannot be scraped by bots
  if (!mounted) {
    return (
      <span className={`inline-flex items-center gap-1.5 opacity-80 cursor-pointer ${className}`}>
        {showIcon && <FaRegEnvelope className="text-primary text-xs shrink-0" />}
        <span className="select-none font-mono text-xs">contact [at] amsoftwares</span>
      </span>
    );
  }

  const emailText = `${user}@${domain}`;

  return (
    <span className="inline-flex items-center gap-2 group">
      <a
        href="#"
        onClick={handleClick}
        title="Click to send an email"
        className={`inline-flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer ${className}`}
      >
        {showIcon && <FaRegEnvelope className="text-primary text-xs shrink-0 group-hover:scale-110 transition-transform" />}
        <span className="tracking-tight">{emailText}</span>
      </a>

      {/* Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy email address"
        title={copied ? 'Copied to clipboard!' : 'Copy email address'}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary text-[11px]"
      >
        {copied ? <FaCheck className="text-emerald-500 text-[10px]" /> : <FaCopy className="text-[10px]" />}
      </button>
    </span>
  );
}
