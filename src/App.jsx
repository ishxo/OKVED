import React, { useState, useEffect } from "react";
import styled from "styled-components";
import data from "../data.json";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
`;

const CodeList = styled.ul`
  padding-left: 20px;
`;

const CodeItem = styled.li`
  margin-bottom: 10px;
`;

const CodeTitle = styled.strong`
  cursor: pointer;
  &:hover {
    color: #ff494e;
  }
`;

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCodes, setExpandedCodes] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterOKVEDCodes = (data, query) => {
    return data.filter((item) => {
      const titleMatches = item.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const childrenMatches =
        item.children && filterOKVEDCodes(item.children, query).length > 0;
      return titleMatches || childrenMatches;
    });
  };

  const filteredData = filterOKVEDCodes(data, searchQuery);

  const handleToggleCode = (code) => {
    setExpandedCodes((prevExpandedCodes) => {
      if (prevExpandedCodes.includes(code)) {
        return prevExpandedCodes.filter((c) => c !== code);
      } else {
        return [...prevExpandedCodes, code];
      }
    });
  };

  useEffect(() => {
    const savedExpandedCodes = JSON.parse(
      localStorage.getItem("expandedCodes")
    );
    if (savedExpandedCodes) {
      setExpandedCodes(savedExpandedCodes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expandedCodes", JSON.stringify(expandedCodes));
  }, [expandedCodes]);

  return (
    <Container>
      <Input
        type="text"
        placeholder="Search OKVED codes..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <CodeList>
        {filteredData.map((item) => (
          <CodeItem key={item.title}>
            <CodeTitle onClick={() => handleToggleCode(item.title)}>
              {item.title}
            </CodeTitle>
            {expandedCodes.includes(item.title) && (
              <CodeList>
                {item.children.map((child) => (
                  <CodeItem key={child.title}>
                    {child.code} - {child.title}
                  </CodeItem>
                ))}
              </CodeList>
            )}
          </CodeItem>
        ))}
      </CodeList>
    </Container>
  );
};

export default App;
