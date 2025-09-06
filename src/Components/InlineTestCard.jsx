import React from "react";
import styled from "styled-components";

const InlineTestCard = ({ testData }) => {
  return (
    <CardContainer>
      <TestRowHeader>
        <span className="test-name">{testData.TestName}</span>
        {testData.method && (
          <span className="test-method">Method: {testData.method}</span>
        )}
      </TestRowHeader>
      <TestsTable>
        <thead>
          <tr>
            <th>TEST</th>
            <th>VALUE</th>
            <th>UNIT</th>
            <th>REFERENCE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span className="edit-icon">🖉</span>
              {testData.TestName}
            </td>
            <td>
              <InputCell
                type="text"
                name={`Value_${testData.TestName}`}
                placeholder="Enter value"
                defaultValue={testData.value || ""}
              />
              <AddBtn>+</AddBtn>
            </td>
            <td>
              <InputCell
                type="text"
                name={`Unit_${testData.TestName}`}
                placeholder="Unit"
                defaultValue={testData.unit || ""}
              />
            </td>
            <td>
              <span>{testData.reference || "-"}</span>
              <span className="edit-icon">🖉</span>
            </td>
          </tr>
        </tbody>
      </TestsTable>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  margin: 40px auto 30px auto;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};
  border: 1.5px solid #e1e7f4;
  border-radius: 9px;
  box-shadow: 0 2px 18px #e0e7f144;
  padding: 28px 24px 20px 24px;
  // max-width: 790px;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#222"};
`;

const TestRowHeader = styled.div`
  font-weight: 700;
  font-size: 1.13em;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#204388"};
  background: ${({ theme }) => (theme.isDark) ? theme.card : "#f3f7fa"};
  padding: 0.7rem 1.2rem 0.7rem 1.2rem;
  border-radius: 6px;
  margin-bottom: 19px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  .test-name {
    font-size: 1.08em;
    font-weight: 700;
  }
  .test-method {
    color: #5d6d9c;
    font-size: 0.97em;
    margin-left: 12px;
    font-style: italic;
    font-weight: 500;
  }
`;

const TestsTable = styled.table`
  width: 100%;
  background: ${({ theme }) => (theme.isDark) ? theme.card : "#fff"};
  border-collapse: collapse;
  font-size: 15px;
  box-shadow: none;
  th, td {
    border: 1px solid #e1e7f4;
    text-align: left;
    padding: 10px 12px;
  }
  th {
    background: ${({ theme }) => (theme.isDark) ? theme.card : "#f3f7fa"};
    font-weight: 700;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#334996"};
    font-size: 1em;
    border-bottom: 2px solid #e1e7f4;
  }
  td {
    font-size: 1.08em;
    vertical-align: middle;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#203050"};
  }
  .edit-icon {
    font-size: 1.04em;
    margin-right: 7px;
    vertical-align: -1px;
    cursor: pointer;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#3561c9"};
  }
`;

const InputCell = styled.input`
  width: 75px;
  font-weight: 600;
  color: #1748a5;
  border: 1.2px solid #e5e7eb;
  border-radius: 3px;
  background: #fff;
  padding: 2px 7px;
  margin-right: 10px;
  font-size: 1em;
  &:focus {
    outline: 2px solid #2575f6;
    background: #f8fcff;
  }
`;

const AddBtn = styled.button`
  background: #e5f0fc;
  color: #2575f6;
  border: none;
  border-radius: 55%;
  width: 26px;
  height: 26px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.13em;
  margin-left: 2px;
  display: inline-block;
  &:hover {
    background: #b6d4fc;
  }
`;

export default InlineTestCard;
