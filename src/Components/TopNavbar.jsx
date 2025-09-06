import React from "react";
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";      // search icon
import { FiHelpCircle } from "react-icons/fi"; // help icon
import { FiShoppingCart } from "react-icons/fi"; // buy icon
import ThemeToggle from "./ThemeToggle";

export default function AppTopNav({ sidebarExpanded }) {
  return (
    <TopNavbar sidebarExpanded={sidebarExpanded}>
      <SearchWrapper>
        <SearchIcon />
        <SearchInput placeholder="Search cases" aria-label="Search cases" />
      </SearchWrapper>
      <RightActions>
        <ThemeToggle/>
        <HelpIcon title="Help" />
        <BuyButton type="button" aria-label="Buy plan">
          <CartIcon />
          Buy now
        </BuyButton>
      </RightActions>
    </TopNavbar>
  );
}

const TopNavbar = styled.nav`
  position: fixed;
  top: 0;
  left: ${({ sidebarExpanded }) => (sidebarExpanded ? "200px" : "56px")};
  right: 0;
  height: 62px;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};
  border-bottom: 1px solid #e2e6f0;
  box-shadow: 0 2px 8px rgb(33 48 77 / 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 1100;
  transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 700px) {
    left: 0;
    display: None;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: 300px;
  width: 100%;
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#5a7abf"};
  font-size: 1.25rem;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  font-size: 0.95rem;
  border: 1.8px solid ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#d3daf6"};
  border-radius: 8px;
  background-color: ${({ theme }) => (theme.isDark) ? theme.bg : "#f7fbff"};
  color: #2a3f7d;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #436bcc;
    outline: none;
    background-color: ${({ theme }) => (theme.isDark) ? theme.bg : "#ecf2ff"};
  }

  &::placeholder {
    color: #a6b6df;
  }
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const HelpIcon = styled(FiHelpCircle)`
  color: #4380d9;
  font-size: 1.35rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #29569c;
  }
`;

const BuyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #3a8bfa 0%, #2eb2ff 100%);
  padding: 7px 18px;
  border-radius: 9px;
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 3px 8px rgb(58 139 250 / 0.6);
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #2b7ce3 0%, #2497ff 100%);
    box-shadow: 0 4px 12px rgb(37 114 247 / 0.75);
  }
`;

const CartIcon = styled(FiShoppingCart)`
  font-size: 1.2rem;
`;

