import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const storeUserData = async (vno, exportData, currentUser) => {
  try {
    console.log("store: ", exportData)
    console.log(currentUser);
    if (currentUser) {
      const userId = currentUser.uid;
      await setDoc(doc(db, userId, `${vno}`), exportData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const storeUserData2 = async (exportData, currentUser) => {
  try {
    console.log(currentUser);
    if (currentUser) {
      const userId = currentUser.uid;
      await setDoc(doc(db, "Users", userId), exportData);
    }
  } catch (error) {
    console.log(error);
  }
};
