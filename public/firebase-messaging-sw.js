importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js");

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

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


/*
The screenshot is showing **Firebase Admin SDK code** that sends an FCM message to a device. It **must run on a trusted backend** (such as a Next.js API route, Node.js server, or Cloud Function). It will not work if you paste it into a React or Next.js client component because the Admin SDK requires secret credentials.

Here's what the code from the screenshot looks like:

```javascript
// This registration token comes from the client FCM SDKs.
const registrationToken = "YOUR_REGISTRATION_TOKEN";

const message = {
  data: {
    score: "850",
    time: "2:45",
  },
  token: registrationToken,
};

// Send a message to the device corresponding to the provided registration token.
getMessaging()
  .send(message)
  .then((response) => {
    console.log("Successfully sent message:", response);
  })
  .catch((error) => {
    console.log("Error sending message:", error);
  });
```

## How to make it work in your Next.js app

### Step 1: Install Firebase Admin

```bash
npm install firebase-admin
```

---

### Step 2: Download your service account

In the Firebase Console:

1. Open **Project Settings**.
2. Go to **Service accounts**.
3. Click **Generate new private key**.
4. Save the downloaded JSON file somewhere secure (do not commit it to Git).

---

### Step 3: Initialize the Admin SDK

Create `firebaseAdmin.js` in your project root:

```javascript
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export { getMessaging };
```

---

### Step 4: Create a Next.js API route

Create:

```
app/api/send-notification/route.js
```

```javascript
import { getMessaging } from "@/firebaseAdmin";

export async function POST(req) {
  try {
    const { token, title, body } = await req.json();

    const message = {
      notification: {
        title,
        body,
      },
      token,
    };

    const response = await getMessaging().send(message);

    return Response.json({
      success: true,
      response,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

### Step 5: Get the FCM token on the client

```javascript
const token = await getToken(messaging, {
  vapidKey: "YOUR_VAPID_KEY",
});

console.log(token);
```

Save this token (for example, in Firestore) so you can send notifications to that user later.

---

### Step 6: Call your API

```javascript
await fetch("/api/send-notification", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    token: "<FCM_TOKEN>",
    title: "Hello",
    body: "This is an automatic notification",
  }),
});
```

---

## How automatic notifications work

```
User A sends a message
        │
        ▼
Message saved in Firestore
        │
        ▼
Your backend (Next.js API)
        │
        ▼
Reads User B's FCM token
        │
        ▼
Firebase Admin SDK
        │
        ▼
Push notification sent to User B
```

### Important

* **Do not** use the Firebase Admin SDK in the browser or a client component.
* Keep the **service account JSON** secret. Never expose it to users or commit it to a public repository.
* Store each user's FCM token in your database after they grant notification permission.

Since you're building a chat application, I can also help you implement the full flow where:

* users' FCM tokens are saved automatically,
* sending a chat message triggers the API,
* and the recipient receives a push notification without visiting the Firebase Console.

*/