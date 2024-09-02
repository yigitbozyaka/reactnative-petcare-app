import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Icon } from "react-native-elements";

export default function Hero({ navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Profile")} className="px-10 my-20">
      <View className="bg-orange-100 rounded-xl flex-col items-center p-10">
        <Image
          source={require("../assets/favicon.png")}
          className="absolute -top-20 w-48 h-48"
        />
        <View className="relative top-10 flex-row justify-between items-center px-2">
          <Text
            style={{ fontFamily: "Ubuntu" }}
            className="text-2xl text-start p-5 tracking-widest"
          >
            Check out your lovely pet 
          </Text>
          <Icon
            name="paw"
            type="font-awesome-5"
            color="black"
            size={24}
            reverse
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
