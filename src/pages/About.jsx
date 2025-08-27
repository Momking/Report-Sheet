import React from "react";
import Navbar from "../Components/Navbar";

const About = () => {
  return (
    <div
      style={{
        backgroundColor: "#eef3f3",
        color: "black",
        height: "100vh",
        width: "100%",
      }}
    >
      <Navbar destination={"/doctor_use/TestAdmission"} />
      <div
        style={{
          paddingTop: "12vh",
          textAlign: "center",
        }}
      >
        <h1>Creating a New Project</h1>
        <p style={{ padding: "5vh" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum,
          maiores. Nulla maxime quaerat eligendi voluptate delectus ab cum
          laudantium incidunt dolores tempore! Tenetur accusantium officia quod
          quam repudiandae sapiente amet?Lorem ipsum dolor sit, amet consectetur
          adipisicing elit. Fugiat est laborum incidunt, accusantium quibusdam
          velit cum. Repellendus adipisci soluta odit laudantium quam ipsa,
          repudiandae fugiat atque. Officiis eum eaque labore.
        </p>
        <h3 style={{ paddingTop: "30vh" }}>Contact Us :</h3>
        Email:{" "}
        <a href="mailto:nishant.dqy@gmail.com?subject=Subject%20of%20the%20email&body=Body%20of%20the%20email">
          nishant.dqy@gmail.com
        </a>
        <br></br>
        Phone no: <a href="tel:+918533045734">8533045734</a>
      </div>
    </div>
  );
};

export default About;
