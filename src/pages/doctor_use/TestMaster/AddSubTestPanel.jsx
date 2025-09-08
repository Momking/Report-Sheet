import React, { useState } from "react";
import styled from "styled-components";
import AppTopNav from "../../../Components/TopNavbar";
import Navbar from "../../../Components/Navbar";
import { useSidebar } from "../../../Context/SidebarContext";
import { FiChevronRight } from "react-icons/fi";

const AddSubTestPanel = () => {
  const { sidebarExpanded } = useSidebar();
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    category: "",
    unit: "",
    inputType: "",
    defaultResult: "",
    method: "",
    instrument: "",
    optional: false,
    interpretation: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Test Data:", formData);
    // API or Firebase logic goes here
  };

  return (
    <div>
      <AppTopNav sidebarExpanded={sidebarExpanded}/>
      <Navbar />
      <PageContainer $sidebarExpanded={sidebarExpanded}>
        <StickyBar>
          <BreadCrumb>
            <span className="muted">Test Panels</span>
            <FiChevronRight />
            <span className="active">Test Categories</span>
          </BreadCrumb>
        </StickyBar>
        <PageTitle>Add New Test</PageTitle>
        <Card>
          <Form onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter Test Name"
              />
            </div>

            {/* Short Name */}
            <div>
              <Label>Short Name</Label>
              <Input
                type="text"
                value={formData.shortName}
                onChange={(e) => handleChange("shortName", e.target.value)}
                placeholder="Enter Short Name"
              />
            </div>

            {/* Category */}
            <div>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Hematology">Hematology</option>
                <option value="Microbiology">Microbiology</option>
              </Select>
            </div>

            {/* Unit */}
            <div>
              <Label>Unit</Label>
              <Input
                type="text"
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
                placeholder="e.g. mg/dl"
              />
            </div>

            {/* Input Type */}
            <div>
              <Label>Input Type</Label>
              <Select
                value={formData.inputType}
                onChange={(e) => handleChange("inputType", e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="Numeric">Numeric</option>
                <option value="Text">Text</option>
                <option value="Boolean">Boolean</option>
              </Select>
            </div>

            {/* Default Result */}
            <div>
              <Label>Default Result</Label>
              <Input
                type="text"
                value={formData.defaultResult}
                onChange={(e) => handleChange("defaultResult", e.target.value)}
                placeholder="Enter Default Result"
              />
            </div>

            {/* Optional Checkbox */}
            <CheckboxContainer>
              <input
                type="checkbox"
                checked={formData.optional}
                onChange={(e) => handleChange("optional", e.target.checked)}
              />
              <Label>Optional</Label>
            </CheckboxContainer>

            {/* Method */}
            <div>
              <Label>Method</Label>
              <Input
                type="text"
                value={formData.method}
                onChange={(e) => handleChange("method", e.target.value)}
                placeholder="Enter Method"
              />
            </div>

            {/* Instrument */}
            <div>
              <Label>Instrument</Label>
              <Input
                type="text"
                value={formData.instrument}
                onChange={(e) => handleChange("instrument", e.target.value)}
                placeholder="Enter Instrument"
              />
            </div>

            {/* Interpretation */}
            <div style={{ gridColumn: "span 2" }}>
              <Label>Interpretation</Label>
              <TextArea
                rows="4"
                value={formData.interpretation}
                onChange={(e) => handleChange("interpretation", e.target.value)}
                placeholder="Enter Interpretation"
              />
            </div>

            {/* Submit Button */}
            <SubmitButton type="submit">Save Test</SubmitButton>
          </Form>
        </Card>
      </PageContainer>
    </div>
  );
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => (theme.isDark ? theme.bg : "#f6f9fc")};
  color: ${({ theme }) => (theme.isDark ? theme.text : "#000")};

  flex: 1;
  min-width: 0;
  padding: 88px 316px 20px ${({ $sidebarExpanded }) => ($sidebarExpanded ? "225px" : "76px")};
  transition: padding-left 0.18s cubic-bezier(.61,-0.01,.51,.99);

  @media (max-width: 1100px) {
    padding-right: 0px;
    padding-left: ${({ $sidebarExpanded }) => ($sidebarExpanded ? "220px" : "70px")};
  }

  @media (max-width: 700px) {
    padding-left: 2vw;
  }
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

  .active {
    color: ${({ theme }) => theme.text};
    font-weight: 800;
  }

  svg {
    color: ${({ theme }) => theme.textSoft};
    font-size: 1.1em;
  }
`;

const PageTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => (theme.isDark ? "#1e1e1e" : "#fff")};
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => (theme.isDark ? "#444" : "#ccc")};
  border-radius: 6px;
  background: ${({ theme }) => (theme.isDark ? "#222" : "#fff")};
  color: ${({ theme }) => (theme.isDark ? "#fff" : "#000")};
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => (theme.isDark ? "#444" : "#ccc")};
  border-radius: 6px;
  background: ${({ theme }) => (theme.isDark ? "#222" : "#fff")};
  color: ${({ theme }) => (theme.isDark ? "#fff" : "#000")};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => (theme.isDark ? "#444" : "#ccc")};
  border-radius: 6px;
  background: ${({ theme }) => (theme.isDark ? "#222" : "#fff")};
  color: ${({ theme }) => (theme.isDark ? "#fff" : "#000")};
  resize: vertical;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubmitButton = styled.button`
  grid-column: span 2;
  padding: 12px;
  background: ${({ theme }) => (theme.isDark ? "#007bff" : "#0d6efd")};
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => (theme.isDark ? "#0056b3" : "#0056b3")};
  }
`;

export default AddSubTestPanel;