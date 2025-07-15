import React, { useEffect, useState } from "react";
import { getDownloadURL, ref as refReg } from "firebase/storage";
import { useAuth } from "../../Context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../../config/firebase";

const Receipt = React.forwardRef(({ printData }, ref) => {
  const { currentUser } = useAuth();
  const [img_url, setImg_url] = useState("");
  const [userData, setUserData] = useState([]);
  const [test, setTest] = useState([]);

  const fetchData = async () => {
    try {
      const userDocRef = doc(db, "Users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userFetchData = userDocSnapshot.data();
        const img_url = await getDownloadURL(
          refReg(storage, `profile-images/${currentUser.uid}`)
        );

        setImg_url(img_url);
        setUserData(userFetchData);
      }
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
    }
  };

  const refresh = () => {
    setTest([]);
  };

  const handleAddMultipleTests = (count) => {
    const newTests = [];

    for (let i = 0; i < count; i++) {
      newTests.push(
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
            padding: "1%",
            borderBottom: "1px solid #4d4d4d",
            borderLeft: "1px solid #4d4d4d",
            borderRight: "1px solid #4d4d4d",
          }}
        >
          <h4 style={{ maxWidth: "30%" }}>
            {printData.tests[test.length + i].TestName}
          </h4>
          <h4>{(printData.tests[test.length + i].Rate != null) ? printData.tests[test.length + i].Rate: 0}</h4>
        </div>
      );
    }
    setTest((prevTest) => [...prevTest, ...newTests]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    refresh();
    if (printData.tests) {
      handleAddMultipleTests(printData.tests.length);
    }
  }, [printData]);

  const getCurrentDateIST = () => {
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata" };
    const date = now.toLocaleDateString("en-CA", options); // 'en-CA' locale formats date as YYYY-MM-DD
    return date;
  };

  return (
    <div ref={ref}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <h2>{userData.CompanyName}</h2>
        <h3>{userData.Address1}</h3>
        <h3>Phone: {userData.Phone}</h3>
        <div style={{ padding: "1%" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <h4>Name: {printData.PatientName}</h4>
          <h4>Date: {getCurrentDateIST()}</h4>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <h4>Age: {printData.Age}</h4>
          <h4>Ref No: {printData.PatientID}</h4>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <h4>Sex: {printData.Sex}</h4>
          <h4>Ref By Dr: {printData.RefByDr}</h4>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
            borderBottom: "1px solid #4d4d4d",
          }}
        >
          <h4 style={{ paddingLeft: "1%" }}>Investigation</h4>
          <h4 style={{ paddingRight: "1%" }}>Amount</h4>
        </div>
        {test}
        <div style={{ padding: "1%" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: "40%",
            width: "40%",
            padding: "1%",
            borderTop: "1px solid #4d4d4d",
            borderBottom: "1px solid #4d4d4d",
            borderLeft: "1px solid #4d4d4d",
            borderRight: "1px solid #4d4d4d",
          }}
        >
          <h4 style={{}}>Gross Amount: </h4>
          <h4 style={{}}>{printData.GrandAmount}</h4>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: "40%",
            width: "40%",
            padding: "1%",
            borderBottom: "1px solid #4d4d4d",
            borderLeft: "1px solid #4d4d4d",
            borderRight: "1px solid #4d4d4d",
          }}
        >
          <h4 style={{}}>Advance Paid: </h4>
          <h4 style={{}}>{printData.AdvanceAmount}</h4>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: "40%",
            width: "40%",
            padding: "1%",
            borderBottom: "1px solid #4d4d4d",
            borderLeft: "1px solid #4d4d4d",
            borderRight: "1px solid #4d4d4d",
          }}
        >
          <h4 style={{}}>Discount: </h4>
          <h4 style={{}}>{printData.Discount}</h4>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: "40%",
            width: "40%",
            padding: "1%",
            borderBottom: "1px solid #4d4d4d",
            borderLeft: "1px solid #4d4d4d",
            borderRight: "1px solid #4d4d4d",
          }}
        >
          <h4 style={{}}>Balance Amount: </h4>
          <h4 style={{}}>{printData.BalanceAmount}</h4>
        </div>
        <div style={{ padding: "3%", marginLeft: "70%" }}>Signature</div>
      </div>
    </div>
  );
});

export default Receipt;
