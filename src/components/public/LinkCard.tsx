import React from 'react';
import { ExternalLink, Sparkles, MousePointerClick } from 'lucide-react';
import { MicrositeLink } from '../../types';
import { renderIcon, getThemeClasses } from '../../utils/iconMap';

interface LinkCardProps {
  link: MicrositeLink;
  themeColor: string;
  onLinkClick: (id: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, themeColor, onLinkClick }) => {
  const theme = getThemeClasses(themeColor);

  const handleClick = () => {
    onLinkClick(link.id);
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`group relative block w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 border ${
        link.isFeatured
          ? `${theme.cardHighlight} border-2 border-indigo-500/40 dark:border-indigo-400/50 shadow-md hover:shadow-xl`
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-lg'
      } hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700`}
    >
      {/* Featured ribbon / badge */}
      {link.isFeatured && (
        <div className="absolute -top-2.5 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>Unggulan</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon container */}
        <div
          className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
            link.isFeatured
              ? `bg-gradient-to-br ${theme.gradient} text-white shadow-xs`
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
          }`}
        >
          {renderIcon(link.icon, 'w-6 h-6')}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {link.title}
            </h3>
            <ExternalLink className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          {link.description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {link.description}
            </p>
          )}

          {/* Metadata badges: Category & Clicks */}
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {link.category && (
              <span className="px-2 py-0.5 rounded-md font-medium bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                {link.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1 font-mono">
              <MousePointerClick className="w-3.5 h-3.5 text-slate-400" />
              {link.clicks || 0} klik
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};
