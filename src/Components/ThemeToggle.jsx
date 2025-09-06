import React from "react";
import styled from "styled-components";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../Context/themeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme}>
      {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
      <span>{isDark ? "Light" : "Dark"} Mode</span>
    </ToggleButton>
  );
};

const ToggleButton = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border-radius: 999px;
  padding: 6px 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 6px 18px ${({ theme }) => theme.shadow};
  font-weight: 600;
  font-size: 0.9em;

  &:hover {
    background: ${({ theme }) => theme.brandSoft};
    border-color: ${({ theme }) => theme.brand};
  }
`;

export default ThemeToggle;
