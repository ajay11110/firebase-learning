"use client"
import React, { useEffect } from "react";
import { app } from "../firebase";
import { getMessaging, getToken } from "firebase/messaging"

let messaging

const NotificationPage = () => {

    const askNotification = async () => {

        const permission = await Notification.requestPermission()
        console.log(Notification.permission);
        if (permission === "granted") {
            if ("serviceWorker" in navigator) {
                const queryParams = new URLSearchParams({
                    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
                    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
                    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
                    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
                    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
                    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
                }).toString();

                try {
                    const registration = await navigator.serviceWorker.register(
                        `/firebase-messaging-sw.js?${queryParams}`
                    );
                    const token = await getToken(messaging, { 
                        serviceWorkerRegistration: registration,
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY 
                    });
                    console.log("FCM Token: ", token);
                } catch (err) {
                    console.error("Service worker registration or token retrieval failed: ", err);
                }
            }
        }
        else if (permission === "denied") {
            console.log("permission denied")
        }

    }

    useEffect(() => {
        messaging = getMessaging(app)
        askNotification()
    }, [])


    return (
        <div>

            <div>hello</div>
        </div>


    )
}

export default NotificationPage