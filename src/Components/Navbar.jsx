import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaBars,
  FaTimes,
  FaFlask,
  FaUserMd,
  FaBookMedical,
  FaCogs,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaHome,
} from "react-icons/fa";
import { doSignOut } from "../config/auth";
import BackButton from "./BackButton";

const Navbar = ({ destination }) => {
  const navigate = useNavigate();
  const navRef = useRef();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (idx) => {
    setOpenDropdown(openDropdown === idx ? null : idx);
  };

  const menus = [
    { icon: <FaHome />, title: "Dashboard", path: "/" },
    {
      icon: <FaFlask />,
      title: "Test",
      dropdown: [
        { text: "Admission", path: "/doctor_use/FindAdmission" },
        { text: "Report", path: "/doctor_use/FindReport" },
        { text: "Master", path: "/doctor_use/TestMaster" },
      ],
    },
    {
      icon: <FaUserMd />,
      title: "Account",
      dropdown: [
        { text: "Account Master", path: "/doctor_use/AccountMaster" },
        { text: "Daily Cash", path: "/doctor_use/DailyCash" },
      ],
    },
    {
      icon: <FaBookMedical />,
      title: "Patients",
      dropdown: [
        { text: "Patient List", path: "/doctor_use/PatientList" },
        { text: "History", path: "/doctor_use/PatientHistory" },
      ],
    },
    {
      icon: <FaCogs />,
      title: "Settings",
      dropdown: [
        { text: "Configure", path: "/doctor_use/Configure" },
        { text: "Security", path: "/doctor_use/Security" },
      ],
    },
    { icon: <FaUser />, title: "About", path: "/About" },
  ];

  return (
    <NavWrapper ref={navRef} isOpen={mobileMenuOpen}>
      <nav className="nav-fixed">
        <div className="nav-content">
          <div className="brand-and-back">
            <div className="brand">
              <span className="brand-icon">&#128137;</span>
              <span className="brand-text">MediCareXpert</span>
            </div>
          </div>

          <div
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </div>

          <ul className={`nav-menu ${mobileMenuOpen ? "open" : ""}`}>
            {menus.map((menu, idx) => (
              <li
                className="nav-parent"
                key={menu.title}
                onMouseEnter={() => !mobileMenuOpen && setOpenDropdown(idx)}
                onMouseLeave={() => !mobileMenuOpen && setOpenDropdown(null)}
              >
                {menu.dropdown ? (
                  <>
                    <div
                      className="nav-link"
                      onClick={() => toggleDropdown(idx)}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === idx}
                    >
                      <span className="nav-icon">{menu.icon}</span>
                      <span>{menu.title}</span>
                      <FaChevronDown size={13} style={{ marginLeft: 6 }} />
                    </div>
                    {(openDropdown === idx || mobileMenuOpen) && (
                      <ul
                        className="dropdown"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {menu.dropdown.map((item) => (
                          <li key={item.text}>
                            <Link to={item.path} className="dropdown-link">
                              {item.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={menu.path}
                    className="nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">{menu.icon}</span>
                    <span>{menu.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <button
            className="logout-btn"
            onClick={() => {
              doSignOut().then(() => navigate("/login"));
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>
    </NavWrapper>
  );
};

const NavWrapper = styled.nav`
  .nav-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 58px;
    background: linear-gradient(135deg, #a6cef9 0%, #e5f3ff 100%);
    border-bottom: 2px solid #91b7db;
    box-shadow: 0 2px 12px #a0c0f060;
    z-index: 1000;
  }
  .nav-content {
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2vw;
    transition: padding 0.4s;
  }
  .brand-and-back {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .brand-icon {
    font-size: 22px;
    color: #3978d7;
  }
  .brand-text {
    font-weight: 700;
    font-size: 1.08rem;
    color: #2359a7;
    font-family: "Montserrat", sans-serif;
    letter-spacing: 1px;
  }
  .mobile-menu-toggle {
    display: none;
    cursor: pointer;
    color: #3978d7;
    margin-left: 15px;
  }
  .nav-menu {
    display: flex;
    gap: 14px;
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;
    justify-content: center;
    align-items: center;
    transition: max-height 0.4s ease;
  }
  .nav-menu.open {
    max-height: 350px;
  }
  .nav-parent {
    position: relative;
    font-weight: 600;
    font-size: 16px;
    margin: 0 6px;
  }
  .nav-link {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #2359a7;
    padding: 8px 11px;
    border-radius: 7px;
    text-decoration: none;
    font-size: 1.02rem;
    cursor: pointer;
    font-family: "Montserrat", sans-serif;
  }
  .nav-link:hover,
  .nav-parent:hover > .nav-link {
    background: #4b87e3a2;
    color: #0f244c;
  }
  .nav-icon {
    font-size: 1.08rem;
  }
  .dropdown {
    position: absolute;
    left: 0;
    top: 100%;
    background: #fff;
    min-width: 140px;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 5px 18px #aac8f579;
    padding: 1px 0;
    z-index: 1100;
  }
  .dropdown-link {
    display: block;
    color: #1a334d;
    padding: 9px 8px;
    text-decoration: none;
    font-size: 0.97rem;
    border-radius: 4px;
  }
  .dropdown-link:hover {
    background: #dbe9ff;
    color: #3978d7;
    font-weight: 600;
  }
  .logout-btn {
    background: linear-gradient(90deg, #3b82f6 0%, #22d3ee 100%);
    color: #fff;
    border: 0;
    padding: 7px 18px;
    font-weight: 700;
    font-size: 1rem;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 2px 12px #32cbfc99;
    transition: background 0.3s;
  }
  .logout-btn:hover {
    background: #e5f3ff;
    color: #2359a7;
  }

  @media (max-width: 1270px) {
    .nav-content {
      padding: 0 10px;
    }
    .nav-menu {
      gap: 0px;
    }
    .nav-link {
      font-size: 0.8rem;
    }
    .brand-text {
      font-size: 0.9rem;
    }
    .logout-btn {
      padding: 6px 10px;
      font-size: 0.92rem;
    }
  }

  @media (max-width: 995px) {
    .nav-content {
      padding: 0 10px;
    }
    .nav-menu {
      gap: 0px;
      max-width: 100vw;
    }
    .nav-link {
      font-size: 0.6rem;
      gap: 0px;
      padding: 8px 5px;
    }
    .dropdown {
      min-width: 90px;
    }
    .dropdown-link {
      font-size: 0.6rem;
    }
    .brand-text {
      font-size: 1rem;
    }
  }
  @media (max-width: 820px) {
    .nav-content {
      padding: 0 2px;
    }
    .brand-text {
      font-size: 0.7rem;
    }
    .nav-menu {
      max-width: 100vw;
    }
    .dropdown-link {
      font-size: 0.5rem;
    }
    .nav-link {
      font-size: 0.5rem;
      gap: 0px;
      padding: 3px 0px;
    }
    .dropdown {
      min-width: 70px;
    }
    .logout-btn {
      padding: 6px 10px;
      font-size: 0.92rem;
    }
  }
  @media (max-width: 700px) {
    .nav-fixed {
      height: 57px;
    }
    .nav-content {
      padding: 0 4px;
    }
    .brand-text {
      font-size: 0.89rem;
    }
    .nav-menu {
      position: fixed;
      flex-direction: column;
      top: 57px;
      left: 0;
      width: 100vw;
      max-height: 0;
      overflow: hidden;
      background: #dbe9ffcc;
      border-bottom: 1px solid #aaccec;
      transition: max-height 0.4s ease;
    }
    .nav-menu.open {
      max-height: 300px;
      overflow-y: auto;
      z-index: 2000;
    }
    .nav-parent {
      margin: 0;
      width: 100vw;
    }
    .nav-link {
      font-size: 1rem;
      padding: 12px 20px;
    }
    .dropdown {
      position: relative;
      top: 0;
      min-width: 100vw;
      border-radius: 0;
      box-shadow: none;
      background: #bbe1ff;
      padding: 6px 0;
    }
    .dropdown-link {
      padding: 13px 17vw;
      font-size: 1rem;
    }
    .mobile-menu-toggle {
      display: block;
      cursor: pointer;
      color: #2359a7;
      margin-left: 12px;
    }
    .logout-btn {
      padding: 9px 14px;
      margin-left: 4px;
    }
  }
`;

export default Navbar;
