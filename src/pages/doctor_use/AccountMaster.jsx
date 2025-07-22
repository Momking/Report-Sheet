import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import styled from "styled-components";
import { useAuth } from "../../Context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const AccountMaster = () => {
    const [data, setData] = useState([]);
    const [dayAmount, setDayAmount] = useState([]);
    const [monthAmount, setMonthAmount] = useState([]);
    const [yearAmount, setYearAmount] = useState([]);
    const [error, setError] = useState();
    const {currentUser} = useAuth();

    const fetchAccountMaster = async () => {
        try {
            if (currentUser?.uid) {
              const userDocRef = doc(db, currentUser.uid, "Account Master");
              const docSnap = await getDoc(userDocRef);
              if (docSnap.exists()) {
                const useData = docSnap.data();
                extractData(useData);
                setData(useData);
              } else {
                setError("No data found.");
              }
            }
          } catch (error) {
            console.error("Error fetching data from Firestore: ", error);
            setError("Error fetching data.");
          }
    }

    const extractData = (useData) => {
        const date = getCurrentDateIST();
        const [year, month, day] = date.split("-");

        console.log(year, month, day);

        let yearVal = {
          GrandAmount: 0,
          AdvanceAmount: 0,
          Discount: 0,
          BalanceAmount: 0
        };
        for(let months in useData[year]){
          console.log("mon: ",months.split(" ")[1]);

          let monthVal = {
            GrandAmount: 0,
            AdvanceAmount: 0,
            Discount: 0,
            BalanceAmount: 0
          };

          console.log("value: ", useData[year]);
          for(const day in useData[year][months]){
            monthVal.GrandAmount += parseFloat(useData[year][months][day].GrandAmount);
            monthVal.AdvanceAmount += parseFloat(useData[year][months][day].AdvanceAmount);
            monthVal.Discount += parseFloat(useData[year][months][day].Discount);
            monthVal.BalanceAmount += parseFloat(useData[year][months][day].BalanceAmount);
          }
          // console.log("monthval: ",monthVal);
          if(month == months.split(" ")[1]){
            console.log("monval: ",monthVal);
            setDayAmount(useData[year][months][date]);
            setMonthAmount(monthVal);
          }
          yearVal.GrandAmount += parseFloat(monthVal.GrandAmount);
          yearVal.AdvanceAmount += parseFloat(monthVal.AdvanceAmount);
          yearVal.Discount += parseFloat(monthVal.Discount);
          yearVal.BalanceAmount += parseFloat(monthVal.BalanceAmount);
        }
        setYearAmount(yearVal);
    }

    const getCurrentDateIST = () => {
      const now = new Date();
      const options = { timeZone: "Asia/Kolkata" };
      const date = now.toLocaleDateString("en-CA", options); // 'en-CA' locale formats date as YYYY-MM-DD
      return date;
    };

    useEffect(() => {
      fetchAccountMaster();
    }, [])

    return (
        <div style={{ backgroundColor: "#efedee", width: "100%", height: "100vh" }}>
            <Navbar destination={"/doctor_use/TestAdmission"} />
            <Wrapper>
                <div className="container">
                <div className="modal">
                    <div className="modal-container">
                        <div className="modal-left">
                            <h1 className="modal-title">Account Master</h1>
                            <br/>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    color: "black",
                                }}
                            >
                                <div className="cards">
                                    <br/>
                                    <h2 className="modal-title">Daily Cash Report</h2>
                                    <div style={{ }}>
                                    <div className="input-block">
                                      <label htmlFor="name" className="input-label">
                                        Grand Amount:&nbsp;
                                      </label>
                                      <input
                                        style={{marginLeft: "2vh"}}
                                        type="text"
                                        pattern="text"
                                        autoComplete="off"
                                        name="name"
                                        id="name"
                                        defaultValue={dayAmount?.GrandAmount}
                                        readOnly
                                      />
                                    </div>
                                    <div className="input-block">
                                      <label htmlFor="confirm_password" className="input-label">
                                        Advance Amount:&nbsp;
                                      </label>
                                      <input
                                        type="text"
                                        pattern="text"
                                        autoComplete="off"
                                        name="name"
                                        id="name"
                                        defaultValue={dayAmount?.AdvanceAmount}
                                        readOnly
                                      />
                                    </div>
                                    <div className="input-block">
                                      <label htmlFor="name" className="input-label">
                                        Discount:&nbsp;
                                      </label>
                                      <input
                                      style={{marginLeft: "7vh"}}
                                        type="text"
                                        pattern="text"
                                        autoComplete="off"
                                        name="name"
                                        id="name"
                                        defaultValue={dayAmount?.Discount}
                                        readOnly
                                      />
                                    </div>
                                    <div className="input-block">
                                      <label htmlFor="confirm_password" className="input-label">
                                        Balance Amount:&nbsp;
                                      </label>
                                      <input
                                        style={{marginLeft: ".5vh"}}
                                        type="text"
                                        pattern="text"
                                        autoComplete="off"
                                        name="name"
                                        id="name"
                                        defaultValue={dayAmount?.BalanceAmount}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="cards">
                                    <br/>
                                    <h2 className="modal-title" >Monthly Cash Report</h2>
                                    <div style={{ }}>
                                    <div className="input-block">
                                      <label htmlFor="name" className="input-label">
                                        Grand Amount:&nbsp;
                                      </label>
                                      <input
                                        style={{marginLeft: "2vh"}}
                                        type="text"
                                        pattern="text"
                                        autoComplete="off"
                                        name="name"
                                        id="name"
                                        defaultValue={monthAmount?.GrandAmount}
                                        readOnly
                                      />
                                    </div>
                                    <div className="input-block">
                                      <label htmlFor="confirm_password" className="input-label">
                                        Advance Amount:&nbsp;
                                      </label>
                                      <input
                                        type="text"
                                        pattern="text"
                                        autoComplete="off"
                                        name="name"
                                        id="name"
                                        defaultValue={monthAmount?.AdvanceAmount}
                                        readOnly
                                      />
                                    </div>
                                    <div className="input-block">
                                      <label htmlFor="name" className="input-label">
                                        Discount:&nbsp;
                                      </label>
                                      <input
                                        style={{marginLeft: "7vh"}}
                                        type="text"
                                        pattern="text"
                                        autoComplete="off"
                                        name="name"
                                        id="name"
                                        defaultValue={monthAmount?.Discount}
                                        readOnly
                                      />
                                    </div>
                                    <div className="input-block">
                                      <label htmlFor="confirm_password" className="input-label">
                                        Balance Amount:&nbsp;
                                      </label>
                                      <input
                                        style={{marginLeft: ".5vh"}}
                                        type="text"
                                        pattern="text"
                                        autoComplete="off"
                                        name="name"
                                        id="name"
                                        defaultValue={monthAmount?.BalanceAmount}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                </div>
                            </div>
                            <br/>
                            <div className="cards" style={{marginLeft: "35%", color: "black"}}>
                                <br/>
                                <h2 className="modal-title">Yearly Cash Report</h2>
                                <div style={{ }}>
                                  <div className="input-block">
                                    <label htmlFor="name" className="input-label">
                                      Grand Amount:&nbsp;
                                    </label>
                                    <input
                                      style={{marginLeft: "2vh"}}
                                      type="text"
                                      pattern="text"
                                      autoComplete="off"
                                      name="name"
                                      id="name"
                                      defaultValue={yearAmount?.GrandAmount}
                                      readOnly
                                    />
                                  </div>
                                  <div className="input-block">
                                    <label htmlFor="confirm_password" className="input-label">
                                      Advance Amount:&nbsp;
                                    </label>
                                    <input
                                      type="text"
                                      pattern="text"
                                      autoComplete="off"
                                      name="name"
                                      id="name"
                                      defaultValue={yearAmount?.AdvanceAmount}
                                      readOnly
                                    />
                                  </div>
                                  <div className="input-block">
                                    <label htmlFor="name" className="input-label">
                                      Discount:&nbsp;
                                    </label>
                                    <input
                                      style={{marginLeft: "7vh"}}
                                      type="text"
                                      pattern="text"
                                      autoComplete="off"
                                      name="name"
                                      id="name"
                                      defaultValue={yearAmount?.Discount}
                                      readOnly
                                    />
                                  </div>
                                  <div className="input-block">
                                    <label htmlFor="confirm_password" className="input-label">
                                      Balance Amount:&nbsp;
                                    </label>
                                    <input
                                      style={{marginLeft: ".5vh"}}
                                      type="text"
                                      pattern="text"
                                      autoComplete="off"
                                      name="name"
                                      id="name"
                                      defaultValue={yearAmount?.BalanceAmount}
                                      readOnly
                                    />
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </Wrapper>
        </div>
    );
}

const Wrapper = styled.section`
  .container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #edf7f9;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    width: 100%;
    background: rgba(51, 51, 51, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: 0.4s;
  }
  .modal-container {
    display: flex;
    max-width: 95vw;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    position: absolute;

    transition-duration: 0.3s;
    background: #fff;
  }
  .modal-title {
    margin: 0;
    font-weight: 400;
    color: #023656;
  }
  .form-error {
    font-size: 1.4rem;
    color: #b22b27;
  }
  .modal-desc {
    margin: 6px 0 30px 0;
  }
  .modal-left {
    padding: 5px 30px 20px;
    background: #e2eff5;
    flex: 1.5;
    transition-duration: 0.5s;
    opacity: 1;
  }

  .cards {
    width: 50vh;
    height: 40vh;
    border-radius: 10px;
    background: #e2eff5;
  }

  .modal.is-open .modal-left {
    transform: translateY(0);
    opacity: 1;
    transition-delay: 0.1s;
  }
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal-buttons a {
    color: rgba(51, 51, 51, 0.6);
    font-size: 14px;
  }

  .input-button {
    // padding: 1.2rem 3.2rem;
    outline: none;
    text-transform: uppercase;
    border: 0;
    color: #fff;
    border-radius: 4px;
    background: #8c7569;
    transition: 0.3s;
    cursor: pointer;
    font-family: "Nunito", sans-serif;
  }
  .input-button:hover {
    background: #55311c;
  }

  .input-label {
    font-size: 13px;
    // text-transform: uppercase;
    margin-left: 5vh;
    font-weight: 600;
    letter-spacing: 0.7px;
    color: black;
    transition: 0.3s;
  }

  .input-block {
    display: flex;
    flex-direction: row;
    padding: 2vh 2vh .5vh;
    margin-bottom: 10px;
    transition: 0.3s;
    }
    
  .input-block input {
    color: black;
    outline: 0;
    border: 0;
    padding: 4px 4px 1px;
    border-radius: 3px;
    align: center;
    background: #ffffff;
    font-size: 15px;
  }

  .input-block input::-moz-placeholder {
    color: #ccc;
    opacity: 1;
  }
  .input-block input:-ms-input-placeholder {
    color: #ccc;
    opacity: 1;
  }
  .input-block input::placeholder {
    color: #ccc;
    opacity: 1;
  }
  .input-block:focus-within {
    border-color: #8c7569;
  }
  .input-block:focus-within .input-label {
    color: rgba(140, 117, 105, 0.8);
  }

  @media (max-width: 750px) {
    .modal-container {
      max-width: 90vw;
    }
    .flexChange {
      flex-direction: column;
    }
  }

  @media (max-height: 750px){
    .input-label {
      font-size: 11px;
    }
  }
`;

export default AccountMaster;