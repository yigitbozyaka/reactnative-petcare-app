import { View, Platform, ScrollView } from "react-native";
import React from "react";
import ProfileHeader from "../components/ProfileHeader";
import Facts from "../components/Facts";
import BottomNav from "../components/BottomNav";

export default function ProfileScreen({ navigation }) {
  return (
    <View
      className={`w-full h-full bg-white flex-col ${
        Platform.OS == "android" ? "pt-10" : ""
      }`}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader />
        <Facts />
      </ScrollView>
      <View className="sticky bottom-0 w-full">
        <BottomNav navigation={navigation} />
      </View>
    </View>
  );
}
