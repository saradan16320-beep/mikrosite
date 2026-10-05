import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Twitter, Linkedin, Facebook, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, title }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Failed to copy', e);
    }
  };

  const shareText = encodeURIComponent(`Kunjungi mikrosite tautan resmi ${title}: `);
  const encodedUrl = encodeURIComponent(url);

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      link: `https://api.whatsapp.com/send?text=${shareText}${encodedUrl}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      link: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`,
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-black dark:bg-slate-800 hover:bg-slate-900 text-white',
      link: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-700 hover:bg-blue-800 text-white',
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3">
          <Share2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Bagikan Tautan
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Sebarkan portal tautan pribadi Anda ke berbagai platform
        </p>

        {/* Share buttons grid */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {shareOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <a
                key={opt.name}
                href={opt.link}
                target="_blank"
                rel="noopener noreferrer"
                title={opt.name}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm ${opt.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate max-w-full">
                  {opt.name}
                </span>
              </a>
            );
          })}
        </div>

        {/* Copy Link input */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-left">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-300 font-mono truncate px-2 outline-hidden"
          />
          <button
            onClick={handleCopy}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
