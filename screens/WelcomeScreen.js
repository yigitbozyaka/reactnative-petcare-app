import { View, Text, Platform, Pressable, ScrollView } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className={`w-full h-full bg-[#F3F8EE] ${Platform.OS == "android" ? "pt-10" : ""
        }`}
    >
      <View className="flex-col p-10 space-y-2">
        <Text
          style={{ fontFamily: "Ubuntu" }}
          className="text-2xl font-semibold tracking-widest"
        >
          Welcome to
        </Text>
        <Text
          style={{ fontFamily: "Ubuntu" }}
          className="text-4xl font-semibold tracking-widest text-orange-500"
        >
          TailwagHaven
        </Text>
      </View>

      <View className="flex-col p-10">
        <LottieView
          style={{ width: 320, height: 320, alignSelf: "center" }}
          source={require("../assets/welcome.json")}
          autoPlay
          loop
        />
        <Text
          style={{ fontFamily: "Ubuntu" }}
          className="text-lg font-semibold tracking-wide mb-6"
        >
          Discover the easiest way to care for your furry friend. From health
          tracking to grooming tips, TailwagHaven has everything you need for
          happy pets.
        </Text>
        <Pressable
          className=" bg-orange-500 p-2 rounded-lg"
          onPress={() => navigation.navigate("Details")}
        >
          <Text
            className="text-lg text-center tracking-widest text-orange-100"
            style={{ fontFamily: "Ubuntu" }}
          >
            Get Started
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
