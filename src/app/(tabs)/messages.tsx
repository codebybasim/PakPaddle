import { StyleSheet, Text, View } from 'react-native';
import { light, brand } from '@/theme/colors';
import { fontSize, fontFamily } from '@/theme/typography';

export default function MessagesScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.sub}>Your conversations will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: light.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontFamily: fontFamily.extraBold,
    color: brand.primary,
  },
  sub: {
    fontSize: fontSize.base,
    color: light.textSecondary,
  },
});
