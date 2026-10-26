import { light } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fontSize } from '@/theme/typography';
import { StyleSheet, Text, View } from 'react-native';

export function OrDivider() {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.text}>or</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing[3],
  },
  line: {
    flex:            1,
    height:          StyleSheet.hairlineWidth,
    backgroundColor: light.border,
  },
  text: {
    fontSize: fontSize.sm,
    color:    light.textMuted,
  },
});
