import React from "react";
import { app } from "../app/firebase"
import {
    doc, getFirestore, // general
    collection, addDoc,// writing data
    getDoc,// reading data
    query, where, getDocs,  // finding data / quaring
    updateDoc // to update data
} from "firebase/firestore";
import {
    getDatabase, //general for realtime data
    set, ref,// writing / putting data
    get, child,  // reading 
    onValue // chanding in app realtime
} from "firebase/database"; 

const firestore = getFirestore(app)

//writing ------------------------------ 
// making document in firestore
const writeData = async () => {
    const result = await addDoc(collection(firestore, "collection1"), {
        name: "ajay yadav",
        islearning: false,
        status: "ok"
    })

    console.log("result is ", result)

}

//making subcollection / collection in document  
const subcollection = async () => {
    const result = await addDoc(collection(firestore, "collection1/2SzDSeJ8leDHthYLpxkm/branch"), {
        name: "MV",
        isExpanding: true,
        currentYear: "2nd"
    })

    console.log("result is ", result)
}

// reading -  -----------------------
const readdata = async () => {
    let docref = doc(firestore, "collection1", "2SzDSeJ8leDHthYLpxkm")
    const spanshot = await getDoc(docref)
    console.log("result of reading is ", spanshot.data())
}

//finding ----------------------------------

const finddata = async () => {
    const collectionRef = collection(firestore, "collection1")
    const q = query(collectionRef, where("name", "==", "ajay yadav"))
    const spanshot = await getDocs(q)
    spanshot.forEach((data) => console.log(data.data()))
}

// updating -----------------------------------

const update = async () => {
    let docref = doc(firestore, "collection1", "2SzDSeJ8leDHthYLpxkm")
    updateDoc(docref, {
        status: "ok ok"
    })
}

// realtime database ---------------------------------
const database = getDatabase(app)

// writing data
const realwrite = (key, data) => {
    set(ref(database, key), data)
}

//reading data 
const realread = () => {
    get(child(ref(database), "user")).then((snapshot) => console.log(snapshot.val()))
}

//realtime value changings ####################################
onValue(ref(database, "user"), (snapshot)=> console.log(snapshot.val()))

const Firestore = () => {
    return (
        <div>
            <div>firestore database</div>
            <button className="btn" onClick={writeData}>click to put data</button>
            <button className="btn" onClick={subcollection}>click to make collection in document</button>
            <button className="btn" onClick={readdata}>click to read data</button>
            <button className="btn" onClick={finddata}>click to query data</button>
            <button className="btn" onClick={update}>click to update data</button>
            <div> </div>
            <div>realtime database</div>
            <button className="btn2 btn" onClick={() => { realwrite("user/u1", { name: "ajay yadav", isstart: true }) }}>click to put data</button>
            <button className="btn2 btn" onClick={realread}>click to get data</button>

        </div >
    )
}

export default Firestore