import { View, Text, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import { Icon } from "react-native-elements";

export default function Skeleton({ direction }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(fadeIn);
    });
  };

  useEffect(() => {
    fadeIn();
  }, []);

  return (
    <Animated.View
      style={{
        marginHorizontal: direction === "row" ? 12 : 0,
        marginVertical: direction === "col" ? 12 : 0,
        opacity: fadeAnim,
      }}
      className="max-w-sm w-full flex-row space-x-2 mx-0 items-center justify-between bg-gray-300 rounded-xl py-4 px-5"
    >
      <Icon
        className="bg-white/60 p-2 rounded-lg"
        name="image"
        type="feather"
        color="gray"
        size={36}
      />
      <View className="w-full flex-col gap-2">
        <Text className="w-48 h-2.5 bg-gray-400/80 rounded-full"></Text>
        <Text className="w-32 h-2.5 bg-gray-400/80 rounded-full"></Text>
      </View>
    </Animated.View>
  );
}
