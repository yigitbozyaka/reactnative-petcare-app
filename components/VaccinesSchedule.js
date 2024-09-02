import { View, Text, TouchableOpacity, Platform, useWindowDimensions } from "react-native";
import { Icon } from "react-native-elements";
import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { TextInput } from "react-native-paper";

export default function VaccinesSchedule() {
  const [vaccines, setVaccines] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const deleteVaccine = async (vaccine) => {
    const newVaccines = vaccines.filter((v) => v !== vaccine);
    setVaccines(newVaccines);
    try {
      await AsyncStorage.setItem("vaccines", JSON.stringify(newVaccines));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="m-4">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={toggleModal}
          className="flex-row items-center space-x-2 bg-gray-200/80 py-2 px-4 rounded-lg mt-6"
        >
          <Text className="text-xl font-semibold">Add Vaccines</Text>
          <Icon
            className="bg-[#fb7867] rounded-lg"
            name="add"
            type="material"
            color="white"
            size={20}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-col items-start mt-12">
        <View className="flex-col items-start space-y-12">
          {vaccines.length !== 0 &&
            vaccines.map((v, index) => {
              return (
                <View
                  key={index}
                  className="flex-col items-center bg-[#f48d4d] justify-between w-72 pl-4 pr-8 py-2 rounded-lg"
                >
                  <TouchableOpacity
                    onPress={() => deleteVaccine(v)}
                    className="bg-white rounded-full p-2 absolute -top-5 -right-3"
                  >
                    <Icon
                      name="delete-outline"
                      type="material-community"
                      color="black"
                      size={24}
                    />
                  </TouchableOpacity>
                  <View className="flex-row space-x-3 my-1">
                    <Icon
                      name="needle"
                      type="material-community"
                      color="#FBF6EE"
                      size={30}
                    />
                    <Text className="text-lg text-[#FBF6EE] font-bold">
                      {v.vaccine}
                    </Text>
                  </View>
                  <View
                    className="border w-full border-gray-200/30"
                  />
                  <View className="flex-row space-x-3 my-2">
                    <Icon
                      name="calendar-range"
                      type="material-community"
                      color="#FBF6EE"
                      size={30}
                    />
                    <Text className="text-lg text-[#FBF6EE] font-semibold">
                      {v.date}
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      </View>

      <VaccineModal
        vaccines={vaccines}
        setVaccines={setVaccines}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
      />
    </View>
  );
}

const VaccineModal = ({
  vaccines,
  setVaccines,
  isModalVisible,
  toggleModal,
}) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [vaccine, setVaccine] = useState("");
  const [date, setDate] = useState(dayjs());

  const { width, height } = useWindowDimensions();

  const handleDateChange = (date) => {
    setDate(dayjs(date));
    setIsDatePickerVisible(false);
  };

  useEffect(() => {
    const getVaccines = async () => {
      try {
        const vaccines = await AsyncStorage.getItem("vaccines");
        if (vaccines) {
          setVaccines(JSON.parse(vaccines));
        }
      } catch (error) {
        console.error(error);
      }
    };

    getVaccines();
  }, []);

  const addVaccine = async () => {
    try {
      const dateString = date.format("YYYY-MM-DD");

      const newVaccine = { vaccine, date: dateString };

      const newVaccines = [...vaccines, newVaccine];

      await AsyncStorage.setItem("vaccines", JSON.stringify(newVaccines));

      setVaccines(newVaccines);
      toggleModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal className="bg-white m-0" isVisible={isModalVisible}>
      <TouchableOpacity
        className="absolute top-10 left-10"
        onPress={toggleModal}
      >
        <Icon
          name="arrow-left"
          type="material-community"
          color="black"
          size={30}
        />
      </TouchableOpacity>

      <View className="flex-col items-center justify-center p-10">
        <Text
          className={`text-2xl font-semibold my-3 ${Platform.OS === "ios" ? "underline decoration-[#fb7867]" : "border-b-2 border-[#fb7867]"}`}
        >
          Add Vaccine
        </Text>

        <Text className="text-lg font-normal text-center text-gray-600 my-3">
          Select your pet's vaccine and date of vaccination to add to the
          schedule.
        </Text>

        <TextInput
          className="w-64 m-5"
          mode="outlined"
          outlineColor="#fb7867"
          activeOutlineColor="#fb7867"
          placeholderTextColor={"#fffff"}
          label="Vaccine Name"
          left={<TextInput.Icon icon="account" color={"#fb7867"} />}
          value={vaccine}
          onChangeText={(text) => setVaccine(text)}
        />

        <TouchableOpacity
          onPress={() => setIsDatePickerVisible(!isDatePickerVisible)}
          className="flex-row justify-between items-center w-64 bg-[#fb7867] rounded-lg font-medium py-2 my-3"
        >
          <View className="flex-row items-center">
            <Icon
              className="pl-3"
              name="calendar-range"
              type="material-community"
              color="white"
              size={24}
            />
            <Text
              style={{ fontFamily: "Anta" }}
              className="text-white text-[16px] px-3"
            >
              {!date ? "Date" : date.format("YYYY-MM-DD")}
            </Text>
          </View>
          <Icon
            className="px-3"
            name="chevron-down"
            type="material-community"
            color="white"
            size={24}
          />
        </TouchableOpacity>
        {isDatePickerVisible && (
          <View
            style={{
              width: width,
              height: height
            }}
            className="absolute flex justify-center bg-white z-30"
          >
            <TouchableOpacity
              className="absolute top-10 left-10"
              onPress={() => setIsDatePickerVisible(false)}
            >
              <Icon
                name="arrow-left"
                type="material-community"
                color="black"
                size={30}
              />
            </TouchableOpacity>
            <View className="mx-10">
              <DateTimePicker
                selectedItemColor="#fb7867"
                date={date.toDate()}
                onChange={(params) => handleDateChange(params.date)}
                mode="single"
              />
            </View>
          </View>
        )}
        <TouchableOpacity onPress={addVaccine} className="flex-row items-center space-x-3 bg-[#fb7867] py-2 px-4 rounded-lg mt-4">
          <Text className="text-white text-xl">Add</Text>
          <Icon
            className="bg-white rounded-sm"
            name="add"
            type="material"
            color="#fb7867"
            size={16}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
