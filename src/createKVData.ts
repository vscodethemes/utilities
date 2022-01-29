type KVData = Array<{ key: string; value: string }>;

interface Extension {
  name: string;
  displayName: string;
  shortDescription?: string | null;
  publisherId: string;
  publisherName: string;
  publisherDisplayName: string;
  installs: number;
  trendingDaily: number;
  trendingWeekly: number;
  trendingMonthly: number;
  weightedRating: number;
}

interface Theme {
  path: string;
  displayName: string;
  slug: string;
  activityBarBackground: string;
  activityBarBorder?: string | null;
  activityBarForeground: string;
  editorBackground: string;
  editorForeground: string;
  editorGroupHeaderTabsBackground: string;
  editorGroupHeaderTabsBorder?: string | null;
  statusBarBackground: string;
  statusBarForeground: string;
  statusBarBorder?: string | null;
  tabActiveBackground: string;
  tabActiveBorder?: string | null;
  tabActiveForeground: string;
  tabBorder: string;
  titleBarActiveBackground: string;
  titleBarActiveForeground: string;
  titleBarBorder?: string | null;
}

const createKVData = (
  extension: Extension,
  themes: Array<{ theme: Theme; languageTokens: any }>,
): KVData => {
  const themesByLanguage: Record<
    string,
    Record<string, { theme: Theme; tokens: any }>
  > = {};

  for (const { theme, languageTokens } of themes) {
    for (const { language, tokens } of languageTokens) {
      if (!themesByLanguage[language]) {
        themesByLanguage[language] = {};
      }

      themesByLanguage[language][theme.slug] = { theme, tokens };
    }
  }

  const kvData: KVData = [];
  for (const [language, themesBySlug] of Object.entries(themesByLanguage)) {
    const key = `${extension.publisherName}.${extension.name}/${language}`;
    const value = JSON.stringify({ extension, themes: themesBySlug });
    kvData.push({ key, value });
  }

  return kvData;
};

export default createKVData;
