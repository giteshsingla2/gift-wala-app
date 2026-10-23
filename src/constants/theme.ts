// Design tokens from the design handoff (tokens.json). Keep values in sync with it.

export const colors = {
  heroTop: '#0B1A66',
  heroMid: '#1A33B5',
  heroBottom: '#2B4DE0',
  navyInk: '#0B1550',
  navyShadow: '#050B33',

  primary: '#2140D8',
  primaryLight: '#3E64FF',
  primaryEdge: '#142C9E',
  primaryTint: '#DCE4FF',
  ribbonTop: '#4A6CFF',
  ribbonBottom: '#1F3FD0',
  ribbonBorder: '#A8BBFF',

  bg: '#F3F5FC',
  bgAlt: '#EEF2FF',
  panelTop: '#D9E3FF',
  surface: '#FFFFFF',
  border: '#E3E6EF',
  divider: '#B7C4EE',
  track: '#E3E8F7',

  text: '#1A1A2E',
  text2: '#3F4659',
  textMuted: '#5B6275',
  textMuted2: '#4A5578',
  onDark: '#FFFFFF',
  onDarkMuted: '#D5DCFF',
  onDarkFaint: '#C9D3FF',
  prize: '#9A5B00',

  goldTop: '#FFD452',
  goldBottom: '#FFAA00',
  goldEdge: '#C46F00',
  goldInk: '#3A1F00',
  goldOnDark: '#FFD452',

  coinLight: '#FFF3B0',
  coinMid: '#FFC233',
  coinDark: '#D98200',
  coinEdge: '#B86A00',
  coinInk: '#A85400',
  coinRing: '#FFE58A',

  success: '#0F7B4A',
  successBg: '#E3F4EA',
  successText: '#0B5C37',

  whatsappTop: '#1BC06F',
  whatsappBottom: '#0B8A4E',
  whatsappEdge: '#06603A',
  whatsappCardFrom: '#14A862',
  whatsappCardTo: '#0B7A47',
  whatsappOnWhiteText: '#0B6B3E',
  whatsappOnWhiteEdge: '#075A33',

  live: '#E5283C',
  liveBg: '#FFE5E8',
  liveText: '#B5121F',

  glassLightBg: 'rgba(255,255,255,0.14)',
  glassLightBorder: 'rgba(255,255,255,0.28)',
  glassDarkBg: 'rgba(5,12,60,0.42)',
  glassDarkBorder: 'rgba(255,255,255,0.18)',
} as const;

export const confetti = ['#FFC233', '#FF5C8A', '#3DDC97', '#7CC4FF', '#FF8A3D', '#FFFFFF'] as const;

export const tagColors = {
  daily: { bg: '#DCE4FF', text: '#142C9E' },
  weekly: { bg: '#F1E3FF', text: '#5B21B6' },
  festival: { bg: '#FFE5D6', text: '#9A3412', cardBg: '#FFF8EF', cardBorder: '#FFB067' },
} as const;

export const heroGradient = [colors.heroTop, colors.heroMid, colors.heroBottom] as const;
export const goldGradient = [colors.goldTop, colors.goldBottom] as const;
export const blueGradient = [colors.primaryLight, colors.primary] as const;
export const ribbonGradient = [colors.ribbonTop, colors.ribbonBottom] as const;
export const panelGradient = [colors.panelTop, colors.bgAlt] as const;

// Static font instances. Android ignores fontWeight on custom fonts, so pick the family per weight.
export const fonts = {
  display: 'Baloo2-ExtraBold',
  displayBold: 'Baloo2-Bold',
  body: 'Mukta-Regular',
  bodyMedium: 'Mukta-Medium',
  bodySemiBold: 'Mukta-SemiBold',
  bodyBold: 'Mukta-Bold',
} as const;

export const fontFiles = {
  [fonts.display]: require('../../assets/fonts/Baloo2-ExtraBold.ttf'),
  [fonts.displayBold]: require('../../assets/fonts/Baloo2-Bold.ttf'),
  [fonts.body]: require('../../assets/fonts/Mukta-Regular.ttf'),
  [fonts.bodyMedium]: require('../../assets/fonts/Mukta-Medium.ttf'),
  [fonts.bodySemiBold]: require('../../assets/fonts/Mukta-SemiBold.ttf'),
  [fonts.bodyBold]: require('../../assets/fonts/Mukta-Bold.ttf'),
};

export const type = {
  heroTitle: { fontFamily: fonts.display, fontSize: 38, lineHeight: 44, color: colors.onDark },
  celebrationTitle: { fontFamily: fonts.display, fontSize: 34, lineHeight: 40, color: colors.onDark },
  pageTitle: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34 },
  sectionHeading: { fontFamily: fonts.display, fontSize: 21, lineHeight: 27, color: colors.text },
  cardTitle: { fontFamily: fonts.display, fontSize: 20, lineHeight: 24, color: colors.text },
  prizeLabel: { fontFamily: fonts.displayBold, fontSize: 16, lineHeight: 20, color: colors.prize },
  buttonLarge: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.text },
  secondary: { fontFamily: fonts.body, fontSize: 14, lineHeight: 19, color: colors.textMuted },
  caption: { fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 17, color: colors.textMuted },
  tag: { fontFamily: fonts.bodyBold, fontSize: 12, lineHeight: 17, letterSpacing: 0.7 },
} as const;

export const radius = {
  pill: 999,
  sheet: 28,
  cardLarge: 24,
  card: 22,
  cardSmall: 20,
  tile: 18,
  buttonLarge: 16,
  iconTile: 14,
  button: 12,
  tag: 6,
} as const;

export const spacing = {
  gutter: 16,
  gutterDetail: 20,
  touchMin: 44,
} as const;

export const shadows = {
  card: '0px 6px 16px rgba(20,40,120,0.08)',
  giveawayCard: '0px 8px 20px rgba(20,40,120,0.10)',
  raised: '0px 14px 30px rgba(11,26,102,0.18)',
  nav: '0px -6px 18px rgba(20,40,120,0.06)',
} as const;

export const headingShadow = {
  textShadowColor: colors.navyInk,
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 0,
} as const;

// True for light backgrounds that need dark text and icons on top.
export function isLightColor(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

// CSS-style gradient angle (0deg = to top, 90deg = to right) to expo-linear-gradient points.
export function gradientPoints(deg: number) {
  const rad = (deg * Math.PI) / 180;
  const x = Math.sin(rad) / 2;
  const y = -Math.cos(rad) / 2;
  return { start: { x: 0.5 - x, y: 0.5 - y }, end: { x: 0.5 + x, y: 0.5 + y } };
}
