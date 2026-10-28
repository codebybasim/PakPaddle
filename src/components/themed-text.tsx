import { StyleSheet, Text, type TextProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { fontFamily } from '@/theme/typography';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.regular,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.bold,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamily.regular,
  },
  title: {
    fontSize: 48,
    lineHeight: 52,
    fontFamily: fontFamily.extraBold,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontFamily: fontFamily.bold,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
    fontFamily: fontFamily.regular,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
    fontFamily: fontFamily.medium,
  },
  code: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
  },
});
