import { View, TouchableOpacity, Pressable, Text, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { TextInput } from "react-native-paper";
import { Icon } from "react-native-elements";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "react-native-ui-datepicker";

export default function ProfileModal({ isModalVisible, toggleModal }) {
  const [name, setName] = useState("");
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [date, setDate] = useState(dayjs());
  const [weight, setWeight] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      const detailsString = await AsyncStorage.getItem("details");
      const details = JSON.parse(detailsString);
      if (details) {
        setName(details.name);
        setPetName(details.petName);
        setBreed(details.breed);
        setBirthDate(details.birthDate);
        setWeight(details.weight);
      }
    };
    getDetails();
  }, []);

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
    toggleModal();
  };

  return (
    <Modal className="m-0 bg-white" isVisible={isModalVisible}>
      <TouchableOpacity
        className={`absolute z-50 ${Platform.OS === "android" ? "top-10" : "top-20"} left-6`}
        onPress={toggleModal}
      >
        <Icon
          name="arrow-left"
          type="material-community"
          color="black"
          onPress={toggleModal}
        />
      </TouchableOpacity>
      <TextInput
        style={{ margin: 20 }}
        mode="outlined"
        outlineColor="#fb7867"
        activeOutlineColor="#fb7867"
        activeUnderlineColor="#fb7867"
        underlineColor="#fb7867"
        label="Owner Name"
        placeholder="Enter your name"
        left={<TextInput.Icon icon="account" color={"#fb7867"} />}
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={{ margin: 20 }}
        mode="outlined"
        outlineColor="#fb7867"
        activeOutlineColor="#fb7867"
        activeUnderlineColor="#fb7867"
        underlineColor="#fb7867"
        label="Pet Name"
        placeholder="Enter your pet's name"
        left={<TextInput.Icon icon="cat" color={"#fb7867"} />}
        value={petName}
        onChangeText={(text) => setPetName(text)}
      />
      <TextInput
        style={{ margin: 20 }}
        mode="outlined"
        outlineColor="#fb7867"
        activeOutlineColor="#fb7867"
        activeUnderlineColor="#fb7867"
        underlineColor="#fb7867"
        label="Pet Breed"
        placeholder="Enter your pet's breed"
        left={<TextInput.Icon icon="cat" color={"#fb7867"} />}
        value={breed}
        onChangeText={(text) => setBreed(text)}
      />
      <TouchableOpacity style={{ margin: 20 }} onPress={handleAgeInputPress}>
        <TextInput
          editable={false}
          pointerEvents="none"
          mode="outlined"
          outlineColor="#fb7867"
          activeOutlineColor="#fb7867"
          activeUnderlineColor="#fb7867"
          underlineColor="#fb7867"
          label="Pet Birth Date"
          left={<TextInput.Icon icon="cat" color={"#fb7867"} />}
          value={birthDate}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <View className="absolute w-full z-[999] rounded-lg bg-slate-200 px-5 pt-2">
          <DateTimePicker
            mode="single"
            date={date.toDate()}
            onChange={(params) => handleDateChange(params.date)}
          />
        </View>
      )}
      <TextInput
        style={{ margin: 20 }}
        mode="outlined"
        outlineColor="#fb7867"
        activeOutlineColor="#fb7867"
        activeUnderlineColor="#fb7867"
        underlineColor="#fb7867"
        label="Pet Weight"
        placeholder="Enter your pet's weight"
        keyboardType="numeric"
        left={<TextInput.Icon icon="cat" color={"#fb7867"} />}
        value={weight}
        onChangeText={(text) => setWeight(text)}
      />

      <Pressable
        onPress={handleSave}
        className="mx-5 my-5 flex-row items-center justify-center space-x-2 rounded-lg border-2 border-orange-400 bg-orange-400/20 p-2 hover:bg-orange-500/50 active:bg-orange-500/50"
      >
        <Icon name="save" type="font-awesome" color="black" size={22} />
        <Text
          className="text-center text-xl tracking-widest text-black"
          style={{ fontFamily: "Ubuntu" }}
        >
          Save
        </Text>
      </Pressable>
    </Modal>
  );
}
