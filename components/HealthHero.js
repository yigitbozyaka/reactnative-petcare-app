import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { Icon } from "react-native-elements";
import React, { useState } from "react";
import LottieView from "lottie-react-native";
import FeedingSchedule from "./FeedingSchedule";
import VaccinesSchedule from "./VaccinesSchedule";

export default function HealthHero() {
  const [category, setCategory] = useState("Vaccines");

  return (
    <View className="p-10">
      <LottieView
        style={{
          width: 180,
          height: 180,
          alignSelf: "center",
          marginBottom: 20,
        }}
        source={require("../assets/health.json")}
        autoPlay
        loop
      />
      <Text 
        className={`text-center text-3xl font-medium mx-2.5 ${Platform.OS === "ios" ? "underline decoration-[#fb7867]" : "border-b-2 border-[#fb7867]"}`}
      >
        Track your pet's health!
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-8 mx-3 space-x-4"
      >
        <TouchableOpacity onPress={() => setCategory("Vaccines")} className="flex-row items-center space-x-2 bg-gray-200 py-2 px-4 rounded-lg">
          <Icon name="vaccines" type="material" color="black" size={20} />
          <Text className="text-lg font-medium">Vaccines</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory("Feeding")} className="flex-row items-center space-x-2 bg-gray-200 py-2 px-4 rounded-lg">
          <Icon name="food-bank" type="material" color="black" size={20} />
          <Text className="text-lg font-medium">Feeding</Text>
        </TouchableOpacity>
      </ScrollView>
      <View className="flex flex-col space-y-5 my-10">
        <View className="flex-col items-start gap-4 px-4">
          <Text 
            className={`text-2xl font-semibold ${Platform.OS === "ios" ? "underline decoration-[#fb7867]" : "border-b-2 border-[#fb7867]"}`}
          >
            {category} Schedule
          </Text>
          {category === "Vaccines" ? (
            <VaccinesSchedule />
          ) : (
            <FeedingSchedule />
          )}
        </View>
      </View>
    </View>
  );
}
