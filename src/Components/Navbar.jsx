import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  FaFlask, FaUserMd, FaBookMedical, FaCogs, FaUser, FaSignOutAlt, FaChevronDown, FaHome, FaTimes, FaBars
} from "react-icons/fa";
import { doSignOut } from "../config/auth";
import { useSidebar } from "../Context/SidebarContext";
import { FaHospitalUser } from "react-icons/fa6";
import ThemeToggle from "./ThemeToggle";

const menus = [
  { icon: <FaHome />, title: "Dashboard", path: "/" },
  {
    icon: <FaHospitalUser />,
    title: "PATIENT ENTRY",
    dropdown: [
      { text: "Admission", path: "/doctor_use/FindAdmission" },
      { text: "Report", path: "/doctor_use/FindReport" },
    ],
  },
  {
    icon: <FaFlask />,
    title: "TEST",
    dropdown: [
      { text: "Test Categories", path: "/doctor_use/TestCategories" },
      { text: "SubTest Categories", path: "/doctor_use/SubTestCategories" },
      { text: "Test Data", path: "/doctor_use/TestMaster" },
    ],
  },
  {
    icon: <FaUserMd />,
    title: "ACCOUNT",
    dropdown: [
      { text: "Daily Cash", path: "/doctor_use/DailyCashReport" },
      { text: "Monthly Cash", path: "/doctor_use/MonthlyCashReport" },
      { text: "Cash Report", path: "/doctor_use/CashReport" },
    ],
  },
  {
    icon: <FaBookMedical />,
    title: "PATIENTS",
    dropdown: [
      { text: "Cases Reported", path: "/doctor_use/CaseReport" },
      { text: "Total Cases Reported", path: "/doctor_use/TotalCasesReported" },
    ],
  },
  {
    icon: <FaCogs />,
    title: "SETTINGS",
    dropdown: [
      { text: "Configure", path: "/doctor_use/Configure" },
      { text: "Security", path: "/doctor_use/Security" },
    ],
  },
  { icon: <FaUser />, title: "ABOUT", path: "/About" },
];

const Sidebar = () => {
  const { sidebarExpanded, setSidebarExpanded } = useSidebar();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const navigate = useNavigate();
  const location = useLocation();

  // Listen window resize to update isMobile
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 700;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleDropdown = (idx) => setOpenDropdown(openDropdown === idx ? null : idx);

  const handleLogout = () => {
    doSignOut().then(() => navigate("/login"));
  };

  // --- Desktop Sidebar ---
  if (!isMobile) {
    return (
      <>
        <SideNav $expanded={sidebarExpanded}>
          <div className="sidebar-brand">
            {sidebarExpanded && <span className="brand">MediCareXpert</span>}
            <span
              className="sidebar-toggle"
              onClick={() => setSidebarExpanded(e => !e)}
              title={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {sidebarExpanded ? <FaTimes size={16} /> : <FaBars size={16} />}
            </span>
          </div>
          <ul className="sidebar-nav">
            {menus.map((menu, idx) => (
              <li key={menu.title} className={location.pathname === menu.path ? "active" : ""}>
                {menu.dropdown ? (
                  <>
                    <span
                      className="sidebar-link"
                      onClick={() => toggleDropdown(idx)}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === idx}
                    >
                      {menu.icon}
                      {sidebarExpanded && <span>{menu.title}</span>}
                      {sidebarExpanded && <FaChevronDown className="chevron" size={10} />}
                    </span>
                    {(openDropdown === idx && sidebarExpanded) && (
                      <ul className="sidebar-dropdown">
                        {menu.dropdown.map(item => (
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
                    className={`sidebar-link${location.pathname === menu.path ? " active" : ""}`}
                    to={menu.path}
                    aria-current={location.pathname === menu.path ? "page" : undefined}
                  >
                    {menu.icon}
                    {sidebarExpanded && <span>{menu.title}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <button className="sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt /> {sidebarExpanded && <span>Logout</span>}
          </button>
        </SideNav>
        {!sidebarExpanded && <SideNavPlaceholder />}
      </>
    );
  }

  // --- Mobile Top Nav ---
  return (
    <>
      <MobileNavBar>
        <span className="brand">MediCareXpert</span>
        <button
          aria-label="Toggle menu"
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(open => !open)}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </MobileNavBar>
      {mobileMenuOpen && (
        <MobileDropdown>
          <ul>
            {menus.map(menu => (
              <li key={menu.title}>
                {menu.dropdown ? (
                  <>
                    <span className="mobile-dropdown-title">{menu.title}</span>
                    <ul>
                      {menu.dropdown.map(item => (
                        <li key={item.text}>
                          <Link
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link to={menu.path} onClick={() => setMobileMenuOpen(false)}>
                    {menu.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <button className="mobile-logout" onClick={handleLogout}>Logout</button>
        </MobileDropdown>
      )}
    </>
  );
};

const SideNav = styled.aside`
  font-family: 'Inter', 'Montserrat', sans-serif;
  position: fixed;
  left: 0; top: 0; bottom: 0;
  width: ${({ $expanded }) => ($expanded ? '200px' : '56px')};
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#ffffff 40%"};
  border-right: 1px solid #dbe3f1;
  padding-bottom: 1rem;
  z-index: 1002;
  min-height: 100vh;
  box-shadow: 1px 2px 12px #dce7f133;
  transition: width 0.25s ease;
  display: flex;
  flex-direction: column;

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 22px 16px 22px;
    border-bottom: 1px solid #e2eaf6;
    height: 62px;
  }

  .brand {
    font-size: 1rem;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#37517e"};
    font-weight: 500;
    white-space: nowrap;
    opacity: ${({ $expanded }) => ($expanded ? 1 : 0)};
    transition: opacity 0.15s ease;
  }

  .sidebar-toggle {
    margin-left: auto;
    color: ${({ theme }) => (theme.isDark) ? theme.texts : "#8492b2"};
    cursor: pointer;
    padding: 0px 0px;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #3d5481;
    }
  }

  .sidebar-toggle svg {
    display: block;
  }

  .sidebar-nav {
    flex: 1 1 auto;
    margin: 0;
    padding:  ${({ $expanded }) => ($expanded ? "10px" : "8px")};
    list-style: none;
    font-size: 0.9rem;
  }

  .sidebar-nav li {
    margin-bottom: 0.25rem;
    position: relative;
  }

  .sidebar-nav li:last-child {
    margin-bottom: 0;
  }

  .sidebar-nav li.active > .sidebar-link {
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#d2e2fc"};
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#2a57b5"};
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 10px 10px;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#4a5a7a"};
    text-decoration: none;
    border-radius: 5px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .sidebar-link:hover {
    background: ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#f0f4ff"};
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#2a57b5"};
  }

  .chevron {
    margin-left: auto;
    color: #8193b2;
  }

  .sidebar-nav .sidebar-link svg {
    min-width: 20px;
    min-height: 10px;
    color: inherit;
  }

  .sidebar-nav .sidebar-link span {
    pointer-events: none;
  }

  .sidebar-dropdown {
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};
    border-radius: 0 0 10px 0px;
    margin-top: 0.25rem;
    padding: 6px 0 6px 30px;
    font-size: 0.85rem;
    box-shadow: 0 3px 7px #c6d3f791;
  }

  .dropdown-link {
    display: block;
    padding: 8px 12px;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#37517e"};
    text-decoration: none;
    border-radius: 5px;
    font-weight: 500;
    transition: background 0.2s ease;

    &:hover {
      background: ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#e6f0ff"};
      color: ${({ theme }) => (theme.isDark) ? theme.text : "#2a57b5"};
    }
  }

  .sidebar-dropdown li {
    margin-bottom: 0.15rem;
  }

  .sidebar-dropdown li:last-child {
    margin-bottom: 0;
  }

  .sidebar-logout {
    margin: 1.5rem 1rem 1rem 1rem;
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 10px;
    background: linear-gradient(90deg, #4895ef, #226dce);
    color: #f0f5ff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.25s ease;

    &:hover {
      background: #365ea7;
      color: #dbe5ff;
    }
  }

  @media (max-width: 700px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 170px;
    transform: ${({ $mobileopen }) => ($mobileopen ? "translateX(0)" : "translateX(-180px)")};
    transition: transform 0.3s ease;
    z-index: 2000;

    .sidebar-toggle {
      display: none;
    }

    .sidebar-nav .sidebar-link span {
      display: inline-block;
    }

    .sidebar-logout {
      margin: 1.5rem 0.5rem;
    }
  }
`;

const SideNavPlaceholder = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 56px;
  height: 100vh;
  background: transparent;
  pointer-events: none;
`;


const Backdrop = styled.div`
  position: fixed; z-index:1019; top:0; left:0; right:0; bottom:0;
  background: rgba(30,60,100,0.14);
  backdrop-filter: blur(1.5px);
`;

const MobileNavBar = styled.nav`
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 40px;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f6fafe 38%"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  box-shadow: 0 2px 10px #a0c0f0bb;
  z-index: 1010;

  .brand {
    font-weight: 700;
    font-size: 1.2rem;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#2b4973"};
  }

  .mobile-menu-button {
    background: transparent;
    border: none;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#3978d7"};
    cursor: pointer;
    font-size: 0rem;
  }
`;

const MobileDropdown = styled.div`
  position: fixed;
  top: 40px; /* below mobile nav */
  left: 0;
  right: 0;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "white"};
  border-top: 1.5px solid #dde9f6;
  box-shadow: 0 3px 15px #aac8f577;
  z-index: 1005;
  max-height: calc(100vh - 40px);
  overflow-y: auto;

  ul {
    list-style: none;
    margin: 0; padding: 0.5rem 1.5rem;

    li {
      margin-bottom: 1rem;

      .mobile-dropdown-title {
        font-weight: 700;
        font-size: 1rem;
        color: #235a8a;
        cursor: default;
        margin-bottom: 0.4rem;
      }

      ul {
        padding-left: 1rem;

        li {
          margin-bottom: 0.3rem;
          a {
            color: #2c4a7f;
            text-decoration: none;
            font-size: 0.95rem;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }

      > a {
        color: #1f3e6a;
        font-weight: 600;
        font-size: 1rem;
        text-decoration: none;
        display: inline-block;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .mobile-logout {
    width: 100%;
    padding: 8px 0;
    background: linear-gradient(90deg, #3b82f6 0%, #22d3ee 100%);
    border: none;
    color: white;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
  }
`;

export default Sidebar;

