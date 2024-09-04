import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  cross,
  logo,
  mute,
  pause,
  play,
  unmute,
} from '../helper/exportedFunction';
import Video from 'react-native-video';
import LottieView from 'lottie-react-native';

type Stories = {
  type: string;
  image?: string;
  video?: string;
  lottie?: string;
};

type StoryComponentProps = {
  onFinishStory: () => void;
  stories: Stories[];
};

const {width} = Dimensions.get('window');

const StoryComponent: React.FC<StoryComponentProps> = ({
  onFinishStory,
  stories,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const pausedProgress = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const currentStory = stories[currentStoryIndex];
  const [isMuted, setIsMuted] = useState(false);
  const [wentBack, setWentBack] = useState(0);

  const renderStoryContent = (story: any) => {
    switch (story.type) {
      case 'image':
        return <Image source={story.image} style={styles.backgroundImage} />;

      case 'video':
        return (
          <Video
            source={story.video}
            resizeMode="cover"
            style={styles.backgroundImage}
            paused={isPaused}
            muted={isMuted}
          />
        );
      case 'lottie':
        return (
          <LottieView
            source={story.lottie}
            style={styles.backgroundImage}
            speed={isPaused ? 0 : 1}
            autoPlay
            loop
          />
        );
      default:
        return null;
    }
  };

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: 3,
        useNativeDriver: false,
      }).start(() => {
        pausedProgress.current = 0;
        setCurrentStoryIndex(prev => prev + 1);
        progressAnimation.setValue(0);
      });
    } else {
      setWentBack(0);
      onFinishStory();
      setCurrentStoryIndex(0);
    }
  };

  const runProgressAnimation = () => {
    progressAnimation.setValue(pausedProgress.current);
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: (1 - pausedProgress.current) * 6000,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        goToNextStory();
      }
    });
  };

  const getProgressBarWidth = (storyIndex: number, currentIndex: number) => {
    if (currentIndex > storyIndex) {
      return '100%';
    }

    if (currentIndex === storyIndex) {
      return progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      });
    }

    return '0%';
  };

  const goToPreviousStory = () => {
    if (isPaused) {
      setIsPaused(true);
    }

    pausedProgress.current = 0;
    progressAnimation.setValue(0);

    if (currentStoryIndex === 0) {
      setWentBack(prev => prev + 1);
      runProgressAnimation();
    } else {
      setCurrentStoryIndex(prev => prev - 1);
    }
  };

  const handlePressIn = () => {
    setIsPaused(true);
  };

  const handlePressOut = () => {
    setIsPaused(false);
  };

  const handleTouchScreen = (event: GestureResponderEvent) => {
    const touchX = event.nativeEvent.locationX;

    if (touchX < width / 2) {
      goToPreviousStory();
    } else {
      goToNextStory();
    }
  };

  const pausePlay = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const muteAndUnMute = () => {
    if (isMuted) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      runProgressAnimation();
    } else {
      progressAnimation.stopAnimation(value => {
        pausedProgress.current = value;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStoryIndex, isPaused]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable
        onPress={handleTouchScreen}
        onLongPress={handlePressIn}
        onPressOut={handlePressOut}
        style={({pressed}) => [
          {opacity: pressed ? 0.9 : 1},
          styles.pressableContainer,
        ]}>
        <View style={styles.viewContainer}>
          {currentStory.type && renderStoryContent(currentStory)}
          <SafeAreaView>
            <View style={styles.progressBarContainer}>
              {stories.map((story, index) => (
                <View style={styles.progressBarBackground} key={index}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {width: getProgressBarWidth(index, currentStoryIndex)},
                    ]}
                  />
                </View>
              ))}
            </View>

            <View style={styles.topBar}>
              <Image source={logo} style={styles.logo} />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={muteAndUnMute}>
                <Image source={isMuted ? mute : unmute} style={styles.icon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={pausePlay}>
                <Image source={isPaused ? play : pause} style={styles.icon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={onFinishStory}>
                <Image source={cross} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },

  pressableContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  viewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
    borderRadius: 18,
  },

  progressBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 10,
    justifyContent: 'center',
    height: 3,
    backgroundColor: 'transparent',
  },

  progressBarBackground: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 2,
  },

  progressBar: {
    height: 3,
    backgroundColor: '#fff',
  },

  topBar: {
    position: 'absolute',
    left: 15,
    top: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  icon: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },

  buttonContainer: {
    position: 'absolute',
    right: 10,
    top: 25,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default StoryComponent;
