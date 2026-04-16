import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { TabType } from '../types';
import {
  AppLanguage,
  ThemeMode,
  languageMeta,
  themeLabels
} from '../data/appPreferences';
import {
  AppShellNavItem,
  AppShellNavItemId,
  appShellContent,
  appShellRoutes
} from '../data/appShellContent';
import trFlag from '../flags/tr.svg';
import gbFlag from '../flags/gb.svg';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
  themeMode: ThemeMode;
  onThemeModeChange: (theme: ThemeMode) => void;
}

const languageOptions: Array<{ id: AppLanguage; flag: string }> = [
  { id: 'tr', flag: trFlag },
  { id: 'en', flag: gbFlag }
];

const hasDropdownGroups = (
  item: AppShellNavItem
): item is AppShellNavItem & { groups: NonNullable<AppShellNavItem['groups']> } =>
  Array.isArray(item.groups) && item.groups.length > 0;

const getActiveShellItemId = (pathname: string): AppShellNavItemId => {
  if (pathname === appShellRoutes.home || pathname === '/overview') {
    return 'home';
  }

  if (pathname.startsWith(appShellRoutes.search)) {
    return 'search';
  }

  if (pathname.startsWith(appShellRoutes.account)) {
    return 'account';
  }

  if (pathname.startsWith('/kanji')) {
    return 'study';
  }

  if (pathname.startsWith('/kana/')) {
    const segments = pathname.split('/').filter(Boolean);
    const routeKind = segments[2];

      if (routeKind === 'play') {
        return 'play';
      }

    if (routeKind === 'weak' || routeKind === 'confusable' || routeKind === 'stats') {
      return 'test';
    }

    if (routeKind === 'overview' || routeKind === 'learn' || routeKind === 'review' || routeKind === 'words') {
      return routeKind === 'overview' || routeKind === 'learn' || routeKind === 'review' ? 'study' : 'play';
    }

    return 'study';
  }

  return 'home';
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab: _activeTab,
  onTabChange: _onTabChange,
  language,
  onLanguageChange,
  themeMode,
  onThemeModeChange
}) => {
  const location = useLocation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [openDesktopItemId, setOpenDesktopItemId] = useState<AppShellNavItemId | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileItemId, setOpenMobileItemId] = useState<AppShellNavItemId | null>(null);
  const desktopLanguageMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileLanguageMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopNavRef = useRef<HTMLDivElement | null>(null);

  const themeText = themeLabels[language];
  const isDark = themeMode === 'dark';
  const logoSrc = isDark ? '/logo/kototsuna-logo.png' : '/logo/kototsuna-logo-light.png';

  const selectedLanguage = useMemo(
    () => languageOptions.find((option) => option.id === language) ?? languageOptions[0],
    [language]
  );
  const shellContent = appShellContent[language];
  const desktopNavItems = shellContent.navbar.items;
  const activeShellItemId = useMemo(
    () => getActiveShellItemId(location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileItemId(null);
    setOpenDesktopItemId(null);
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideDesktopMenu = desktopLanguageMenuRef.current?.contains(target);
      const isInsideMobileMenu = mobileLanguageMenuRef.current?.contains(target);
      const isInsideDesktopNav = desktopNavRef.current?.contains(target);

      if (!isInsideDesktopMenu && !isInsideMobileMenu) {
        setIsLanguageMenuOpen(false);
      }

      if (!isInsideDesktopNav) {
        setOpenDesktopItemId(null);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const panelClass = isDark
    ? 'border border-slate-700 bg-slate-900/90'
    : 'border border-sky-100 bg-white/95';

  const desktopBarClass = isDark
    ? 'border border-slate-700 bg-slate-900/90 shadow-[0_12px_28px_rgba(15,10,16,0.45)]'
    : 'border border-sky-100 bg-white/95 shadow-[0_12px_28px_rgba(208,96,112,0.2)]';

  const navShellClass = isDark
    ? 'border-b border-slate-800/80 bg-slate-950/75'
    : 'border-b border-slate-200/80 bg-[#fff0f0]';

  const tabBaseClass = 'h-14 min-w-[92px] px-4 text-sm font-semibold tracking-[0.02em] transition-colors';

  const activeTabClass = isDark
    ? 'bg-sky-300 text-slate-950'
    : 'bg-sky-300 text-white';

  const inactiveTabClass = isDark
    ? 'text-sky-200 hover:bg-slate-800 hover:text-sky-100'
    : 'text-sky-400 hover:bg-sky-50 hover:text-sky-500';

  const desktopDropdownClass = isDark
    ? 'border border-slate-700 bg-slate-900/95 shadow-[0_22px_40px_rgba(2,6,23,0.6)]'
    : 'border border-sky-100 bg-white/95 shadow-[0_22px_40px_rgba(208,96,112,0.18)]';

  const desktopGroupTitleClass = isDark
    ? 'text-slate-200'
    : 'text-slate-900';

  const desktopLinkClass = isDark
    ? 'border border-transparent text-slate-200 hover:border-slate-700 hover:bg-slate-800'
    : 'border border-transparent text-slate-700 hover:border-sky-100 hover:bg-sky-50';

  const desktopLinkDescriptionClass = isDark
    ? 'text-slate-400'
    : 'text-slate-500';

  const utilityButtonClass = isDark
    ? 'text-sky-100 hover:bg-slate-800'
    : 'text-sky-400 hover:bg-sky-50';

  const utilityBorderClass = isDark ? 'border-slate-700' : 'border-sky-100';

  const dropdownItemBase = isDark
    ? 'text-slate-200 hover:bg-slate-800'
    : 'text-slate-700 hover:bg-sky-50';

  const mobileMenuClass = isDark
    ? 'border border-slate-700 bg-slate-900/95'
    : 'border border-sky-100 bg-white/98';

  const mobileItemBaseClass = isDark
    ? 'border-slate-700 text-slate-100'
    : 'border-sky-100 text-slate-900';

  const mobileSubLinkClass = isDark
    ? 'border border-slate-700 bg-slate-950/70 text-slate-100 hover:bg-slate-800'
    : 'border border-sky-100 bg-sky-50/70 text-slate-700 hover:bg-sky-100/70';

  const toggleTheme = () => {
    onThemeModeChange(isDark ? 'light' : 'dark');
  };

  return (
    <nav className={`sticky top-0 z-20 backdrop-blur ${navShellClass}`}>
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className={`hidden items-stretch overflow-visible ${desktopBarClass} sm:flex`}>
          <div className={`flex w-52 flex-shrink-0 items-center justify-center border-r px-3 ${utilityBorderClass}`}>
            <Link to={appShellRoutes.home} className="flex h-14 w-full items-center justify-center overflow-hidden">
              <img
                src={logoSrc}
                alt="Kototsuna logo"
                className="h-14 w-auto max-w-none scale-[2.5] object-contain"
              />
            </Link>
          </div>

          <div
            ref={desktopNavRef}
            className="flex min-w-0 flex-1 items-stretch justify-center"
            onMouseLeave={() => setOpenDesktopItemId(null)}
          >
            {desktopNavItems.map((item) => {
              const isOpen = openDesktopItemId === item.id;
              const isActive = activeShellItemId === item.id;
              const itemClassName = `${tabBaseClass} ${isActive || isOpen ? activeTabClass : inactiveTabClass}`;

              if (!hasDropdownGroups(item)) {
                return (
                  <Link
                    key={item.id}
                    to={item.href ?? appShellRoutes.home}
                    className={`${itemClassName} flex items-center justify-center`}
                    onClick={() => setOpenDesktopItemId(null)}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div
                  key={item.id}
                  className="relative flex items-stretch"
                  onMouseEnter={() => setOpenDesktopItemId(item.id)}
                >
                  <button
                    type="button"
                    className={`${itemClassName} flex items-center justify-center gap-1`}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={() => setOpenDesktopItemId((current) => current === item.id ? null : item.id)}
                    onFocus={() => setOpenDesktopItemId(item.id)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div
                      className="absolute left-1/2 top-full z-30 w-[44rem] max-w-[calc(100vw-9rem)] -translate-x-1/2 pt-3"
                      role="menu"
                    >
                      <div className={`rounded-2xl p-5 ${desktopDropdownClass}`}>
                        <div className={`grid gap-4 ${item.groups.length === 1 ? 'grid-cols-1' : item.groups.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                          {item.groups.map((group) => (
                            <div key={group.id} className="space-y-3">
                              <div className={`px-1 text-sm font-semibold ${desktopGroupTitleClass}`}>
                                {group.title}
                              </div>
                              <div className="space-y-2">
                                {group.links.map((link) => (
                                  <Link
                                    key={link.id}
                                    to={link.href}
                                    className={`block rounded-xl p-3 transition-colors ${desktopLinkClass}`}
                                    onClick={() => setOpenDesktopItemId(null)}
                                    role="menuitem"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold">{link.label}</span>
                                      {link.badge && (
                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                                          isDark ? 'bg-slate-700 text-slate-100' : 'bg-sky-100 text-sky-600'
                                        }`}>
                                          {link.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className={`mt-1 text-xs leading-5 ${desktopLinkDescriptionClass}`}>
                                      {link.description}
                                    </p>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`flex items-center gap-1 border-l px-2 ${utilityBorderClass}`}>
            <div ref={desktopLanguageMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
                className={`flex h-10 items-center gap-1 rounded-md px-2 text-xs font-semibold uppercase tracking-wide transition-colors ${utilityButtonClass}`}
                aria-haspopup="menu"
                aria-expanded={isLanguageMenuOpen}
              >
                <img src={selectedLanguage.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                <span>{languageMeta[language].shortLabel}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isLanguageMenuOpen && (
                <div
                  className={`absolute right-0 top-[calc(100%+8px)] z-30 min-w-40 overflow-hidden rounded-lg shadow-lg ${
                    isDark ? 'border border-slate-700 bg-slate-900' : 'border border-sky-100 bg-white'
                  }`}
                  role="menu"
                >
                  {languageOptions.map((option) => {
                    const isActive = option.id === language;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          onLanguageChange(option.id);
                          setIsLanguageMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm font-medium transition-colors ${
                          isActive
                            ? isDark
                              ? 'bg-slate-800 text-white'
                              : 'bg-sky-50 text-sky-600'
                            : dropdownItemBase
                        }`}
                        role="menuitem"
                      >
                        <img src={option.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                        <span>{languageMeta[option.id].label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors ${utilityButtonClass}`}
              aria-label={isDark ? themeText.dark : themeText.light}
              title={isDark ? themeText.dark : themeText.light}
            >
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-3 sm:hidden">
          <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${panelClass}`}>
            <Link to={appShellRoutes.home} className="flex h-12 w-[180px] items-center overflow-hidden">
              <img
                src={logoSrc}
                alt="Kototsuna logo"
                className="h-12 w-auto max-w-none scale-[2.5] object-contain"
              />
            </Link>

            <div className="flex items-center gap-2">
              <div ref={mobileLanguageMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
                  className={`flex h-9 items-center gap-1 rounded-md px-2 text-xs font-semibold uppercase tracking-wide transition-colors ${utilityButtonClass}`}
                  aria-haspopup="menu"
                  aria-expanded={isLanguageMenuOpen}
                >
                  <img src={selectedLanguage.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                  <span>{languageMeta[language].shortLabel}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isLanguageMenuOpen && (
                  <div
                    className={`absolute right-0 top-[calc(100%+8px)] z-30 min-w-40 overflow-hidden rounded-lg shadow-lg ${
                      isDark ? 'border border-slate-700 bg-slate-900' : 'border border-sky-100 bg-white'
                    }`}
                    role="menu"
                  >
                    {languageOptions.map((option) => {
                      const isActive = option.id === language;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            onLanguageChange(option.id);
                            setIsLanguageMenuOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm font-medium transition-colors ${
                            isActive
                              ? isDark
                                ? 'bg-slate-800 text-white'
                                : 'bg-sky-50 text-sky-600'
                              : dropdownItemBase
                          }`}
                          role="menuitem"
                        >
                          <img src={option.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                          <span>{languageMeta[option.id].label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${utilityButtonClass}`}
                aria-label={isDark ? themeText.dark : themeText.light}
                title={isDark ? themeText.dark : themeText.light}
              >
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${utilityButtonClass}`}
                aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className={`space-y-3 rounded-2xl p-3 ${mobileMenuClass}`}>
              {desktopNavItems.map((item) => {
                const isActive = activeShellItemId === item.id;
                const isOpen = openMobileItemId === item.id;

                if (!hasDropdownGroups(item)) {
                  return (
                    <Link
                      key={item.id}
                      to={item.href ?? appShellRoutes.home}
                      className={`block rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        isActive
                          ? `${activeTabClass} border-transparent`
                          : `${mobileItemBaseClass} ${isDark ? 'bg-slate-950/60' : 'bg-white'}`
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div key={item.id} className={`rounded-xl border ${mobileItemBaseClass} ${isDark ? 'bg-slate-950/60' : 'bg-white'}`}>
                    <button
                      type="button"
                      onClick={() => setOpenMobileItemId((current) => current === item.id ? null : item.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                        isActive ? activeTabClass : isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="space-y-4 border-t border-inherit px-4 py-4">
                        {item.groups.map((group) => (
                          <div key={group.id} className="space-y-2">
                            <div className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              {group.title}
                            </div>
                            <div className="space-y-2">
                              {group.links.map((link) => (
                                <Link
                                  key={link.id}
                                  to={link.href}
                                  className={`block rounded-xl px-3 py-3 text-sm transition-colors ${mobileSubLinkClass}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{link.label}</span>
                                    {link.badge && (
                                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                                        isDark ? 'bg-slate-700 text-slate-100' : 'bg-sky-100 text-sky-600'
                                      }`}>
                                        {link.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className={`mt-1 text-xs leading-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {link.description}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
