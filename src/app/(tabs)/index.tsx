import { brand, light } from '@/theme/colors';
import { fontSize, fontWeight } from '@/theme/typography';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>PakPadel</Text>
      <Text style={styles.sub}>Courts dashboard coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: light.background,
    alignItems:      'center',
    justifyContent:  'center',
    gap:             8,
  },
  title: {
    fontSize:   fontSize['2xl'],
    fontWeight: fontWeight.heavy,
    color:      brand.primary,
  },
  sub: {
    fontSize: fontSize.base,
    color:    light.textSecondary,
  },
});
