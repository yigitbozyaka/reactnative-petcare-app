import { View, Platform, ScrollView } from "react-native";
import React from "react";
import HealthHero from "../components/HealthHero";
import BottomNav from "../components/BottomNav";

export default function HealthScreen({ navigation }) {
  return (
    <View
      className={`w-full h-full bg-white flex-col ${
        Platform.OS == "android" ? "pt-10" : ""
      }`}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <HealthHero />
      </ScrollView>
      <View className="sticky bottom-0 w-full">
        <BottomNav navigation={navigation} />
      </View>
    </View>
  );
}
