import * as React from 'react';

import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableHead, {tableHeadClasses} from '@mui/material/TableHead';
import {useEffect, useState} from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import {categoryData} from '../constants/categoryData';
import {styled} from '@mui/material/styles';
import {theme as thm} from '../theme';

const StyledTableHead = styled(TableHead)(({theme}) => ({
  [`&.${tableHeadClasses.root}`]: {
    borderLeft: `6px solid #111840`,
  },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(n + 1)': {
    borderLeft: `6px solid ${thm.palette.error.main}`,
  },
  ':nth-of-type(n + 4)': {
    borderLeft: `6px solid ${thm.palette.warning.main}`,
  },
  ':nth-of-type(n + 7)': {
    borderLeft: `6px solid ${thm.palette.success.main}`,
  },
  ':nth-of-type(n + 10)': {
    borderLeft: `6px solid ${thm.palette.primary.main}`,
  },
  ':nth-of-type(n + 13)': {
    borderLeft: `6px solid ${thm.palette.secondary.main}`,
  },
}));

interface TableRowData {
  category: string;
  aspect: string;
  percentile: string;
}

function createData(percentiles: Record<string, number>): TableRowData[] {
  const tableData: TableRowData[] = [];

  for (const data of categoryData) {
    const EMPTY: string = '';

    if (data.isOcean) {
      tableData.push({
        category: data.category + ' (' + data.categoryAbbr + ')',
        aspect: EMPTY,
        percentile: percentiles[`${data.category}`] + '%',
      });
    } else {
      tableData.push({
        category: EMPTY,
        aspect: data.category + ' (' + data.categoryAbbr + ')',
        percentile: percentiles[`${data.category}`] + '%',
      });
    }
  }

  return tableData;
}

interface ResultTableProps {
  percentiles: Record<string, number>;
}

const ResultTable: React.FC<ResultTableProps> = (props: ResultTableProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 750);

  // choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 750) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#111840',
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      color: thm.palette.info.main,
      fontSize: 14,
      padding: isMobile ? 8 : 9,
    },
  }));

  const rows = createData(props.percentiles);

  return (
    <TableContainer component={Paper}>
      <Table aria-label='customized table'>
        <StyledTableHead>
          <TableRow>
            <StyledTableCell align='left'>Big Five Trait</StyledTableCell>
            <StyledTableCell align='left'>Aspect</StyledTableCell>
            <StyledTableCell align='left'>Percentile</StyledTableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.category}>
              <StyledTableCell component='th' scope='row'>
                <div style={{fontSize: 16}}>{row.category}</div>
              </StyledTableCell>
              <StyledTableCell align='left'>{row.aspect}</StyledTableCell>
              <StyledTableCell align='left'>{row.percentile}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultTable;
