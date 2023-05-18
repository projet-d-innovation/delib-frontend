import styled from '@emotion/styled/macro';
import { Paper, Title , Table, Text} from '@mantine/core';
import React , { FC, useEffect, useState } from 'react';







const StyledTableRow = styled('tr')(({ theme }) => ({
  '&:nth-of-type(odd)': {
    
  },

}));

interface Props {
  values: any[][];
  headers?: any[];
  title: string;
}
const GenericTable: FC<Props> = ({ values, headers, title }) => {
  const [header, setHeader] = useState<any[]>();
  const [rows, setRows] = useState<any[][]>();


  useEffect(() => {

    if (headers) {
      setHeader(headers);
      setRows(values);
    } else {
      setHeader(values[0]);
      setRows(values.slice(1));
    }
  }, [values]);

  const showHeaders = () => {

    console.log("header", header)
    return (
      <thead
      >
        <StyledTableRow>
          {header?.map((value, hix) => {
            return <th key={`hdr${hix}`}>{value}</th>;
          })}
        </StyledTableRow>
      </thead>
    );
  };

  
  const renderRows = (row: any[], rix: number) => {
    let newrow = row;
    if (header != undefined)
      newrow = Array.from({ length: header.length }, (_, i) => i < row.length ? row[i] : "")

    return (<StyledTableRow key={`rw${rix}`}>
      {
        newrow.map((value, cix) => {
          return (
            <td style={{ textAlign: 'left'}} key={`cl${cix}`}>
              <Text fz="md">{value}</Text>
            </td>
          );
        })}
    </StyledTableRow>)
  }

  

  const showRows = () => {
    return (
      <tbody>
        {rows?.map((row, rix) => {
          return renderRows(row, rix)
        })}
      </tbody>
    );
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Title order={5}>{title}</Title>
     
      <Table verticalSpacing="xs" fontSize="md">
          {showHeaders()}
          {showRows()}
        </Table>

    </Paper>

  );
};

export default GenericTable;
