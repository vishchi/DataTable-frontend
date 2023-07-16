import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Input, Table, Thead, Tbody, Tr, Th, Td, Button, Select, Flex } from "@chakra-ui/react";

interface DataType {
  id: number;
  timestamp: string;
  mail: string;
  name: string;
  source: string;
  status: string;
  select: boolean;
  [key: string]: any; // Add index signature
}

const TableComponent = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);

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
    let comparison = 0;
    if (a[sortField] < b[sortField]) {
      comparison = -1;
    } else if (a[sortField] > b[sortField]) {
      comparison = 1;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedData.length / dataPerPage);

  const handleHeaderClick = (field: string) => {
    setSortField(field);
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setCurrentPage(Number(e.currentTarget.textContent));
  };

  const nextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));

  const indexOfLastPost = currentPage * dataPerPage;
  const indexOfFirstPost = indexOfLastPost - dataPerPage;
  const currentPosts = sortedData.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <ChakraProvider>
      <Input 
        placeholder="Search by name" 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
        size="lg"
        mb={4}
        focusBorderColor="blue.500"
      />
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th onClick={() => handleHeaderClick('timestamp')} cursor="pointer">Timestamp</Th>
              <Th onClick={() => handleHeaderClick('id')} cursor="pointer">Purchase ID</Th>
              <Th onClick={() => handleHeaderClick('mail')} cursor="pointer">Mail</Th>
              <Th onClick={() => handleHeaderClick('name')} cursor="pointer">Name</Th>
              <Th onClick={() => handleHeaderClick('source')} cursor="pointer">Source</Th>
              <Th onClick={() => handleHeaderClick('status')} cursor="pointer">Status</Th>
              <Th>Select</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentPosts.map((item) => (
              <Tr key={item.id}>
                <Td>{new Date(item.timestamp).toLocaleString()}</Td>
                <Td>{item.id}</Td>
                <Td>{item.mail}</Td>
                <Td>{item.name}</Td>
                <Td>{item.source}</Td>
                <Td>{item.status}</Td>
                <Td>
                  <Select defaultValue={item.select.toString()}>
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </Select>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <tfoot>
            <Tr>
              <Td colSpan={7}>
                <Flex justifyContent="flex-end">
                  <Button onClick={prevPage} disabled={currentPage === 1}>Previous</Button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Button onClick={handleClick} key={index + 1}>{index + 1}</Button>
                  ))}
                  <Button onClick={nextPage} disabled={currentPage === totalPages}>Next</Button>
                </Flex>
              </Td>
            </Tr>
          </tfoot>
        </Table>
      </Box>
    </ChakraProvider>
  );
}

export default TableComponent;
