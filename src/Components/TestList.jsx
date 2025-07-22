import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../Context/AuthContext";

const PendingReport = ({ onAdmissionIDSelect }) => {
  const [pendingData, setPendingData] = useState([]);
  const [error, setError] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    handleFind();
  }, []);

  const handleFind = async (e) => {
    try {
      const userDocRef = doc(db, currentUser.uid, "PendingReport");
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userFetchData = userDocSnapshot.data();
        setPendingData(Object.values(userFetchData));
        console.log("pending: ",pendingData);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.error("Error fetching data from Firestore: ", error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "10px",
        }}
      >
        <h4 style={{ paddingRight: "10px" }}>Addmission ID</h4>
        <h4>Patient Name</h4>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {pendingData.length > 0 ? (
          pendingData.map((data, index) => (
            <button
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "17px",
                padding: "10px",
                borderRadius: "2px",
                border: "1px solid #ddd",
                background: "#fff",
                color: "black",
              }}
              type="text"
              className="button1"
              onClick={() => onAdmissionIDSelect(data.PatientID)}
            >
              <h4>{data.PatientID}</h4>
              <h4>{data.PatientName}</h4>
            </button>
          ))
        ) : (
          <p>No pending reports</p>
        )}
        {error && (
          <p style={{ color: "red" }}>
            Error fetching data. Please check your internet connection.
          </p>
        )}
      </div>
    </>
  );
};

export default PendingReport;
