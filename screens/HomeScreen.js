import { View, ScrollView, SafeAreaView, Platform } from "react-native";
import React from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import Hero from "../components/Hero";
import TaskPreview from "../components/TaskPreview";

export default function HomeScreen({ navigation }) {

  return (
    <View
      className={`w-full h-full bg-white ${
        Platform.OS == "android" ? "pt-10" : ""
      }`}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <Hero navigation={navigation} />
        <TaskPreview navigation={navigation} />
      </ScrollView>
      <View className="sticky bottom-0 w-full">
        <BottomNav navigation={navigation} />
      </View>
    </View>
  );
}
