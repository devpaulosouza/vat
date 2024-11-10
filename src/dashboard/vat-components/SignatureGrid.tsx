import * as React from 'react';
import { DataGrid, GridColDef, GridSingleSelectColDef, GridToolbar } from '@mui/x-data-grid';
import { SheetGrid, SheetGridCol, SheetGridRow } from '../types';
import { darken, lighten, styled, Theme } from '@mui/material';

type Props = {
  data: SheetGrid
};

const getBackgroundColor = (color: string, theme: Theme, coefficient: number) => ({
  backgroundColor: darken(color, coefficient),
  ...theme.applyStyles('light', {
    backgroundColor: lighten(color, coefficient),
  }),
});

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .super-app-theme--Open': {
    ...getBackgroundColor(theme.palette.info.main, theme, 0.7),
    '&:hover': {
      ...getBackgroundColor(theme.palette.info.main, theme, 0.6),
    },
    '&.Mui-selected': {
      ...getBackgroundColor(theme.palette.info.main, theme, 0.5),
      '&:hover': {
        ...getBackgroundColor(theme.palette.info.main, theme, 0.4),
      },
    },
  },
  '& .super-app-theme--Filled': {
    ...getBackgroundColor(theme.palette.success.main, theme, 0.7),
    '&:hover': {
      ...getBackgroundColor(theme.palette.success.main, theme, 0.6),
    },
    '&.Mui-selected': {
      ...getBackgroundColor(theme.palette.success.main, theme, 0.5),
      '&:hover': {
        ...getBackgroundColor(theme.palette.success.main, theme, 0.4),
      },
    },
  },
  '& .super-app-theme--PartiallyFilled': {
    ...getBackgroundColor(theme.palette.warning.main, theme, 0.7),
    '&:hover': {
      ...getBackgroundColor(theme.palette.warning.main, theme, 0.6),
    },
    '&.Mui-selected': {
      ...getBackgroundColor(theme.palette.warning.main, theme, 0.5),
      '&:hover': {
        ...getBackgroundColor(theme.palette.warning.main, theme, 0.4),
      },
    },
  },
  '& .super-app-theme--Rejected': {
    ...getBackgroundColor(theme.palette.error.main, theme, 0.7),
    '&:hover': {
      ...getBackgroundColor(theme.palette.error.main, theme, 0.6),
    },
    '&.Mui-selected': {
      ...getBackgroundColor(theme.palette.error.main, theme, 0.5),
      '&:hover': {
        ...getBackgroundColor(theme.palette.error.main, theme, 0.4),
      },
    },
  },
}));

export default function SignatureGrid({ data }: Props) {
  const transformRows = (rows: SheetGridRow[]) => {
    return rows.map(transformRow)
  }

  // console.log(data.rows.map(r => r.c[0].v))

  const transformRow = (row: SheetGridRow) => {
    return {
      ...row,
      id: `${row.c[0].v}_${row.c[1].v}_${row.c[2].v}`,
      Nome: row.c[0].v,
      Partido: row.c[1].v,
      Estado: row.c[2].v,
      Assinou: row.c[3].v ? 'Sim' : 'Não',
      signed: row.c[3].v
    }
  }

  const transformCol = (col: SheetGridCol): GridColDef => {
    return {
      field: col.label,
      headerName: col.label,
      headerAlign: 'right',
      align: 'left',
      flex: col.label === 'Nome' ? 5 : 1,
      minWidth: col.label === 'Nome' ? 160 : 80,
    }
  }

  const transformCols = (cols: SheetGridCol[]): GridColDef[] => {
    return cols.map(transformCol);
  }

const VISIBLE_FIELDS = ['Nome', 'Partido', 'Estado'];
  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = React.useMemo(
    () => data.cols.filter((column) => VISIBLE_FIELDS.includes(column.label)),
    [data.cols],
  );


  return (
    <StyledDataGrid
      autoHeight
      rows={transformRows(data.rows)}
      columns={transformCols(data.cols)}
      disableColumnFilter
      disableColumnSelector
      disableDensitySelector
      slots={{ toolbar: GridToolbar }}
      getRowClassName={(params) => {
        const signed = + params.row.signed ? 'super-app-theme--Filled' : 'super-app-theme--Rejected'
        return  signed;
      }
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      autosizeOnMount
      autosizeOptions={{
        includeOutliers: true,                 // Columns sized to fit all cell content
        includeHeaders: true,                  // Columns sized to fit all header content
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
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
