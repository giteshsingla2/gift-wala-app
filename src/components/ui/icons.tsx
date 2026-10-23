import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { decorative } from './art';

// Line icons from the design files (24x24, round caps). Decorative: callers label the button.

type IconProps = { size?: number; color?: string; strokeWidth?: number; fill?: string };

function Icon({ size = 24, color = '#1A1A2E', strokeWidth = 2, fill = 'none', children }: IconProps & { children: React.ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...decorative}>
      {children}
    </Svg>
  );
}

export const HomeIcon = ({ active, ...p }: IconProps & { active?: boolean }) => (
  <Icon {...p} fill={active ? '#DCE4FF' : 'none'}>
    <Path d="M3 10.5 12 3l9 7.5V21H3z" />
    <Path d="M10 21v-6h4v6" fill={active ? '#FFFFFF' : 'none'} />
  </Icon>
);

export const GiftIcon = ({ active, ...p }: IconProps & { active?: boolean }) => (
  <Icon {...p}>
    <Rect x="3" y="8" width="18" height="4" rx="1" fill={active ? '#DCE4FF' : 'none'} />
    <Path d="M5 12v9h14v-9" fill={active ? '#DCE4FF' : 'none'} />
    <Path d="M12 8v13" />
    <Path d="M12 8C10 4 7 4 7 6s3 2 5 2c2 0 5 0 5-2s-3-2-5 2z" />
  </Icon>
);

export const CalendarCheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <Rect x="3" y="4" width="18" height="18" rx="2" />
    <Path d="M16 2v4M8 2v4M3 10h18" />
    <Path d="m9 16 2 2 4-4" />
  </Icon>
);

export const TrophyIcon = ({ active, ...p }: IconProps & { active?: boolean }) => (
  <Icon {...p} fill={active ? '#DCE4FF' : 'none'}>
    <Path d="M8 21h8M12 17v4" />
    <Path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
    <Path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" fill="none" />
  </Icon>
);

export const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <Circle cx="12" cy="8" r="4" />
    <Path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </Icon>
);

export const BellIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Icon>
);

export const BackIcon = (p: IconProps) => (
  <Icon strokeWidth={2.4} {...p}>
    <Path d="M19 12H5M11 18l-6-6 6-6" />
  </Icon>
);

export const ShareIcon = (p: IconProps) => (
  <Icon strokeWidth={2.2} {...p}>
    <Circle cx="18" cy="5" r="3" />
    <Circle cx="6" cy="12" r="3" />
    <Circle cx="18" cy="19" r="3" />
    <Path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
  </Icon>
);

export const ClockIcon = (p: IconProps) => (
  <Icon {...p}>
    <Circle cx="12" cy="12" r="9" />
    <Path d="M12 7v5l3 2" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon strokeWidth={2.8} {...p}>
    <Path d="m5 12 5 5 9-10" />
  </Icon>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Icon strokeWidth={2.4} {...p}>
    <Path d="m9 18 6-6-6-6" />
  </Icon>
);

export const ChatIcon = (p: IconProps) => (
  <Icon strokeWidth={2.2} {...p}>
    <Path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.3A8.5 8.5 0 1 1 21 12z" />
  </Icon>
);

export const SmallTrophyIcon = (p: IconProps) => (
  <Icon strokeWidth={2.2} {...p}>
    <Path d="M8 21h8M12 17v4" />
    <Path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
  </Icon>
);

// Filled shield with a green face, used for "free skip" and "All verified".
export const ShieldIcon = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...decorative}>
    <Path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" fill="#3DDC97" stroke="#FFFFFF" strokeWidth={1.6} strokeLinejoin="round" />
  </Svg>
);

export const ShieldCheckIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...decorative}>
    <Path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" fill="#0F7B4A" />
    <Path d="m9 12 2 2 4-4" stroke="#FFFFFF" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PlayIcon = ({ size = 16, circle = '#2140D8', triangle = '#FFFFFF' }: { size?: number; circle?: string; triangle?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...decorative}>
    <Circle cx="12" cy="12" r="11" fill={circle} />
    <Path d="M10 8v8l6-4z" fill={triangle} />
  </Svg>
);
