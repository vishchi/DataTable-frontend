import React, { useEffect, useState } from 'react';
import { ChakraProvider, Input, Box } from "@chakra-ui/react";
import DataTable from './DataTable';
import { DataType, HeaderType } from '../types/DataTableTypes';

const App: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://datatable-backend.onrender.com/purchases');
      const data: DataType[] = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  const headers: HeaderType[] = [
    { field: 'timestamp', label: 'Timestamp', sortable: true },
    { field: 'id', label: 'Purchase ID', sortable: true },
    { field: 'mail', label: 'Mail', sortable: true },
    { field: 'name', label: 'Name', sortable: true },
    { field: 'source', label: 'Source', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
    { field: 'select', label: 'Select', sortable: false },
  ];

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ChakraProvider>
      <Box w={['100%', '80%', '60%', '40%']} mt={4} mx='auto' p={5} shadow='md' borderWidth={1}>
        <Input 
          placeholder="Search by name" 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          size="md"
          mb={2}
          focusBorderColor="green.500"
        />
      </Box>
      <DataTable
        sortable
        caption="Bookings"
        headers={headers}
        rows={filteredData}
      />
    </ChakraProvider>
  );
};

export default App;
