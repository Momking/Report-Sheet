import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { useSnackbar } from "notistack";
import { storeUserData2 } from "../Components/storeUserData";
import { useAuth } from "../Context/AuthContext";
import { storage } from "../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const InitialSheet = () => {
  const { currentUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar("");
  const [correct, setCorrect] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const fetchData = async () => {
    try {
      const userDocRef = doc(db, "Users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      console.log(userDocSnapshot);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const img_url = await getDownloadURL(
          ref(storage, `profile-images/${currentUser.uid}`)
        );
        setProfileImage(`url(${img_url})`);
        setCorrect(true);
      } else {
        setError(true);
        enqueueSnackbar("First save your settings", { variant: "info" });
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e, v) => {
    {
      e.preventDefault();
      const formData = new FormData(e.target);

      const file = formData.get("Image");
      console.log(file);
      const storageRef = ref(storage, `profile-images/${currentUser.uid}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const exportData = {
          CompanyName: formData.get("Company Name"),
          Address1: formData.get("Address1"),
          Address2: formData.get("Address2"),
          City: formData.get("City"),
          State: formData.get("State"),
          PinCode: formData.get("Pin Code"),
          Phone: formData.get("Phone"),
          Image: profileImage,
        };
        await storeUserData2(exportData, currentUser);
        setCorrect(true);
      } catch (error) {
        enqueueSnackbar("Error uploading image", { variant: "error" });
      }
    }
  };

  if (correct) {
    return <Navigate to={"/"} replace={true} />;
  }
  return (
    <div style={{ backgroundColor: "#efedee", width: "100%", height: "100vh" }}>
      <Wrapper>
        <div className="container">
          <div className="modal">
            <div className="modal-container">
              <div className="modal-left">
                <br></br>
                <h1 className="modal-title">SETTINGS</h1>
                <br></br>
                <form onSubmit={handleSubmit} style={{ marginLeft: "30vw" }}>
                  <div className="input-block">
                    <label htmlFor="name" className="input-label">
                      Company Name:&nbsp;
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="Company Name"
                      id="name"
                      placeholder="Name"
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="Address1" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Address1:&nbsp;
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="Address1"
                      id="name"
                      placeholder="Name"
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="Address2" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Address2:&nbsp;
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="Address2"
                      id="name"
                      placeholder="Name"
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="city" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;City:&nbsp;
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="City"
                      id="name"
                      placeholder="Name"
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="state" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;State:&nbsp;
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="State"
                      id="name"
                      placeholder="Name"
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="pin code" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pin
                      Code:&nbsp;
                    </label>
                    <input
                      type="text"
                      pattern="^\d*\.?\d{0,2}$"
                      autoComplete="off"
                      name="Pin Code"
                      id="name"
                      placeholder="Name"
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="phone" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Phone:&nbsp;
                    </label>
                    <input
                      type="text"
                      pattern="^\d*\.?\d{0,2}$"
                      autoComplete="off"
                      name="Phone"
                      id="name"
                      placeholder="Name"
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="confirm_password" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IMAGE:&nbsp;
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="Image"
                      style={{ paddingBottom: "4px" }}
                    />
                  </div>
                  <div className="modal-buttons">
                    <div style={{ padding: "2px" }}>
                      <button
                        className="input-button"
                        type="submit"
                        style={{ marginRight: "2px" }}
                      >
                        SAVE CHANGES
                      </button>
                    </div>
                  </div>
                </form>
                <br></br>
                <br></br>
                <br></br>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default InitialSheet;

const Wrapper = styled.section`
  .container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #efedee;
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
    color: #55311c;
  }
  .form-error {
    font-size: 1.4rem;
    color: #b22b27;
  }
  .modal-desc {
    margin: 6px 0 30px 0;
  }
  .modal-left {
    padding: 60px 30px 20px;
    background: #fff;
    flex: 1.5;
    transition-duration: 0.5s;
    opacity: 1;
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
    font-size: 15px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.7px;
    color: #8c7569;
    transition: 0.3s;
  }

  .input-block {
    display: flex;
    flex-direction: row;
    padding: 10px 10px 8px;
    // border: 1px solid #ddd;
    // border-radius: 4px;
    margin-bottom: 10px;
    transition: 0.3s;
  }

  .input-block input {
    outline: 0;
    border: 0;
    padding: 4px 4px 1px;
    border-radius: 3px;
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

    .modal-right {
      display: none;
    }
    .flexChange {
      flex-direction: column;
    }
  }
`;
