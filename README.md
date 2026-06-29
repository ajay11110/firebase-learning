# Firebase Learning Application (Next.js)

Welcome! This repository serves as a step-by-step learning playground for integrating **Firebase** into a **Next.js** web application. It covers several critical modules:

1. **Firebase Setup & Initialization**
2. **Authentication** (Email/Password & Google OAuth)
3. **Cloud Firestore** (NoSQL Database CRUD operations & Queries)
4. **Realtime Database** (Synchronous read, write, and listeners)
5. **Push Notifications / Cloud Messaging (FCM)** (Web token request, background Service Worker handler, and backend notification trigger)

---

## 🛠️ Prerequisites & Installation

### 1. Install Dependencies
Ensure you have Node.js installed, then clone the repository and run:
```bash
npm install
```
Key packages in our [package.json](file:///a:/codes/firebase/app/package.json) include:
* `firebase`: SDK for all Client-side Firebase features.
* `next`: Modern React framework.
* `tailwindcss`: CSS Framework for styling.

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and enter your Firebase configurations:
```bash
cp .env.example .env.local
```
Fill in the values in [.env.local](file:///a:/codes/firebase/app/.env.local):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url_here
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here
```

---

## 📂 Project Structure

Here is how the project files are laid out:
* 📁 `app/`
  * [firebase.js](file:///a:/codes/firebase/app/app/firebase.js): Handles Firebase initialize configuration.
  * [layout.jsx](file:///a:/codes/firebase/app/app/layout.jsx): Root structure of the Next.js App.
  * [page.jsx](file:///a:/codes/firebase/app/app/page.jsx): Main dashboard page (auth state router).
  * 📁 `push_notification/`
    * [page.jsx](file:///a:/codes/firebase/app/app/push_notification/page.jsx): Front-end permission request & FCM registration.
* 📁 `components/`
  * [Authpage.jsx](file:///a:/codes/firebase/app/components/Authpage.jsx): Auth forms (Sign up, Sign in, and Google Auth).
  * [firestore.jsx](file:///a:/codes/firebase/app/components/firestore.jsx): UI & functions for Firestore and Realtime Databases.
* 📁 `public/`
  * [firebase-messaging-sw.js](file:///a:/codes/firebase/app/public/firebase-messaging-sw.js): Background Service Worker for Cloud Messaging.

---

## 🚀 Step-by-Step Implementation Guide

### Step 1: Firebase Initialization

To use any Firebase service, you must initialize the Firebase App. In [firebase.js](file:///a:/codes/firebase/app/app/firebase.js), we retrieve credentials from client-side environment variables and export the app instance.

```javascript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
```

---

### Step 2: Firebase Authentication

We handle user sessions, login/registration, and OAuth using Firebase Auth. 

#### 1. Listening to Auth State
In [page.jsx](file:///a:/codes/firebase/app/app/page.jsx), we monitor if a user is logged in or logged out using `onAuthStateChanged`. If no user is logged in, we render the login page; otherwise, we render the database dashboard.

```javascript
"use client"
import { app } from "./firebase"
import React, { useState, useEffect } from "react";
import Authpage from "../components/Authpage"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Firestore from "../components/firestore"

const auth = getAuth(app)

export default function AuthPage() {
    const [userstate, setuserstate] = useState(null)

    useEffect(() => {
        // Triggers automatically when a user logs in or out
        onAuthStateChanged(auth, user => {
            if (user) {
                console.log("user is logged in")
                setuserstate(user)
            } else {
                console.log("user is logged out");
                setuserstate(null)
            }
        })
    })

    if (userstate === null) {
        return <Authpage />
    }

    return (
        <div>
            <div>hello {userstate.email}</div>
            <Firestore />
        </div>
    );
}
```

#### 2. Sign Up, Sign In, and Google Auth
In [Authpage.jsx](file:///a:/codes/firebase/app/components/Authpage.jsx), we implement authentication functions:
* `createUserWithEmailAndPassword`: Register new user.
* `signInWithEmailAndPassword`: Authenticate existing user.
* `signInWithPopup` with `GoogleAuthProvider`: Prompt Google sign-in.

```javascript
"use client"
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider, 
    signInWithPopup
} from "firebase/auth";
import React, { useState } from "react";
import { app } from "../app/firebase"

const auth = getAuth(app)
const googleprovider = new GoogleAuthProvider()

const Authpage = () => {
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    // 1. Sign Up User
    const signup = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(value => console.log("Registered: ", value))
            .catch(err => console.error(err))
    }

    // 2. Sign In User
    const signin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(value => console.log("Sign in successfully", value))
            .catch(err => console.error("failed", err))
    }

    // 3. Sign In with Google
    const googleSignIn = () => {
        signInWithPopup(auth, googleprovider)
            .then(res => console.log("Google signed in: ", res))
            .catch(err => console.error(err))
    }

    return (
        <div className="main flex flex-col gap-2 align-middle justify-center">
            <div className="text text-white text-4xl">welcome to app</div>
            <input className="text-white border-2 " placeholder="email" type="email" onChange={(e) => setemail(e.target.value)} />
            <input className="text-white border-2 " placeholder="password" type="password" onChange={(e) => setpassword(e.target.value)} />
            <div className="btns flex justify-around">
                <button className="bg-green-500 p-1.5" onClick={signup}>sign up</button>
                <button className="bg-green-500 p-1.5" onClick={signin}>sign in</button>
            </div>
            <button className="bg-red-400 p-1.5" onClick={googleSignIn}>Continue with google</button>
        </div>
    )
}

export default Authpage;
```

---

### Step 3: Cloud Firestore (NoSQL Database)

In [firestore.jsx](file:///a:/codes/firebase/app/components/firestore.jsx), we perform standard CRUD (Create, Read, Update, Delete) and search operations in Firestore.

#### 1. Writing / Creating Data
We write a new document to the collection `collection1` using `addDoc` and `collection`.
```javascript
const writeData = async () => {
    const result = await addDoc(collection(firestore, "collection1"), {
        name: "ajay yadav",
        islearning: false,
        status: "ok"
    });
    console.log("result is ", result);
}
```

#### 2. Subcollections
Firestore allows nesting data under `collection/document/subcollection/document`.
```javascript
const subcollection = async () => {
    const result = await addDoc(collection(firestore, "collection1/2SzDSeJ8leDHthYLpxkm/branch"), {
        name: "MV",
        isExpanding: true,
        currentYear: "2nd"
    });
    console.log("result is ", result);
}
```

#### 3. Reading a Single Document
Using `getDoc` and the direct path reference `doc`.
```javascript
const readdata = async () => {
    let docref = doc(firestore, "collection1", "2SzDSeJ8leDHthYLpxkm")
    const spanshot = await getDoc(docref)
    console.log("result of reading is ", spanshot.data())
}
```

#### 4. Querying / Finding Documents
Using `query`, `where` filter constraints, and `getDocs`.
```javascript
const finddata = async () => {
    const collectionRef = collection(firestore, "collection1")
    const q = query(collectionRef, where("name", "==", "ajay yadav"))
    const spanshot = await getDocs(q)
    spanshot.forEach((data) => console.log(data.data()))
}
```

#### 5. Updating Data
We update specific fields using `updateDoc`.
```javascript
const update = async () => {
    let docref = doc(firestore, "collection1", "2SzDSeJ8leDHthYLpxkm")
    updateDoc(docref, {
        status: "ok ok"
    });
}
```

---

### Step 4: Realtime Database

Unlike Firestore, Firebase Realtime Database stores data as a single JSON tree and focuses on immediate updates. It is highly optimized for low-latency synchronization.

In [firestore.jsx](file:///a:/codes/firebase/app/components/firestore.jsx), we demoed these operations:

#### 1. Writing Data
Use `set` to write data to a specific JSON reference path.
```javascript
const database = getDatabase(app);

const realwrite = (key, data) => {
    set(ref(database, key), data); // e.g. key="user/u1"
}
```

#### 2. Reading Data Once
Use `get` to read value snapshot once.
```javascript
const realread = () => {
    get(child(ref(database), "user")).then((snapshot) => console.log(snapshot.val()))
}
```

#### 3. Real-time Subscription Listener
Use `onValue` to automatically trigger a callback whenever data at the path updates.
```javascript
onValue(ref(database, "user"), (snapshot) => {
    console.log("Realtime DB update detected: ", snapshot.val());
});
```

---

### Step 5: Push Notifications & Cloud Messaging (FCM)

To send notifications to users (even when they aren't on the website), we configure Firebase Cloud Messaging (FCM).

#### 1. Client-Side Permission and Token Request
In [page.jsx](file:///a:/codes/firebase/app/app/push_notification/page.jsx), we ask the browser for permission. Once granted, we dynamically register our service worker by serializing local environment variables as a query parameters payload. Firebase will pick up the existing registration instead of starting its own static registration.

```javascript
"use client"
import React, { useEffect } from "react";
import { app } from "../firebase";
import { getMessaging, getToken } from "firebase/messaging"

let messaging;

const NotificationPage = () => {

    const askNotification = async () => {
        const permission = await Notification.requestPermission()
        console.log("Notification permission state: ", Notification.permission);
        
        if (permission === "granted") {
            if ("serviceWorker" in navigator) {
                // Serialize environment variables to URL queries
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
                    console.error("FCM Registration failed: ", err);
                }
            }
        } else {
            console.log("Permission denied");
        }
    }

    useEffect(() => {
        messaging = getMessaging(app);
        askNotification();
    }, [])

    return (
        <div>
            <div>FCM Push Notification Setup Page</div>
        </div>
    )
}

export default NotificationPage;
```

#### 2. Background Service Worker (Dynamic Initialization)
For notifications to load when the app is in the background, we must have a file exactly named `firebase-messaging-sw.js` in our `public/` folder.

Inside [firebase-messaging-sw.js](file:///a:/codes/firebase/app/public/firebase-messaging-sw.js):
```javascript
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js");

// Extract credentials from registration query parameters
const urlParams = new URLSearchParams(self.location.search);

firebase.initializeApp({
  apiKey: urlParams.get("apiKey"),
  authDomain: urlParams.get("authDomain"),
  projectId: urlParams.get("projectId"),
  storageBucket: urlParams.get("storageBucket"),
  messagingSenderId: urlParams.get("messagingSenderId"),
  appId: urlParams.get("appId"),
  databaseURL: urlParams.get("databaseURL")
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

#### 3. How to Send Push Notifications
Because sending push notifications requires secret admin credentials, **you must never run sending code on the client browser**. It must run on a trusted backend (like a Next.js API route or Node.js server).

1. Install Firebase Admin:
   ```bash
   npm install firebase-admin
   ```
2. Download service account credentials from Firebase Console (Project Settings -> Service Accounts -> Generate new private key). Keep this JSON file safe and out of git!
3. Build a Next.js API Route (e.g., `app/api/send-notification/route.js`) to trigger messages:

```javascript
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function POST(req) {
  try {
    const { token, title, body } = await req.json();

    const message = {
      notification: { title, body },
      token, // Target device registration token
    };

    const response = await getMessaging().send(message);
    return Response.json({ success: true, response });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

---

## 🚀 Running the App Locally

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view:
* Register/Login forms on the main landing page.
* Realtime Database & Firestore operations dashboard upon login.
* Push Notification permissions page at `/push_notification`.
