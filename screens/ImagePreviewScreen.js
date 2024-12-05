import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const ImagePreviewScreen = ({ route }) => {
  const { uri } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
});

export default ImagePreviewScreen;
