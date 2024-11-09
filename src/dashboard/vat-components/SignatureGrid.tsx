import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SheetGrid, SheetGridCol, SheetGridRow } from '../types';

type Props = {
  data: SheetGrid
};

export default function SignatureGrid({data} : Props) {
  const transformRows = (rows : SheetGridRow[] ) => {
    return rows.map(transformRow)
  }

  // console.log(data.rows.map(r => r.c[0].v))

  const transformRow = (row : SheetGridRow) => {
    return {
      ...row,
      id: `${row.c[0].v}_${row.c[1].v}_${row.c[2].v}`,
      Nome: row.c[0].v,
      Partido: row.c[1].v,
      Estado: row.c[2].v,
      Assinou: row.c[3].v
    }
  }

  const transformCol = (col : SheetGridCol) : GridColDef => {
    return {
      field: col.label,
      headerName: col.label,
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 80,
    }
  }
  
  const transformCols = (cols : SheetGridCol[]) : GridColDef[] => {
    return cols.map(transformCol);
  }

  return (
    <DataGrid
      autoHeight
      checkboxSelection
      rows={transformRows(data.rows)}
      columns={transformCols(data.cols)}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
  );
}
