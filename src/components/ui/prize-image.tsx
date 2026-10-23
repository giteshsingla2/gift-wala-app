import { Image } from 'expo-image';
import { View } from 'react-native';

import { GiftGlyph } from './art';

// The prize photo uploaded in the admin panel (600×600 transparent WebP), or a gift box if missing.
export function PrizeImage({ uri, width, height = width }: { uri: string | null; width: number; height?: number }) {
  if (uri) {
    return <Image source={{ uri }} style={{ width, height }} contentFit="contain" transition={150} cachePolicy="memory-disk" accessible={false} />;
  }
  const size = Math.min(width, height) * 0.6;
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <GiftGlyph size={size} />
    </View>
  );
}
