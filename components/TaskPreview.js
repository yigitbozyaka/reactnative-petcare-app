import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TaskPreview({ navigation }) {

  const [interval, setInterval] = useState(null);
  const [start, setStart] = useState(null);
  const [intervalTime, setIntervalTime] = useState(null);

  const [waterInterval, setWaterInterval] = useState(null);
  const [waterStart, setWaterStart] = useState(null);
  const [waterIntervalTime, setWaterIntervalTime] = useState(null);

  const [upcomingFeeding, setUpcomingFeeding] = useState(null);
  const [upcomingWater, setUpcomingWater] = useState(null);

  const [isFeeding, setIsFeeding] = useState(false);
  const [isWater, setIsWater] = useState(false);

  const [isFeedingLoading, setIsFeedingLoading] = useState(true);
  const [isWaterLoading, setIsWaterLoading] = useState(true);

  const [isSchedules, setIsSchedules] = useState(false);

  useEffect(() => {
    const calculateUpcomingFeeding = () => {
      if (interval !== null && start !== null) {
        const date = new Date();
        const hours = date.getHours();
        let nextFeeding = start;

        if (hours > start) {
          if (hours > start + intervalTime) {
            nextFeeding = start + intervalTime * 2;
          } else {
            nextFeeding = start + intervalTime;
          }
        }

        setUpcomingFeeding(nextFeeding);
        setIsFeedingLoading(false);
      }
    };

    calculateUpcomingFeeding();
  }, [interval, start, intervalTime]);

  useEffect(() => {
    const calculateUpcomingWater = () => {
      if (waterInterval !== null && waterStart !== null) {
        const date = new Date();
        const hours = date.getHours();
        let nextWater = waterStart;

        if (hours > waterStart) {
          if (hours > waterStart + waterIntervalTime) {
            nextWater = waterStart + waterIntervalTime * 2;
          } else {
            nextWater = waterStart + waterIntervalTime;
          }
        }

        setUpcomingWater(nextWater);
        setIsWaterLoading(false);
      }
    };

    calculateUpcomingWater();
  }, [waterInterval, waterStart, waterIntervalTime]);

  useEffect(() => {
    const getFeedingSchedule = async () => {
      try {
        const scheduleDetails = await AsyncStorage.getItem("feeding-schedule");
        const schedule = JSON.parse(scheduleDetails);

        if (schedule) {
          setInterval(schedule.interval);
          setStart(schedule.start);
          setIntervalTime(schedule.intervalTime);
          setIsFeeding(true);
          setIsSchedules(true);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getFeedingSchedule();
  }, []);

  useEffect(() => {
    const getWaterSchedule = async () => {
      try {
        const scheduleDetails = await AsyncStorage.getItem("water-schedule");
        const schedule = JSON.parse(scheduleDetails);

        if (schedule) {
          setWaterInterval(schedule.waterInterval);
          setWaterStart(schedule.waterStart);
          setWaterIntervalTime(schedule.waterIntervalTime);
          setIsWater(true);
          setIsSchedules(true);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getWaterSchedule();
  }, []);

  const isFeedingBoxVisible = upcomingFeeding !== null && upcomingFeeding > new Date().getHours() && (upcomingFeeding - new Date().getHours()) < 12;
  const isWaterBoxVisible = upcomingWater !== null && upcomingWater > new Date().getHours() && (upcomingWater - new Date().getHours()) < 12;

  return (
    <View className="flex-col px-10">
      <Text
        style={{ fontFamily: "Ubuntu" }}
        className="text-2xl tracking-widest"
      >
        Upcoming Tasks
      </Text>
      <View className="flex-col my-5 space-y-3">
        {!isSchedules && (
          <View className="flex-col items-start justify-start space-y-2 p-4 bg-gray-200/80 rounded-sm">
            <View className="flex-row gap-1">
              <Text className="text-[18px] font-medium">
                There is no schedule yet.
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Health")} className="bg-orange-100 px-4 py-2 rounded-lg">
              <Text className="font-medium text-[17px] text-orange-600">
                Create now &rarr;
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isFeeding && !isFeedingLoading && isFeedingBoxVisible ? (
          <View className="w-full flex-row justify-between items-center p-5 bg-gray-200/80 rounded-xl">
            <View className="flex-row gap-3 items-center">
              <Icon
                className="p-2 rounded-lg bg-white"
                name="food-bank"
                type="material"
                color="black"
                size={32}
              />
              <View>
                <Text className="text-xl font-semibold tracking-wide">
                  Feed the pet
                </Text>
                <Text className="text-md font-semibold tracking-widest text-gray-500">
                  {upcomingFeeding}:00
                </Text>
              </View>
            </View>
            <Icon name="dot-fill" type="octicon" color="green" size={26} />
          </View>
        ) : isFeeding && !isFeedingLoading ? (
          <View className="w-full flex-row justify-between items-center p-5 bg-gray-200/80 rounded-xl">
            <View className="flex-row gap-3 items-center">
              <Icon
                className="p-2 rounded-lg bg-white"
                name="food-bank"
                type="material"
                color="black"
                size={32}
              />
              <View>
                <Text className="text-xl font-semibold tracking-wide line-through">
                  Feed the pet
                </Text>
                <Text className="text-md font-semibold tracking-widest text-gray-500">
                  {upcomingFeeding}:00
                </Text>
              </View>
            </View>
            <Icon name="dot-fill" type="octicon" color="orange" size={26} />
          </View>
        ) : ""}

        {isWater && !isWaterLoading && isWaterBoxVisible ? (
          <View className="w-full flex-row justify-between items-center p-5 bg-gray-200/80 rounded-xl">
            <View className="flex-row gap-3 items-center">
              <Icon
                className="p-2 rounded-lg bg-white"
                name="water-alert"
                type="material-community"
                color="black"
                size={32}
              />
              <View>
                <Text className="text-xl font-semibold tracking-wide">
                  Change the water
                </Text>
                <Text className="text-md font-semibold tracking-widest text-gray-500">
                  {upcomingWater}:00
                </Text>
              </View>
            </View>
            <Icon name="dot-fill" type="octicon" color="green" size={26} />
          </View>
        ) : isWater && !isWaterLoading ? (
          <View className="w-full flex-row justify-between items-center p-5 bg-gray-200/80 rounded-xl">
            <View className="flex-row gap-3 items-center">
              <Icon
                className="p-2 rounded-lg bg-white"
                name="water-alert"
                type="material-community"
                color="black"
                size={32}
              />
              <View>
                <Text className="text-xl font-semibold tracking-wide line-through">
                  Change the water
                </Text>
                <Text className="text-md font-semibold tracking-widest text-gray-500">
                  {upcomingWater}:00
                </Text>
              </View>
            </View>
            <Icon name="dot-fill" type="octicon" color="orange" size={26} />
          </View>
        ) : ""}
      </View>
    </View>
  );
}
