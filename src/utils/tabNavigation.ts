import { appShellRoutes } from '../data/appShellContent';
import { TabType } from '../types';

const tabRouteMap: Record<TabType, string> = {
  overview: appShellRoutes.home,
  hiragana: appShellRoutes.hiraganaOverview,
  katakana: appShellRoutes.katakanaOverview,
  kanji: appShellRoutes.kanjiOverview,
  settings: appShellRoutes.settings
};

export const getPathForTab = (tab: TabType) => tabRouteMap[tab];

export const getTabFromPath = (pathname: string): TabType => {
  if (pathname === appShellRoutes.home || pathname === '/overview') {
    return 'overview';
  }

  if (pathname === appShellRoutes.settings || pathname === '/settings') {
    return 'settings';
  }

  if (pathname.startsWith('/kana/hiragana') || pathname === '/hiragana') {
    return 'hiragana';
  }

  if (pathname.startsWith('/kana/katakana') || pathname === '/katakana') {
    return 'katakana';
  }

  if (pathname.startsWith('/kanji') || pathname.startsWith('/kana/kanji')) {
    return 'kanji';
  }

  return 'overview';
};
