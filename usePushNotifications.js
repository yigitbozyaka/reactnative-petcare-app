import { useState, useEffect, useRef } from "react";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import Constants from "expo-constants";

import { Platform } from "react-native";

export const usePushNotifications = () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false,
            shouldShowAlert: true,
            shouldSetBadge: false
        })
    });

    const [expoPushToken, setExpoPushToken] = useState();
    const [notification, setNotification] = useState();

    const notificationListener = useRef();
    const responseListener = useRef();

    async function registerForPushNotificationsAsync() {
        let token;

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();

            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                alert("Failed to get push token");
            }

            token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId,
            });

            if (Platform.OS === "android") {
                Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF231F7C",
                })
            }

            return token;
            
        } else {
            console.log("error")
        }
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
            setExpoPushToken(token);
        });

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response)
        })

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current
            )

            Notifications.removeNotificationSubscription(responseListener.current);
        }
    }, [])

    return {
        expoPushToken,
        notification
    }
}