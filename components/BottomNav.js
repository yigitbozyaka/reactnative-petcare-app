import { View, TouchableOpacity } from "react-native";
import React from "react";
import { Icon } from "react-native-elements";
import { useRoute } from "@react-navigation/native";

export default function BottomNav({ navigation }) {
  const route = useRoute();
  const routeName = route.name;
  return (
    <View className="bg-gray-200 p-5 mx-8 rounded-xl">
      <View className="flex-row justify-between items-center bg-white rounded-full px-10 py-2">
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon
            reverse={routeName == "Home" ? true : false}
            name="home"
            type="feather"
            color="black"
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Health")}>
          <Icon
            reverse={routeName == "Health" ? true : false}
            name="heart-plus-outline"
            type="material-community"
            color="gray"
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Icon
            reverse={routeName == "Profile" ? true : false}
            name="logo-octocat"
            type="ionicon"
            color="gray"
            size={24}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
