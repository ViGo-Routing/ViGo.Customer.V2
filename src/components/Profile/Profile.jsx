import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { themeColors } from '../../assets/theme';
import { launchImageLibrary } from 'react-native-image-picker';

const Profile = () => {
  const [imageSource, setImageSource] = useState('https://avatars.githubusercontent.com/u/66261053?v=4');

  const handleImagePress = () => {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImageSource(response.uri);
      }
    }).catch((error) => {
      console.log('Error launching image library: ', error);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePress}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: imageSource }} />
        </View>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Họ và Tên</Text>
        <View style={styles.inputBorder}>
          <TextInput placeholder="Trần Gia Hoàng" style={styles.input} />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Số điện thoại</Text>
        <View style={styles.inputBorder}>
          <TextInput placeholder="+84909685971" style={styles.input} />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Email</Text>
        <View style={styles.inputBorder}>
          <TextInput placeholder="hoangtgse140280@fpt.edu.vn" style={styles.input} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: themeColors.primary,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 10,
    backgroundColor: themeColors.linear

  },
  inputTitle: {
    borderRadius: 10,
    color: themeColors.linear,
    position: 'absolute',
    top: -8,
    left: 10,
    backgroundColor: themeColors.primary,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  inputBorder: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
  },
  input: {
    height: 40,
    padding: 10,
  },
});

export default Profile;