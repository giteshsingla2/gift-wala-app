import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

import { colors, fonts, gradientPoints } from '@/constants/theme';
import { t } from '@/i18n';
import { decorative } from './art';
import { Button3D } from './button-3d';

const points = gradientPoints(135);

export function WhatsAppCard({ onJoin }: { onJoin: () => void }) {
  return (
    <LinearGradient colors={[colors.whatsappCardFrom, colors.whatsappCardTo]} {...points} style={styles.card}>
      <Svg width={64} height={64} viewBox="0 0 64 64" {...decorative}>
        <Path d="M8 12h40a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H24l-10 8v-8H8a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6z" fill="#FFFFFF" />
        <Path d="M14 28l5 5 9-9" stroke="#14A862" strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M26 28l5 5 9-9" stroke="#14A862" strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx={54} cy={12} r={9} fill="#FFC233" />
        <SvgText x={54} y={16.5} textAnchor="middle" fontFamily={fonts.display} fontSize={12} fill={colors.goldInk}>
          1
        </SvgText>
      </Svg>
      <View style={styles.body}>
        <View>
          <Text style={styles.title}>{t.home.whatsappTitle}</Text>
          <Text style={styles.text}>{t.home.whatsappBody}</Text>
        </View>
        <Button3D variant="white" label={t.home.joinChannel} onPress={onJoin} faceStyle={styles.buttonFace} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 22, overflow: 'hidden' },
  body: { flex: 1, gap: 8, alignItems: 'flex-start' },
  title: { fontFamily: fonts.display, fontSize: 19, lineHeight: 23, color: colors.onDark },
  text: { fontFamily: fonts.body, fontSize: 14, lineHeight: 18, color: '#D8F7E7' },
  buttonFace: { paddingHorizontal: 18 },
});
