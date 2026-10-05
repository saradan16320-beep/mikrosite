import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, QrCode as QrIcon } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  name: string;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, url, name }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && url) {
      QRCode.toDataURL(
        url,
        {
          width: 320,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (err, dataUrl) => {
          if (!err && dataUrl) {
            setQrDataUrl(dataUrl);
          }
        }
      );
    }
  }, [isOpen, url]);

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

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
  };

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
          <QrIcon className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Bagikan Mikrosite
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
          Pindai QR code ini menggunakan kamera smartphone Anda
        </p>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl inline-block shadow-inner border border-slate-200 mx-auto">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt={`QR Code ${name}`} className="w-56 h-56 mx-auto rounded-lg" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-400">
              Membuat QR...
            </div>
          )}
        </div>

        {/* URL Box */}
        <div className="mt-4 flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-left">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-300 font-mono truncate px-2 outline-hidden"
          />
          <button
            onClick={handleCopy}
            className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Gambar QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
