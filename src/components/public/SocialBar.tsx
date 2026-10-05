import React from 'react';
import { SocialLinkItem } from '../../types';
import { SOCIAL_PLATFORMS } from '../../utils/iconMap';

interface SocialBarProps {
  socialLinks: SocialLinkItem[];
  themeColor: string;
}

export const SocialBar: React.FC<SocialBarProps> = ({ socialLinks }) => {
  const activeLinks = socialLinks.filter((item) => item.active && item.url?.trim());

  if (activeLinks.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 my-4">
      {activeLinks.map((item) => {
        const platformDef = SOCIAL_PLATFORMS.find((p) => p.id === item.platform);
        const IconComponent = platformDef?.icon;

        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={item.label || platformDef?.name}
            className="group relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {IconComponent && <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110" />}
            <span className="sr-only">{item.label}</span>
          </a>
        );
      })}
    </div>
  );
};
