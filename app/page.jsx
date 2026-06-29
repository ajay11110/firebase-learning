"use client"

import { app } from "./firebase"
import React from "react";
import { useState, useEffect } from "react";
import Authpage from "../components/Authpage"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Firestore from "../components/firestore"

const auth = getAuth(app)

export default function AuthPage() {


    const [userstate, setuserstate] = useState(null)

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                console.log("user is logged in")
                setuserstate(user)
            }

            else {
                console.log("user is logged out");
                setuserstate(null)

            }
        })
    })

    if (userstate === null) {
        return (
            <div>
                <Authpage />
            </div>
        )
    }

    else return (
        <div>
            <div>
                hello {userstate.email}
            </div>

            {/* starting fiestore from here */}
            <div>
                <Firestore />

            </div>

        </div>
    );
}
