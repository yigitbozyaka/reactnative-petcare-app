import { SafeAreaView, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import WelcomeScreen from "./screens/WelcomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HealthScreen from "./screens/HealthScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Fredoka: require("./assets/fonts/Fredoka.ttf"),
    Ubuntu: require("./assets/fonts/Ubuntu-Regular.ttf"),
    Anta: require("./assets/fonts/Anta-Regular.ttf"),
  });

  const [firstTime, setFirstTime] = useState(null);

  useEffect(() => {
    async function checkFirstTime() {
      try {
        const isFirstTime = await AsyncStorage.getItem("firstTime");
        setFirstTime(isFirstTime !== "false");
      } catch (error) {
        console.error("Error retrieving firstTime from AsyncStorage:", error);
      }
    }

    checkFirstTime();
  }, []);

  if (!fontsLoaded || firstTime === null) {
    return null;
  }
  
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        animated
        backgroundColor={"#fff"}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={firstTime === "false" ? "Home" : "Welcome"}>
            {firstTime && (
              <>
                <Stack.Screen
                  name="Welcome"
                  component={WelcomeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Details"
                  component={DetailsScreen}
                  options={{ headerShown: false }}
                />
              </>
            )}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Health"
              component={HealthScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
}
