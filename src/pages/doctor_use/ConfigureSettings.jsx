import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Navbar from "../../Components/Navbar";
import styled from "styled-components";
import { useAuth } from "../../Context/AuthContext";
import { storeUserData2 } from "../../Components/storeUserData";
import { db, storage } from "../../config/firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  collection,
} from "firebase/firestore";
import { getAuth, deleteUser as deleteFirebaseUser } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";

const ConfigureSettings = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuth();
  const [profileImage, setProfileImage] = useState("");
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const user = getAuth().currentUser;

  useEffect(() => {
    fetchData();
  }, []);

  const deleteUser = async () => {
    if (!currentUser) {
      console.error("No user is signed in.");
      return;
    }

    const imageRef = ref(storage, `profile-images/${currentUser.uid}`);
    const userDocRef = doc(db, "Users", currentUser.uid);
    const subCollectionRef = collection(db, currentUser.uid);
    const snapshot = await getDocs(subCollectionRef);
    const batch = writeBatch(db);

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    try {
      await batch.commit();
      await deleteObject(imageRef)
        .then(() => {
          console.log("Profile image deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting profile image:", error);
          enqueueSnackbar("Failed to delete profile image.", {
            variant: "error",
          });
        });
      await deleteDoc(userDocRef);
      await deleteFirebaseUser(user).then(() => {
        enqueueSnackbar("User account and data deleted successfully.", {
          variant: "success",
        });
        navigate("/Login", { replace: true });
      });
    } catch (error) {
      console.error("Error deleting user data and account:", error);
      enqueueSnackbar("Failed to delete user data and account.", {
        variant: "error",
      });
    }
  };

  const fetchData = async () => {
    try {
      const userDocRef = doc(db, "Users", currentUser.uid);
      console.log(userDocRef);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userFetchData = userDocSnapshot.data();
        const img_url = await getDownloadURL(
          ref(storage, `profile-images/${currentUser.uid}`)
        );
        setProfileImage(`url(${img_url})`);
        setUserData(userFetchData);
      } else {
        setError(true);
        enqueueSnackbar("First save your settings", { variant: "info" });
      }
    } catch (error) {
      setError(true);
      console.error("Error fetching data from Firestore: ", error);
      enqueueSnackbar("First save your settings", {
        variant: "info",
      });
    }
  };

  const handleSubmit = async (e, v) => {
    {
      e.preventDefault();
      console.log(profileImage);
      const formData = new FormData(e.target);

      const file = formData.get("Image");
      if (file.name) {
        console.log(file);
        const storageRef = ref(storage, `profile-images/${currentUser.uid}`);

        try {
          const snapshot = await uploadBytes(storageRef, file);
        } catch (error) {
          enqueueSnackbar("Error uploading image", { variant: "error" });
        }
      }

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
      fetchData();
    }
  };
  const handleBlur = (e) => {
    if (e.target.value.length <= 1) {
      enqueueSnackbar("Please enter a valid input", { variant: "info" });
    }
  };
  const handleChange = () => {};

  if (error) {
    return <Navigate to={"doctor_use/InitialSheet"} replace={true} />;
  }

  return (
    <div style={{ backgroundColor: "#efedee", width: "100%", height: "100vh" }}>
      <Navbar destination={"/doctor_use/TestAdmission"} />
      <Wrapper>
        <div className="container">
          <div className="modal">
            <div className="modal-container">
              <div className="modal-left" style={{ paddingLeft: "100px" }}>
                <br></br>
                <h1 className="modal-title">SETTINGS</h1>
                <br></br>
                <form onSubmit={handleSubmit}>
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
                      defaultValue={userData.CompanyName}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                      defaultValue={userData.Address1}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                      defaultValue={userData.Address2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="city" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;City:&nbsp;
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="City"
                      id="name"
                      placeholder="Name"
                      defaultValue={userData.City}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="state" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;State:&nbsp;
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="State"
                      id="name"
                      placeholder="Name"
                      defaultValue={userData.State}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="pin code" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pin
                      Code:&nbsp;
                    </label>
                    <input
                      type="text"
                      pattern="^\d*\.?\d{0,2}$"
                      autoComplete="off"
                      name="Pin Code"
                      id="name"
                      placeholder="Name"
                      defaultValue={userData.PinCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="phone" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Phone:&nbsp;
                    </label>
                    <input
                      type="text"
                      pattern="^\d*\.?\d{0,2}$"
                      autoComplete="off"
                      name="Phone"
                      id="name"
                      placeholder="Name"
                      defaultValue={userData.Phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="confirm_password" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IMAGE:&nbsp;
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="Image"
                      style={{ paddingBottom: "4px" }}
                      // onChange={(e) => previewImage(e)}
                    />
                  </div>
                  <div className="modal-buttons">
                    <div style={{ padding: "2px" }}>
                      <button
                        className="input-button"
                        type="button"
                        style={{ marginLeft: "2px", marginRight: "2px" }}
                        onClick={deleteUser}
                      >
                        Delete Your Account
                      </button>
                      <button className="input-button" type="button">
                        no change
                      </button>
                      <button
                        className="input-button"
                        type="submit"
                        style={{ marginLeft: "2px" }}
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
              <div
                className="modal-right"
                style={{
                  backgroundImage:
                    "url('https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600')",
                }}
              >
                <div style={{ paddingTop: "17vh" }}>
                  <div className="input-block">
                    <label htmlFor="name" className="input-label">
                      Company Name:&nbsp;
                    </label>
                    <input
                      type="text"
                      pattern="text"
                      autoComplete="off"
                      name="name"
                      id="name"
                      placeholder={userData.CompanyName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="confirm_password" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Address1:&nbsp;
                    </label>
                    <input
                      type="text"
                      pattern="text"
                      autoComplete="off"
                      name="name"
                      id="name"
                      placeholder={userData.Address1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="name" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Address2:&nbsp;
                    </label>
                    <input
                      type="text"
                      pattern="text"
                      autoComplete="off"
                      name="name"
                      id="name"
                      placeholder={userData.Address2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="confirm_password" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;City:&nbsp;
                    </label>
                    <input
                      type="text"
                      pattern="text"
                      autoComplete="off"
                      name="name"
                      id="name"
                      placeholder={userData.City}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="confirm_password" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;State:&nbsp;
                    </label>
                    <input
                      type="text"
                      pattern="text"
                      autoComplete="off"
                      name="name"
                      id="name"
                      placeholder={userData.State}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="confirm_password" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pin
                      Code:&nbsp;
                    </label>
                    <input
                      type="text"
                      pattern="^\d*\.?\d{0,2}$"
                      autoComplete="off"
                      name="name"
                      id="name"
                      placeholder={userData.PinCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly
                    />
                  </div>
                  <div className="input-block">
                    <label htmlFor="confirm_password" className="input-label">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Phone:&nbsp;
                    </label>
                    <input
                      type="text"
                      pattern="^\d*\.?\d{0,2}$"
                      autoComplete="off"
                      name="name"
                      id="name"
                      placeholder={userData.Phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly
                    />
                  </div>
                  <div
                    style={{
                      marginLeft: "40%",
                      backgroundImage: profileImage,
                      width: "130px",
                      height: "120px",
                      backgroundSize: "cover",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

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

  .modal-right {
    flex: 2;
    font-size: 0;
    transition: 0.3s;
    overflow: hidden;
    // background-image: url("https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600");
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
    font-size: 11px;
    // text-transform: uppercase;
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

export default ConfigureSettings;
