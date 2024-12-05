import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image, Button } from 'react-native';
import { Video } from 'expo-av';
import { Audio } from 'expo-av';

const MediaPreviewScreen = ({ route }) => {
  const { uri, mimeType } = route.params;
  const audioRef = useRef(new Audio.Sound());

  useEffect(() => {
    const loadAudio = async () => {
      if (mimeType.startsWith('audio/')) {
        try {
          await audioRef.current.loadAsync({ uri });
          await audioRef.current.playAsync();
        } catch (error) {
          console.error('Error loading or playing audio:', error);
        }
      }
      return () => {
        audioRef.current.unloadAsync();
      };
    };
    loadAudio();
  }, [uri, mimeType]);

  return (
    <View style={styles.container}>
      {mimeType.startsWith('image/') ? (
        <Image source={{ uri }} style={styles.image} />
      ) : mimeType.startsWith('video/') ? (
        <Video
          source={{ uri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          useNativeControls
          style={styles.media}
        />
      ) : mimeType.startsWith('audio/') ? (
        <>
          <Text>Audio Playback</Text>
          <Button
            title="Play Audio"
            onPress={async () => {
              try {
                await audioRef.current.replayAsync();
              } catch (error) {
                console.error('Error replaying audio:', error);
              }
            }}
          />
          <Button
            title="Stop Audio"
            onPress={async () => {
              try {
                await audioRef.current.stopAsync();
              } catch (error) {
                console.error('Error stopping audio:', error);
              }
            }}
          />
        </>
      ) : (
        <Text>Unsupported media type</Text>
      )}
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
  media: {
    width: '90%',
    height: 300,
  },
});

export default MediaPreviewScreen;
