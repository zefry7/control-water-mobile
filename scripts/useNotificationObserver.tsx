import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

export function useNotificationObserver() {
    const notificationListenerRef = useRef<Notifications.Subscription>();

    useEffect(() => {
        registerForPushNotificationsAsync();
        // Cleanup function to remove the listener when the component unmounts
        return () => {
            if (notificationListenerRef.current) {
                Notifications.removeNotificationSubscription(notificationListenerRef.current);
            }
        };
    }, []);

    const registerForPushNotificationsAsync = async () => {
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "Local Notification Test",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }

        notificationListenerRef.current = Notifications.addNotificationReceivedListener(
            handleNotification
        );
    };

    const handleNotification = (notification: any) => {
        // Alert.alert(
        //   "Notification received!",
        //   notification?.request.content.body || notification.data?.body
        // ); // Handle notification content based on platform
        console.log(notification);
    };

    const sendNotification = () => {
        console.log("Уведомление отправлено");
        Notifications.scheduleNotificationAsync({
            content: {
                title: "Уведомление",
                body: "Проверка уведомления!",
            },
            trigger: { seconds: 5 },
        });
    };

    return sendNotification;
}
