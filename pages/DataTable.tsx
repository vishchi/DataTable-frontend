import React, { useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Select, Flex, TableCaption } from "@chakra-ui/react";
import { DataTableProps } from './DataTableTypes';

const DataTable: React.FC<DataTableProps> = ({ sortable, caption, headers, rows }) => {
  const [sortField, setSortField] = useState(headers[0]?.field || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);

  const sortedData = [...rows].sort((a, b) => {
    if (!sortable || !sortField) {
      return 0;
    }

    let comparison = 0;
    if (a[sortField] < b[sortField]) {
      comparison = -1;
    } else if (a[sortField] > b[sortField]) {
      comparison = 1;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleHeaderClick = (field: string) => {
    if (!sortable) {
      return;
    }

    setSortField(field);
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const totalPages = Math.ceil(sortedData.length / dataPerPage);
  const indexOfLastPost = currentPage * dataPerPage;
  const indexOfFirstPost = indexOfLastPost - dataPerPage;
  const currentPosts = sortedData.slice(indexOfFirstPost, indexOfLastPost);

  const changePage = (newPage: number) => setCurrentPage(prev => (newPage >= 1 && newPage <= totalPages) ? newPage : prev);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Complete':
        return { backgroundColor: 'green', padding: '5px', borderRadius: '15px' };
      case 'Cancelled':
        return { backgroundColor: 'red', padding: '5px', borderRadius: '15px' };
      case 'Pending':
        return { backgroundColor: 'yellow', padding: '5px', borderRadius: '15px' };
      default:
        return {};
    }
  }

  return (
    <Box overflowX="auto">
      <Table>
        <TableCaption fontSize="2xl" fontWeight="bold" placement="top">{caption}</TableCaption>
        <Thead>
          <Tr>
            {headers.map(header => (
              <Th key={header.field} onClick={() => handleHeaderClick(header.field)} cursor={sortable && header.sortable ? "pointer" : "auto"}>
                {header.label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {currentPosts.map((item) => (
            <Tr key={item.id}>
              {headers.map(header => (
                <Td key={header.field}>
                  {header.field === 'select' ? (
                    <Select defaultValue={item[header.field].toString()}>
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </Select>
                  ) : header.field === 'status' ? (
                    <span style={getStatusStyle(item[header.field])}>
                      {item[header.field]}
                    </span>
                  ) : (
                    item[header.field]
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
        <tfoot>
          <Tr>
            <Td colSpan={headers.length}>
              <Flex justifyContent="flex-end">
                <Button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button onClick={() => changePage(index + 1)} key={index + 1}>{index + 1}</Button>
                ))}
                <Button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
              </Flex>
            </Td>
          </Tr>
        </tfoot>
      </Table>
    </Box>
  );
};

export default DataTable;
