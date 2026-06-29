"use client"
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup
} from "firebase/auth";
import React from "react";
import { useState } from "react";
import {app} from "../app/firebase"


const auth = getAuth(app)
const googleprovider = new GoogleAuthProvider()

const Authpage = () => {


    // sing up
    const signup = () => {
        createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
            .then(value => console.log(value))// to see the return values
    }

    // sign in
    const signin = () => {
        signInWithEmailAndPassword(
            auth,
            email,
            password
        )
            .then(value => {   // to see the return values
                console.log("sign in successfully")
                console.log(value)
            })
            .catch((error) => console.log(" failed", error))

    }

    //sing in with google 
    const googleSignIn = () => {
        signInWithPopup(auth, googleprovider)
    }
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")


    return (

        <div className="main flex flex-col gap-2 align-middle justify-center">
            <div className="text text-white text-4xl">welcome to app</div>
            <input className="text-white border-2 " placeholder="email" type="email" onChange={(e) => { setemail(e.target.value) }} name="email" id="email" />
            <input className="text-white border-2 " placeholder="password" type="password" onChange={(e) => setpassword(e.target.value)} name="password" id="password" />
            <div className="btns flex justify-around">
                <button className="bg-green-500 p-1.5" onClick={signup}>sign up</button>
                <button className="bg-green-500 p-1.5" onClick={signin}>sign in</button>
            </div>
            <button className="bg-red-400 p-1.5" onClick={googleSignIn}>Continue with google</button>
        </div>

    )
}

export default Authpage