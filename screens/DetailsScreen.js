import { View, Text, Platform, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import { Icon } from "react-native-elements";
import { TextInput } from "react-native-paper";
import LottieView from "lottie-react-native";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetailsScreen({ navigation }) {
  const [name, setName] = useState("");
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [date, setDate] = useState(dayjs());
  const [weight, setWeight] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAgeInputPress = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (newDate) => {
    setShowDatePicker(false);
    setDate(dayjs(newDate));
    setBirthDate(dayjs(newDate).format("YYYY-MM-DD"));
  };

  const handleSave = async () => {
    const details = JSON.stringify({
      name,
      petName,
      breed,
      birthDate,
      weight,
    });
    await AsyncStorage.setItem("details", details);
    await AsyncStorage.setItem("firstTime", "false");
    navigation.navigate("Home");
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className={`h-full w-full bg-[#F3F8EE] ${
        Platform.OS == "android" ? "pt-10" : ""
      }`}
      automaticallyAdjustKeyboardInsets={true}
    >
      <LottieView
        style={{ width: 360, height: 360, alignSelf: "center" }}
        source={require("../assets/details.json")}
        autoPlay
        loop
      />
      <View className="m-4 flex-col">
        <Text
          style={{ fontFamily: "Ubuntu" }}
          className="text-center text-2xl font-semibold tracking-widest"
        >
          Let's get to know you and your pet
        </Text>
      </View>
      <View className="mb-10 flex-col space-y-0">
        <TextInput
          style={{ margin: 40 }}
          mode="outlined"
          outlineColor="#818df8"
          label="Owner Name"
          placeholder="Enter your name"
          left={<TextInput.Icon icon="account" color={"#818df8"} />}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={{ margin: 40 }}
          mode="outlined"
          outlineColor="#818df8"
          label="Pet Name"
          placeholder="Enter your pet's name"
          left={<TextInput.Icon icon="cat" color={"#818df8"} />}
          value={petName}
          onChangeText={(text) => setPetName(text)}
        />
        <TextInput
          style={{ margin: 40 }}
          mode="outlined"
          outlineColor="#818df8"
          label="Pet Breed"
          placeholder="Enter your pet's breed"
          left={<TextInput.Icon icon="cat" color={"#818df8"} />}
          value={breed}
          onChangeText={(text) => setBreed(text)}
        />
        <Pressable style={{ margin: 40 }} onPress={handleAgeInputPress}>
          <TextInput
            editable={false}
            pointerEvents="none"
            mode="outlined"
            outlineColor="#818df8"
            label="Pet Birth Date"
            left={<TextInput.Icon icon="cat" color={"#818df8"} />}
            value={birthDate}
          />
        </Pressable>
        {showDatePicker && (
          <View className="absolute z-50 m-5 rounded-lg bg-slate-200 p-5">
            <DateTimePicker
              mode="single"
              date={date.toDate()}
              onChange={(params) => handleDateChange(params.date)}
            />
          </View>
        )}
        <TextInput
          style={{ margin: 40 }}
          mode="outlined"
          outlineColor="#818df8"
          label="Pet Weight"
          placeholder="Enter your pet's weight"
          keyboardType="numeric"
          left={<TextInput.Icon icon="cat" color={"#818df8"} />}
          value={weight}
          onChangeText={(text) => setWeight(text)}
        />

        <Pressable
          onPress={handleSave}
          className="mx-10 mb-10 flex-row items-center justify-center space-x-2 rounded-lg border-2 border-indigo-500 bg-indigo-400/20 p-2 hover:bg-indigo-500/50 active:bg-indigo-500/50"
        >
          <Icon name="save" type="font-awesome" color="indigo" size={22} />
          <Text
            className="text-center text-xl tracking-widest text-gray-700"
            style={{ fontFamily: "Ubuntu" }}
          >
            Save
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
