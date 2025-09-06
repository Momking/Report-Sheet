import React, { useState } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { RiEdit2Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { FiSun, FiMoon, FiChevronRight } from "react-icons/fi";
import AppTopNav from "../../../Components/TopNavbar";
import Navbar from "../../../Components/Navbar";
import { useSidebar } from "../../../Context/SidebarContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../../Components/ThemeToggle";

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    transition: all 0.3s ease;
  }
`;

const mockCategories = [
  "Biochemistry",
  "Haematology",
  "Serology & Immunology",
  "Clinical Pathology",
  "Cytology",
  "Microbiology",
  "Endocrinology",
  "Histopathology",
  "Others",
  "Miscellaneous"
];

const TestCategories = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const { sidebarExpanded } = useSidebar();
  const navigate = useNavigate();

  const filtered = mockCategories.filter(
    cat => cat.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      <GlobalStyle />
      <Page>
        <AppTopNav sidebarExpanded={sidebarExpanded}/>
        <Navbar />
        <Container $sidebarExpanded={sidebarExpanded}>
          <StickyBar>
            <BreadCrumb>
              <span className="muted">Test Panels</span>
              <FiChevronRight />
              <span className="muted">Test Categories</span>
            </BreadCrumb>
          </StickyBar>

          <HeaderRow>
            <Title>Test categories</Title>
            <AddBtn>+ Add new category</AddBtn>
          </HeaderRow>

          <Card>
            <ActionsRow>
              <ActionLabel>
                All Categories
                <Count>{filtered.length}</Count>
              </ActionLabel>
              <SearchBox>
                <SearchInput
                  type="text"
                  value={search}
                  placeholder="Search category..."
                  onChange={e => setSearch(e.target.value)}
                />
              </SearchBox>
            </ActionsRow>
            
            <Table>
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>#</th>
                  <th>Category Name</th>
                  <th style={{ width: "140px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((cat, idx) => (
                  <tr
                    key={cat}
                    style={{
                      background: selected === cat ? "#e6efff" : "inherit"
                    }}
                    onClick={() => setSelected(cat)}
                  >
                    <td style={{ textAlign: "center", color: "#8ba2c9" }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: "inherit", fontSize: ".97em" }}>
                      {cat}
                    </td>
                    <td>
                      <EditBtn>
                          <RiEdit2Line size={15} /> Edit
                      </EditBtn>

                      <ViewBtn>
                        <AiOutlineEye size={15} /> View
                      </ViewBtn>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} style={{textAlign:"center",color: "#8b9bbd", fontSize: "0.98em", padding: 20}}>
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Container>
      </Page>
    </div>
  );
};

// Styled components (reuse your existing ones, but use theme values where needed)

const Page = styled.div`
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
`;

const StickyBar = styled.div`
  position: sticky;
  top: 58px;
  z-index: 50;
  background: ${({ theme }) => theme.bg};
  padding: 8px 2px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BreadCrumb = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 0.92em;

  .muted {
    color: ${({ theme }) => theme.textSoft};
    font-weight: 500;
  }

  svg {
    color: ${({ theme }) => theme.textSoft};
    font-size: 1.1em;
  }
`;

const ModeToggle = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border-radius: 999px;
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 6px 18px ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.brandSoft};
    border-color: ${({ theme }) => theme.brand};
  }
`;

const Container = styled.div`
//   max-width: 700px;
  margin: 0 auto;
  padding: 46px 0 38px 0;

  flex: 1;
  min-width: 0;
  padding: 88px 316px 20px ${({ $sidebarExpanded }) => ($sidebarExpanded ? "225px" : "76px")};
  transition: padding-left 0.18s cubic-bezier(.61,-0.01,.51,.99);

  @media (max-width: 1100px) {
    padding-right: 0px;
    padding-left: ${({ $sidebarExpanded }) => ($sidebarExpanded ? "80px" : "41px")};
  }

  @media (max-width: 700px) {
    padding-left: 2vw;
  }
`;


const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #295986;
  margin-bottom: 2px;
`;

const AddBtn = styled.button`
  font-size: 0.96em;
  font-weight: 700;
  background: ${({ theme }) => theme.card};
  border-radius: 7px;
  color: ${({ theme }) => theme.text};;
  border: none;
  padding: 6px 18px;
  cursor: pointer;
  box-shadow: 0 2px 6px #c6dafe22;
  &:hover { background: #235bb9; }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card}; #fff;
  border-radius: 15px;
  box-shadow: 0 2px 14px #d8e2f233;
  margin-top: 10px;
  padding: 17px 0 0 0;
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 28px 13px 26px;
  flex-wrap: wrap;
`;

const ActionLabel = styled.div`
  font-size: 0.98em;
  color: #284580;
  font-weight: 700;
`;

const Count = styled.span`
  margin-left: 8px;
  font-size: .98em;
  font-weight: 600;
  color: #0d68a8;
  background: #e0ecf7;
  padding: 2px 10px;
  border-radius: 12px;
`;

const SearchBox = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 9px;
  border: 1.3px solid #e1e5f2;
  padding: 3px 11px;
  min-width: 170px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: .96em;
  color: #4761a6;
  min-width: 90px;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 0;
  border-collapse: separate;
  border-spacing: 0 4px;
  font-size: 13px;
  thead th {
    background: ${({ theme }) => theme.card};
    text-align: left;
    font-size: 0.96em;
    color: ${({ theme }) => theme.text};
    font-weight: 700;
    padding: 8px 0 6px 0;
    border-bottom: 1.3px solid #e5eaf5;
  }
  tbody tr {
    background: #f7fafd;
    border-radius: 7px;
    transition: background 0.16s;
    box-shadow: 0 0.5px 1px #c7e4ff11;
    cursor: pointer;
  }
  tbody tr:hover {
    background: #eaf2ff;
  }
  tbody td {
    font-size: 0.95em;
    color: #35508c;
    border: none;
    padding: 8px 6px;
  }
`;

const EditBtn = styled.button`
  color: #3265e4;
  background: transparent;
  border: none;
  font-weight: 600;
  font-size: 0.96em;
  margin-right: 7px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1px;
  padding: 4px 4px;
  &:hover { color: #123d9c; background: #eaf1ff;}
`;
const ViewBtn = styled.button`
  color: #1ea19c;
  background: transparent;
  border: none;
  font-size: 0.96em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1px;
  padding: 4px 6px;
  &:hover { color: #168083; background: #e2f7fa;}
`;

export default TestCategories;
