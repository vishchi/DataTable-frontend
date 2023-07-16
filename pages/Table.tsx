import React, { useState, useEffect } from 'react';
import { Box, Input, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"

interface DataType {
  id: number;
  timestamp: string;
  mail: string;
  name: string;
  source: string;
  status: string;
  select: boolean;
}

const TableComponent: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch('https://datatable-backend.onrender.com/purchases');
        const data: DataType[] = await response.json();
        setData(data);
      };
  
      fetchData();
    }, []);

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (a.name < b.name) return sortDirection === 'asc' ? -1 : 1;
    if (a.name > b.name) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleHeaderClick = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <Input 
        placeholder="Search by name" 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
      />
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>Timestamp</Th>
              <Th>Mail</Th>
              <Th onClick={handleHeaderClick} cursor="pointer">
                Name {sortDirection === 'asc' ? '↑' : '↓'}
              </Th>
              <Th>Source</Th>
              <Th>Status</Th>
              <Th>Select</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.map((item) => (
              <Tr key={item.id}>
                <Td>{new Date(item.timestamp).toLocaleString()}</Td>
                <Td>{item.mail}</Td>
                <Td>{item.name}</Td>
                <Td>{item.source}</Td>
                <Td>{item.status}</Td>
                <Td>{item.select.toString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </div>
  );
}

export default TableComponent;