import { light } from '@/theme/colors';
import { fontSize, fontFamily } from '@/theme/typography';
import { StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>Explore</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: light.background,
    alignItems:      'center',
    justifyContent:  'center',
  },
  text: {
    fontSize:   fontSize.xl,
    fontFamily: fontFamily.bold,
    color:      light.text,
  },
});
