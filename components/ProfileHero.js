import { View, Text, Pressable } from "react-native";
import React from "react";
import { Icon } from "react-native-elements";

export default function ProfileHero() {
  return (
    <View className="p-10">
      <View className="flex-col items-start space-y-4">
        <View className="flex-col items-start gap-4">
          <Text className="text-2xl font-semibold underline decoration-[#83D9AE]">
            Feeding Schedule
          </Text>
          <Pressable className="flex-row items-center space-x-4 bg-gray-200 py-2 px-4 rounded-lg">
            <Icon
              name="food"
              type="material-community"
              color="black"
              size={20}
            />
            <Text style={{ fontFamily: "Anta" }} className="text-xl">
              Not set yet...
            </Text>
          </Pressable>
          <Pressable className="flex-row items-center space-x-4 bg-gray-200 py-2 px-4 rounded-lg">
            <Icon
              name="water"
              type="material-community"
              color="black"
              size={20}
            />
            <Text style={{ fontFamily: "Anta" }} className="text-xl">
              Not set yet...
            </Text>
          </Pressable>
        </View>

        <View className="flex-col items-start gap-4">
          <Text className="text-2xl font-semibold underline decoration-[#83D9AE]">
            Feeding Schedule
          </Text>
          <Pressable className="flex-row items-center space-x-4 bg-gray-200 py-2 px-4 rounded-lg">
            <Icon
              name="food"
              type="material-community"
              color="black"
              size={20}
            />
            <Text style={{ fontFamily: "Anta" }} className="text-xl">
              Not set yet...
            </Text>
          </Pressable>
          <Pressable className="flex-row items-center space-x-4 bg-gray-200 py-2 px-4 rounded-lg">
            <Icon
              name="water"
              type="material-community"
              color="black"
              size={20}
            />
            <Text style={{ fontFamily: "Anta" }} className="text-xl">
              Not set yet...
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
