import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type ProfileComponentProps = {
  outlineColor: string;
  displayName: string;
  imageUrl?: string;
  onPress: () => void;
};

const Profile: React.FC<ProfileComponentProps> = ({
  outlineColor,
  displayName,
  imageUrl,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.imageContainer, {borderColor: outlineColor}]}>
          <Image
            source={
              imageUrl ? {uri: imageUrl} : require('../assets/binary.png')
            }
            style={styles.profileImage}
          />
        </View>
      </TouchableOpacity>

      <Text style={styles.nameText}>{displayName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    borderWidth: 4,
    borderRadius: 80,
    padding: 2,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  nameText: {
    marginTop: 8,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Profile;
