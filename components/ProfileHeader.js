import { View, Text, TouchableOpacity, PermissionsAndroid, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { Icon } from "react-native-elements";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileModal from "./ProfileModal";
import { launchImageLibrary } from 'react-native-image-picker';

export default function ProfileHeader() {
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const formattedAge = new Date().getFullYear() - new Date(age).getFullYear();

  useEffect(() => {
    const getDetails = async () => {
      const detailsString = await AsyncStorage.getItem("details");
      const details = JSON.parse(detailsString);
      setPetName(details.petName);
      setBreed(details.breed);
      setAge(details.birthDate);
      setWeight(details.weight);
      setImageUri(details.imageUri || null);
    };
    getDetails();
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
             granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const selectImage = async () => {
    await requestPermissions();
    try {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
      };
  
      launchImageLibrary(options, async (response) => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          console.error('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const newImageUri = response.assets[0].uri;
          setImageUri(newImageUri);
  
          try {
            const detailsString = await AsyncStorage.getItem("details");
            const details = JSON.parse(detailsString) || {};
            details.imageUri = newImageUri;
            await AsyncStorage.setItem("details", JSON.stringify(details));
          } catch (storageError) {
            console.error('AsyncStorage Error: ', storageError);
          }
        }
      });
    } catch (error) {
      console.error('Image Selection Error: ', error);
    }
  };
  

  return (
    <View className="p-10 flex-col items-center space-y-8">
      <TouchableOpacity onPress={selectImage} className={`border-4 p-1 ${!imageUri ? "border-[#83D9AE]" : "border-orange-400"} rounded-full`}>
        {!imageUri ? (<LottieView
          source={require("../assets/dog.json")}
          autoPlay
          loop
          style={{ width: 160, height: 160 }}
        />) : (
          <Image
          source={{ uri: imageUri }}
          style={{ width: 160, height: 160, borderRadius: 999 }}
        />
        )}
      </TouchableOpacity>
      <Text style={{ fontFamily: "Anta" }} className="text-3xl tracking-widest">
        {petName}
      </Text>
      <View className="flex-row space-x-4">
        <View className="flex-col space-y-2 items-center bg-gray-200 p-4 rounded-xl">
          <Text
            style={{ fontFamily: "Anta" }}
            className="text-lg tracking-widest"
          >
            {breed}
          </Text>
          <View className="flex-row space-x-2 items-center">
            <Icon
              name="paw"
              type="material-community"
              color="black"
              size={20}
            />
            <Text
              style={{ fontFamily: "Anta" }}
              className="text-md tracking-widest"
            >
              Breed
            </Text>
          </View>
        </View>

        <View className="flex-col space-y-2 items-center bg-gray-200 p-4 rounded-xl">
          <Text
            style={{ fontFamily: "Anta" }}
            className="text-lg tracking-widest"
          >
            {formattedAge}
          </Text>
          <View className="flex-row space-x-2 items-center">
            <Icon
              name="paw"
              type="material-community"
              color="black"
              size={20}
            />
            <Text
              style={{ fontFamily: "Anta" }}
              className="text-md tracking-widest"
            >
              Age
            </Text>
          </View>
        </View>

        <View className="flex-col space-y-2 items-center bg-gray-200 p-4 rounded-xl">
          <Text
            style={{ fontFamily: "Anta" }}
            className="text-lg tracking-widest"
          >
            {weight}
          </Text>
          <View className="flex-row space-x-2 items-center">
            <Icon
              name="paw"
              type="material-community"
              color="black"
              size={20}
            />
            <Text
              style={{ fontFamily: "Anta" }}
              className="text-md tracking-widest"
            >
              Weight
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={toggleModal}
        className="flex-row items-center justify-center space-x-3 bg-gray-300 w-full py-3 rounded-sm"
      >
        <Icon
          name="circle-edit-outline"
          type="material-community"
          color="black"
          size={20}
        />
        <Text className="text-center text-lg">Edit Profile</Text>
      </TouchableOpacity>

      <ProfileModal isModalVisible={isModalVisible} toggleModal={toggleModal} />
    </View>
  );
}
