import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Header() {
  const [name, setName] = useState("");
  let date = new Date();
  let hour = date.getHours();
  let time = "Morning";
  if (hour >= 12 && hour < 16) {
    time = "Afternoon";
  } else if (hour >= 16 && hour < 22) {
    time = "Evening";
  } else if (hour >= 22 || hour < 6) {
    time = "Night";
  }

  useEffect(() => {
    const getName = async () => {
      const detailsString = await AsyncStorage.getItem("details");
      const details = JSON.parse(detailsString);
      setName(details.name);
    };
    getName();
  }, []);

  return (
    <SafeAreaView>
      <View className="flex-col justify-start items-start space-y-10 px-10 py-4">
        <View className="flex-col justify-start items-start w-full mt-10">
          <Text
            style={{ fontFamily: "Ubuntu" }}
            className="text-3xl tracking-widest"
          >
            Good {time}
          </Text>
          <Text
            style={{ fontFamily: "Ubuntu" }}
            className="text-3xl font-bold tracking-widest text-orange-500"
          >
            {name || "User"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
