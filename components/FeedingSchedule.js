import { View, Text, TouchableOpacity, Platform, useWindowDimensions } from "react-native";
import { Icon } from "react-native-elements";
import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { usePushNotifications } from "../usePushNotifications";

export default function FeedingSchedule() {
  const [interval, setInterval] = useState(null);
  const [start, setStart] = useState(null);
  const [intervalTime, setIntervalTime] = useState(null);

  const [waterInterval, setWaterInterval] = useState(null);
  const [waterStart, setWaterStart] = useState(null);
  const [waterIntervalTime, setWaterIntervalTime] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const [isWaterModalVisible, setIsWaterModalVisible] = useState(false);
  const toggleWaterModal = () => setIsWaterModalVisible(!isWaterModalVisible);

  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const feedingScheduleDetails = await AsyncStorage.getItem("feeding-schedule");
        const feedingSchedule = JSON.parse(feedingScheduleDetails);
        if (feedingSchedule) {
          setInterval(feedingSchedule.interval || null);
          setStart(feedingSchedule.start || null);
          setIntervalTime(feedingSchedule.intervalTime || null);
        }
      } catch (error) {
        console.log("Error fetching feeding schedule:", error);
      }
    };

    fetchSchedules();
  }, [isModalVisible]);

  useEffect(() => {
    const fetchWaterSchedules = async () => {
      try {
        const waterScheduleDetails = await AsyncStorage.getItem("water-schedule");
        const waterSchedule = JSON.parse(waterScheduleDetails);
        if (waterSchedule) {
          setWaterInterval(waterSchedule.waterInterval || null);
          setWaterStart(waterSchedule.waterStart || null);
          setWaterIntervalTime(waterSchedule.waterIntervalTime || null);
        }
      } catch (error) {
        console.log("Error fetching water schedule:", error);
      }
    };

    fetchWaterSchedules();
  }, [isWaterModalVisible]);


  useEffect(() => {
    const feedingSchedule = JSON.stringify({
      interval,
      intervalTime,
      start,
    });
    const waterSchedule = JSON.stringify({
      waterInterval,
      waterIntervalTime,
      waterStart
    })

    const saveSchedules = async () => {
      try {
        await axios.post("https://{{your_backend_url}}/api/save/schedules", {
          timezone: -(new Date().getTimezoneOffset() / 60),
          feedingSchedule: feedingSchedule,
          waterSchedule: waterSchedule,
          token: expoPushToken.data
        })
      } catch (err) {
        console.error(err.response.data)
      }
    }

    if (expoPushToken && (waterSchedule || feedingSchedule)) {
      saveSchedules();
    }
  }, [expoPushToken, waterInterval, interval, waterIntervalTime, intervalTime, waterStart, start])

  return (
    <View className="mx-4 my-4 flex-col space-y-4 justify-center items-start">
      {(interval !== null && start !== null) || intervalTime !== null ? (
        <View className="w-full flex-col space-y-4">
          <FeedList
            interval={interval}
            start={start}
            intervalTime={intervalTime}
          />
          <TouchableOpacity
            onPress={toggleModal}
            className="flex-row items-center space-x-4 bg-gray-200 py-2 px-4 rounded-lg"
          >
            <Icon
              name="food"
              type="material-community"
              color="black"
              size={20}
            />
            <Text style={{ fontFamily: "Anta" }} className="text-xl">
              Set feeding schedule
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={toggleModal}
          className="flex-row items-center space-x-4 bg-gray-200 py-2 px-4 rounded-lg"
        >
          <Icon name="food" type="material-community" color="black" size={20} />
          <Text style={{ fontFamily: "Anta" }} className="text-xl">
            Set feeding schedule
          </Text>
        </TouchableOpacity>
      )}
      <Text
        className={`pt-6 text-2xl font-semibold ${Platform.OS === "ios" ? "underline decoration-[#fb7867]" : "border-b-2 border-[#fb7867]"}`}
      >
        Water Schedule
      </Text>
      {(waterInterval !== null && waterStart !== null) ||
        waterIntervalTime !== null ? (
        <View className="w-full flex-col space-y-4">
          <WaterList
            waterInterval={waterInterval}
            waterStart={waterStart}
            waterIntervalTime={waterIntervalTime}
          />
          <TouchableOpacity
            onPress={toggleWaterModal}
            className="flex-row items-center space-x-4 bg-gray-200 py-2 px-4 rounded-lg"
          >
            <Icon
              name="water"
              type="material-community"
              color="black"
              size={20}
            />
            <Text style={{ fontFamily: "Anta" }} className="text-xl">
              Set water schedule
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={toggleWaterModal}
          className="flex-row items-center space-x-4 bg-gray-200 py-2 px-4 rounded-lg"
        >
          <Icon
            name="water"
            type="material-community"
            color="black"
            size={20}
          />
          <Text style={{ fontFamily: "Anta" }} className="text-xl">
            Set water schedule
          </Text>
        </TouchableOpacity>
      )}


      {expoPushToken ? (
        <FeedModal
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          interval={interval}
          start={start}
          intervalTime={intervalTime}
          setInterval={setInterval}
          setStart={setStart}
          setIntervalTime={setIntervalTime}
        />
      ) : (
        <></>
      )}

      {expoPushToken ? (
        <WaterModal
          isWaterModalVisible={isWaterModalVisible}
          toggleWaterModal={toggleWaterModal}
          waterInterval={waterInterval}
          waterStart={waterStart}
          waterIntervalTime={waterIntervalTime}
          setWaterInterval={setWaterInterval}
          setWaterStart={setWaterStart}
          setWaterIntervalTime={setWaterIntervalTime}
          token={expoPushToken.data}
        />
      ) : (
        <></>
      )}
    </View>
  );
}

const FeedModal = ({
  isModalVisible,
  toggleModal,
  interval,
  start,
  intervalTime,
  setInterval,
  setStart,
  setIntervalTime,
}) => {
  const [isIntFocus, setIsIntFocus] = useState(false);
  const [isStartFocus, setIsStartFocus] = useState(false);
  const [isIntTimeFocus, setIsIntTimeFocus] = useState(false);

  const intervalData = [
    { label: "Once a day", value: 1 },
    { label: "Twice a day", value: 2 },
    { label: "Three times a day", value: 3 },
    { label: "Four times a day", value: 4 },
  ];

  const startData = [
    { label: "00:00", value: 0 },
    { label: "01:00", value: 1 },
    { label: "02:00", value: 2 },
    { label: "03:00", value: 3 },
    { label: "04:00", value: 4 },
    { label: "05:00", value: 5 },
    { label: "06:00", value: 6 },
    { label: "07:00", value: 7 },
    { label: "08:00", value: 8 },
    { label: "09:00", value: 9 },
    { label: "10:00", value: 10 },
    { label: "11:00", value: 11 },
    { label: "12:00", value: 12 },
    { label: "13:00", value: 13 },
    { label: "14:00", value: 14 },
    { label: "15:00", value: 15 },
    { label: "16:00", value: 16 },
    { label: "17:00", value: 17 },
    { label: "18:00", value: 18 },
    { label: "19:00", value: 19 },
    { label: "20:00", value: 20 },
    { label: "21:00", value: 21 },
    { label: "22:00", value: 22 },
    { label: "23:00", value: 23 },
  ];

  const intervalTimeData = [
    { label: "4 Hours", value: 4 },
    { label: "5 Hours", value: 5 },
    { label: "6 Hours", value: 6 },
    { label: "7 Hours", value: 7 },
    { label: "8 Hours", value: 8 },
    { label: "9 Hours", value: 9 },
    { label: "10 Hours", value: 10 },
    { label: "11 Hours", value: 11 },
    { label: "12 Hours", value: 12 },
  ];

  useEffect(() => {
    const saveFeedingSchedule = async () => {
      if (interval == 1) {
        setIntervalTime(null);
      }

      const schedule = JSON.stringify({
        interval,
        intervalTime,
        start,
      });

      await AsyncStorage.setItem("feeding-schedule", schedule);
    };

    if ((interval !== null && start !== null) || intervalTime !== null) {
      saveFeedingSchedule();
    }
  }, [interval, start, intervalTime]);

  return (
    <Modal className="bg-white m-0" isVisible={isModalVisible}>
      <TouchableOpacity
        className="absolute top-20 left-6"
        onPress={toggleModal}
      >
        <Icon
          name="arrow-left"
          type="material-community"
          color="black"
          size={30}
        />
      </TouchableOpacity>
      <View className="flex-col items-center justify-center space-y-4">
        <Text
          className={`text-2xl text-black font-semibold ${Platform.OS === "ios" ? "underline decoration-[#fb7867]" : "border-b-2 border-[#fb7867]"}`}
        >
          Set Feeding Schedule
        </Text>
        <View className="flex-col space-y-4 justify-center items-center my-4">
          <Text className="text-base text-black font-medium">
            How many times a day do you feed your pet?
          </Text>

          <Dropdown
            className="w-72 bg-[#fb7867] rounded-lg font-medium"
            data={intervalData}
            placeholderStyle={{ color: "white" }}
            selectedTextStyle={{ color: "white", fontFamily: "Anta" }}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isIntFocus ? "Select feeding schedule" : "..."}
            value={interval}
            onFocus={() => setIsIntFocus(true)}
            onBlur={() => setIsIntFocus(false)}
            onChange={(item) => {
              if (item.value !== interval) {
                setInterval(item.value);
                setIsIntFocus(false);
              }
            }}
            renderLeftIcon={() => (
              <Icon
                className="px-3"
                name="food"
                type="material-community"
                color="white"
                size={20}
              />
            )}
            renderRightIcon={() => (
              <Icon
                className="px-3"
                name="chevron-down"
                type="material-community"
                color="white"
                size={24}
              />
            )}
          />
        </View>
        {interval === 1 ? null : (
          <View className="flex-col space-y-4 justify-center items-center my-4">
            <Text className="text-base text-black font-medium">
              How many hours between each feeding?
            </Text>

            <Dropdown
              className="w-72 bg-[#fb7867] rounded-lg font-medium"
              data={intervalTimeData}
              search={true}
              placeholderStyle={{ color: "white" }}
              selectedTextStyle={{ color: "white", fontFamily: "Anta" }}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isIntTimeFocus ? "Select interval time" : "..."}
              value={intervalTime}
              onFocus={() => setIsIntTimeFocus(true)}
              onBlur={() => setIsIntTimeFocus(false)}
              onChange={(item) => {
                if (item.value !== intervalTime) {
                  setIntervalTime(item.value);
                  setIsIntTimeFocus(false);
                }
              }}
              renderLeftIcon={() => (
                <Icon
                  className="px-3"
                  name="food"
                  type="material-community"
                  color="white"
                  size={20}
                />
              )}
              renderRightIcon={() => (
                <Icon
                  className="px-3"
                  name="chevron-down"
                  type="material-community"
                  color="white"
                  size={24}
                />
              )}
            />
          </View>
        )}
        <View className="flex-col space-y-4 justify-center items-center my-4">
          <Text className="text-base text-black font-medium">
            When do you start feeding your pet?
          </Text>

          <Dropdown
            className="w-72 bg-[#fb7867] rounded-lg font-medium"
            data={startData}
            search={true}
            placeholderStyle={{ color: "white" }}
            selectedTextStyle={{ color: "white", fontFamily: "Anta" }}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isStartFocus ? "Select start time" : "..."}
            value={start}
            onFocus={() => setIsStartFocus(true)}
            onBlur={() => setIsStartFocus(false)}
            onChange={(item) => {
              if (item.value !== start) {
                setStart(item.value);
                setIsStartFocus(false);
              }
            }}
            renderLeftIcon={() => (
              <Icon
                className="px-3"
                name="food"
                type="material-community"
                color="white"
                size={20}
              />
            )}
            renderRightIcon={() => (
              <Icon
                className="px-3"
                name="chevron-down"
                type="material-community"
                color="white"
                size={24}
              />
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const WaterModal = ({
  isWaterModalVisible,
  toggleWaterModal,
  waterInterval,
  waterStart,
  waterIntervalTime,
  setWaterInterval,
  setWaterStart,
  setWaterIntervalTime,
  token
}) => {
  const [isIntFocus, setIsIntFocus] = useState(false);
  const [isStartFocus, setIsStartFocus] = useState(false);
  const [isIntTimeFocus, setIsIntTimeFocus] = useState(false);

  const intervalData = [
    { label: "Once a day", value: 1 },
    { label: "Twice a day", value: 2 },
    { label: "Three times a day", value: 3 },
    { label: "Four times a day", value: 4 },
  ];

  const startData = [
    { label: "00:00", value: 0 },
    { label: "01:00", value: 1 },
    { label: "02:00", value: 2 },
    { label: "03:00", value: 3 },
    { label: "04:00", value: 4 },
    { label: "05:00", value: 5 },
    { label: "06:00", value: 6 },
    { label: "07:00", value: 7 },
    { label: "08:00", value: 8 },
    { label: "09:00", value: 9 },
    { label: "10:00", value: 10 },
    { label: "11:00", value: 11 },
    { label: "12:00", value: 12 },
    { label: "13:00", value: 13 },
    { label: "14:00", value: 14 },
    { label: "15:00", value: 15 },
    { label: "16:00", value: 16 },
    { label: "17:00", value: 17 },
    { label: "18:00", value: 18 },
    { label: "19:00", value: 19 },
    { label: "20:00", value: 20 },
    { label: "21:00", value: 21 },
    { label: "22:00", value: 22 },
    { label: "23:00", value: 23 },
  ];

  const intervalTimeData = [
    { label: "4 Hours", value: 4 },
    { label: "5 Hours", value: 5 },
    { label: "6 Hours", value: 6 },
    { label: "7 Hours", value: 7 },
    { label: "8 Hours", value: 8 },
    { label: "9 Hours", value: 9 },
    { label: "10 Hours", value: 10 },
    { label: "11 Hours", value: 11 },
    { label: "12 Hours", value: 12 },
  ];

  useEffect(() => {
    const saveWaterSchedule = async () => {
      if (waterInterval == 1) {
        setWaterIntervalTime(null);
      }

      const schedule = JSON.stringify({
        waterInterval,
        waterIntervalTime,
        waterStart,
      });

      await AsyncStorage.setItem("water-schedule", schedule);
    };

    if (
      (waterInterval !== null && waterStart !== null) ||
      waterIntervalTime !== null
    ) {
      saveWaterSchedule();
    }
  }, [waterInterval, waterStart, waterIntervalTime]);

  return (
    <Modal className="bg-white m-0" isVisible={isWaterModalVisible}>
      <TouchableOpacity
        className="absolute top-20 left-6"
        onPress={toggleWaterModal}
      >
        <Icon
          name="arrow-left"
          type="material-community"
          color="black"
          size={30}
        />
      </TouchableOpacity>
      <View className="flex-col items-center justify-center space-y-4">
        <Text className={`text-2xl text-black font-semibold ${Platform.OS === "ios" ? "underline decoration-[#fb7867]" : "border-b-2 border-[#fb7867]"}`}>
          Set Water Schedule
        </Text>
        <View className="flex-col space-y-4 justify-center items-center my-4">
          <Text className="text-base text-black font-medium text-center">
            How many times a day do you change your pet's water?
          </Text>

          <Dropdown
            className="w-72 bg-[#fb7867] rounded-lg font-medium"
            data={intervalData}
            placeholderStyle={{ color: "white" }}
            selectedTextStyle={{ color: "white", fontFamily: "Anta" }}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isIntFocus ? "Select water schedule" : "..."}
            value={waterInterval}
            onFocus={() => setIsIntFocus(true)}
            onBlur={() => setIsIntFocus(false)}
            onChange={(item) => {
              if (item.value !== waterInterval) {
                setWaterInterval(item.value);
                setIsIntFocus(false);
              }
            }}
            renderLeftIcon={() => (
              <Icon
                className="px-3"
                name="water"
                type="material-community"
                color="white"
                size={20}
              />
            )}
            renderRightIcon={() => (
              <Icon
                className="px-3"
                name="chevron-down"
                type="material-community"
                color="white"
                size={24}
              />
            )}
          />
        </View>
        {waterInterval === 1 ? null : (
          <View className="flex-col space-y-4 justify-center items-center my-4">
            <Text className="text-base text-black font-medium text-center">
              How many hours between each water change?
            </Text>

            <Dropdown
              className="w-72 bg-[#fb7867] rounded-lg font-medium"
              data={intervalTimeData}
              search={true}
              placeholderStyle={{ color: "white" }}
              selectedTextStyle={{ color: "white", fontFamily: "Anta" }}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isIntTimeFocus ? "Select interval time" : "..."}
              value={waterIntervalTime}
              onFocus={() => setIsIntTimeFocus(true)}
              onBlur={() => setIsIntTimeFocus(false)}
              onChange={(item) => {
                if (item.value !== waterIntervalTime) {
                  setWaterIntervalTime(item.value);
                  setIsIntTimeFocus(false);
                }
              }}
              renderLeftIcon={() => (
                <Icon
                  className="px-3"
                  name="water"
                  type="material-community"
                  color="white"
                  size={20}
                />
              )}
              renderRightIcon={() => (
                <Icon
                  className="px-3"
                  name="chevron-down"
                  type="material-community"
                  color="white"
                  size={24}
                />
              )}
            />
          </View>
        )}
        <View className="flex-col space-y-4 justify-center items-center my-4">
          <Text className="text-base text-black font-medium text-center">
            When do you start changing your pet's water?
          </Text>

          <Dropdown
            className="w-72 bg-[#fb7867] rounded-lg font-medium"
            data={startData}
            search={true}
            placeholderStyle={{ color: "white" }}
            selectedTextStyle={{ color: "white", fontFamily: "Anta" }}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isStartFocus ? "Select start time" : "..."}
            value={waterStart}
            onFocus={() => setIsStartFocus(true)}
            onBlur={() => setIsStartFocus(false)}
            onChange={(item) => {
              if (item.value !== waterStart) {
                setWaterStart(item.value);
                setIsStartFocus(false);
              }
            }}
            renderLeftIcon={() => (
              <Icon
                className="px-3"
                name="water"
                type="material-community"
                color="white"
                size={20}
              />
            )}
            renderRightIcon={() => (
              <Icon
                className="px-3"
                name="chevron-down"
                type="material-community"
                color="white"
                size={24}
              />
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const FeedList = ({ interval, start, intervalTime }) => {
  const currentTime = new Date().getHours();

  return (
    <View className="w-full flex-col space-y-4">
      {interval === 1 ? (
        <View className="w-full flex-row justify-between items-center px-4 py-3 bg-gray-200/60 rounded-xl">
          <View className="flex-row gap-3 items-center">
            <Icon
              className="p-2 rounded-lg bg-white"
              name="food-bank"
              type="material"
              color="black"
              size={32}
            />
            <View>
              {currentTime >= start ? (
                <Text className="text-xl font-semibold tracking-wide line-through">
                  Feed the pet
                </Text>
              ) : (
                <Text className="text-xl font-semibold tracking-wide">
                  Feed the pet
                </Text>
              )}
              <Text className="text-md font-semibold tracking-widest text-gray-500">
                {start + ":00"}
              </Text>
            </View>
          </View>
          {currentTime >= start ? (
            <Icon name="dot-fill" type="octicon" color="orange" size={26} />
          ) : (
            <Icon name="dot-fill" type="octicon" color="green" size={26} />
          )}
        </View>
      ) : (
        Array.from({ length: interval }).map((_, index) => (
          <View
            key={index}
            className="w-full flex-row justify-between items-center px-4 py-3 bg-gray-200/60 rounded-xl"
          >
            <View className="flex-row gap-3 items-center">
              <Icon
                className="p-2 rounded-lg bg-white"
                name="food-bank"
                type="material"
                color="black"
                size={32}
              />
              <View>
                {currentTime >= Number(start) + intervalTime * index ? (
                  <Text className="text-xl font-semibold tracking-wide line-through">
                    Feed the pet
                  </Text>
                ) : (
                  <Text className="text-xl font-semibold tracking-wide">
                    Feed the pet
                  </Text>
                )}
                <Text className="text-md font-semibold tracking-widest text-gray-500">
                  {index === 0
                    ? start + ":00"
                    : ((Number(start) + intervalTime * index + 24) % 24)
                      .toString()
                      .padStart(2, "0") + ":00"}
                </Text>
              </View>
            </View>
            {currentTime >= Number(start) + intervalTime * index ? (
              <Icon name="dot-fill" type="octicon" color="orange" size={26} />
            ) : (
              <Icon name="dot-fill" type="octicon" color="green" size={26} />
            )}
          </View>
        ))
      )}
    </View>
  );
};

const WaterList = ({ waterInterval, waterStart, waterIntervalTime }) => {
  const currentTime = new Date().getHours();

  return (
    <View className="w-full flex-col space-y-4">
      {waterInterval === 1 ? (
        <View className="w-full flex-row justify-between items-center px-4 py-3 bg-gray-200/60 rounded-xl">
          <View className="flex-row gap-3 items-center">
            <Icon
              className="p-2 rounded-lg bg-white"
              name="water-alert"
              type="material-community"
              color="black"
              size={32}
            />
            <View>
              {currentTime >= waterStart ? (
                <Text className="text-lg font-semibold line-through">
                  Change the water
                </Text>
              ) : (
                <Text className="text-lg font-semibold">
                  Change the water
                </Text>
              )}
              <Text className="text-md font-semibold tracking-widest text-gray-500">
                {waterStart + ":00"}
              </Text>
            </View>
          </View>
          {currentTime >= waterStart ? (
            <Icon name="dot-fill" type="octicon" color="orange" size={26} />
          ) : (
            <Icon name="dot-fill" type="octicon" color="green" size={26} />
          )}
        </View>
      ) : (
        Array.from({ length: waterInterval }).map((_, index) => (
          <View
            key={index}
            className="w-full flex-row justify-between items-center px-4 py-3 bg-gray-200/60 rounded-xl"
          >
            <View className="flex-row gap-3 items-center">
              <Icon
                className="p-2 rounded-lg bg-white"
                name="water-alert"
                type="material-community"
                color="black"
                size={32}
              />
              <View>
                {currentTime >=
                  Number(waterInterval) + waterIntervalTime * index ? (
                  <Text className="text-lg font-semibold line-through">
                    Change the water
                  </Text>
                ) : (
                  <Text className="text-lg font-semibold">
                    Change the water
                  </Text>
                )}
                <Text className="text-md font-semibold tracking-widest text-gray-500">
                  {index === 0
                    ? waterStart + ":00"
                    : (
                      (Number(waterStart) + waterIntervalTime * index + 24) %
                      24
                    )
                      .toString()
                      .padStart(2, "0") + ":00"}
                </Text>
              </View>
            </View>
            {currentTime >= Number(waterStart) + waterIntervalTime * index ? (
              <Icon name="dot-fill" type="octicon" color="orange" size={26} />
            ) : (
              <Icon name="dot-fill" type="octicon" color="green" size={26} />
            )}
          </View>
        ))
      )}
    </View>
  );
};
