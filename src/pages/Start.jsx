import React from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { TbBrandShopee } from "react-icons/tb";
import { FaInfoCircle, FaChartBar, FaCog, FaUsers, FaInfo } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(50, 215, 220, 0.3);}
  70% { box-shadow: 0 0 0 20px rgba(50, 215, 220, 0);}
  100% { box-shadow: 0 0 0 0 rgba(50, 215, 220, 0); }
`;

const DashboardWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(120deg, #212529 60%, #70affe 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 48px 80px;
  font-family: 'Montserrat', sans-serif;
`;

const Heading = styled.h1`
  color: #e5f3fe;
  font-size: 3rem;
  margin-bottom: 8px;
  text-align: center;
  font-weight: 700;
`;

const Subheading = styled.p`
  color: #a1bed6;
  font-size: 1.3rem;
  margin-bottom: 48px;
  text-align: center;
  font-weight: 500;
  max-width: 640px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(280px,1fr));
  gap: 48px 56px;
  width: 100%;
  max-width: 1140px;
`;

const Card = styled(Link)`
  background: #1e2429;
  border-radius: 20px;
  box-shadow: 0 8px 32px #0b22312e, 0 1.5px 8px #3ac1c1a3;
  padding: 48px 36px;
  color: #bee7ff;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 48px #70dce910, 0 6px 14px #2dababdf;
    color: #d6f6fe;

    .icon {
      animation: ${pulse} 1s alternate infinite;
      color: #32d7dc;
    }
  }
`;

const IconWrapper = styled.div`
  font-size: 5.6rem;
  margin-bottom: 24px;
  color: #5bc0e8;
`;

const CardTitle = styled.div`
  font-size: 1.47rem;
  font-weight: 600;
  margin-bottom: 14px;
  text-align: center;
`;

const CardDesc = styled.div`
  font-size: 1.1rem;
  color: #a1bcd5;
  text-align: center;
  max-width: 280px;
`;

const InfoBar = styled.div`
  width: 80%;
  max-width: 880px;
  background: #2d4e67;
  border-radius: 16px;
  color: #e1efff;
  font-weight: 500;
  padding: 20px 28px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 1.18rem;
`;

const Start = () => (
  <DashboardWrapper>
    <Heading>Choose Your Option</Heading>
    <Subheading>Start by choosing the section you want to explore. Manage patients, sales, analytics, and more — all from one app.</Subheading>
    <InfoBar><FaInfoCircle size={26}/>📌 Remember to save your progress frequently!</InfoBar>
    <CardGrid>
      <Card to="/doctor_use/FindAdmission">
        <IconWrapper><FaUserDoctor className="icon" /></IconWrapper>
        <CardTitle>Doctor&apos;s Use</CardTitle>
        <CardDesc>Access patient admissions, test reports, and medical management tools.</CardDesc>
      </Card>
      <Card to="/retail_use/RetailorsSheet">
        <IconWrapper><TbBrandShopee className="icon" /></IconWrapper>
        <CardTitle>Retailer&apos;s Use</CardTitle>
        <CardDesc>Manage inventory, sales, billing, and customer relations all from here.</CardDesc>
      </Card>
      <Card to="/analytics/overview">
        <IconWrapper><FaChartBar className="icon" /></IconWrapper>
        <CardTitle>Analytics & Reports</CardTitle>
        <CardDesc>View detailed stats, charts, and performance insights.</CardDesc>
      </Card>
      <Card to="/settings/configure">
        <IconWrapper><FaCog className="icon" /></IconWrapper>
        <CardTitle>App Settings</CardTitle>
        <CardDesc>Customize your preferences, users, permissions, and more.</CardDesc>
      </Card>
      <Card to="/user/profile">
        <IconWrapper><FaUsers className="icon" /></IconWrapper>
        <CardTitle>User Management</CardTitle>
        <CardDesc>Manage user roles, access control, and account information.</CardDesc>
      </Card>
      <Card to="/about">
        <IconWrapper><FaInfo className="icon" /></IconWrapper>
        <CardTitle>About Us</CardTitle>
        <CardDesc>Learn more about our team, mission, and commitment to delivering quality healthcare solutions.</CardDesc>
      </Card>
    </CardGrid>
  </DashboardWrapper>
);

export default Start;
