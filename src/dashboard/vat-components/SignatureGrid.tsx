import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams, GridSingleSelectColDef, GridToolbar } from '@mui/x-data-grid';
import { SheetGrid, SheetGridCol, SheetGridRow } from '../types';
import { Button, Card, CardActions, CardContent, CardMedia, darken, lighten, Modal as BaseModal, styled, Theme, Typography } from '@mui/material';
import { ptBR } from '@mui/x-data-grid/locales';

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
  '& .MuiDataGrid-row:hover': {
    'cursor': 'pointer',
  }
}));

interface V {
  v: string | boolean
}

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function SignatureGrid({ data }: Props) {

  const [selected, setSelected] = React.useState<V[]>([]);

  const transformRows = (rows: SheetGridRow[]) => {
    return rows.map(transformRow)
  }

  function renderSocialNewtworks(
    params: GridRenderCellParams<SheetGridRow, any, any>,
  ) {
    if (params.value == null) {
      return '';
    }

    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'end' }}>
          {
            params.value.x && (
              <div style={{ flex: 1 }}>
                <img style={{ width: 45 }} src='https://cdn.icon-icons.com/icons2/4029/PNG/512/twitter_x_new_logo_square_x_icon_256075.png' />
              </div>
            )
          }
          {
            params.value.instagram && (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1 }}>
                  <img style={{ width: 25 }} src='https://cdn.iconscout.com/icon/free/png-256/free-instagram-1865876-2745483.png' />
                </div>
              </div>
            )
          }
        </div>
      </>
    );
  }

  const transformRow = (row: SheetGridRow) => {
    return {
      ...row,
      id: `${row.c[0].v}_${row.c[1].v}_${row.c[2].v}`,
      Nome: row.c[0].v,
      Partido: row.c[1].v,
      Estado: row.c[2].v,
      Assinou: row.c[3].v ? 'S' : 'N',
      signed: row.c[3].v,
      '@': { x: !!row.c[4]?.v, instagram: !!row.c[5]?.v }
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
    return [{ field: '@', headerName: '@', renderCell: renderSocialNewtworks, align: 'left', headerAlign: 'left', maxWidth: 80 }, ...cols.map(transformCol)];
  }

  const VISIBLE_FIELDS = ['Nome', 'Partido', 'Estado', 'Assinou', '@'];
  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = React.useMemo(
    () => transformCols(data.cols.filter((column) => VISIBLE_FIELDS.includes(column.label))),
    [data.cols],
  );

  const handleRowClick = (params: GridRowParams) => {
    const {
      row: {
        Nome,
        Estado,
        Partido,
        Assinou,
        c
      }
    } = params;

    setSelected(c)

    console.log(Nome, Estado, Partido, Assinou, c)
  }

  const handleClose = () => {
    setSelected([]);
  }
  return (
    <>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={!!selected.length}
        onClose={handleClose}
      // slots={{ backdrop: StyledBackdrop }}
      >
        <Card sx={{ maxWidth: 400 }}>
          <CardMedia
            component="img"
            alt="green iguana"
            height="240"
            image={`${selected && selected[7]?.v || ''}`}
            sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
          />
          <CardContent>
            <Typography gutterBottom variant="h3" component="div" sx={{ mt: 3 }}>
              {selected[0]?.v}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              Partido: {selected[1]?.v}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              UF: {selected[2]?.v}
            </Typography>
            <Typography gutterBottom variant="h6" component="div" sx={{ color: selected[3]?.v ? '#1fa324' : '#e8120c' }}>
              Assinou: {selected[3]?.v ? 'Sim' : 'Não'}
            </Typography>
            <Typography gutterBottom variant="body2" component="div" sx={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ minWidth: 90 }}>
                E-mail:
              </div>
              <div style={{ flex: 2 }}>{selected[3]?.v ? <a href={`mailto:${selected[6]?.v}`}>{selected[6]?.v}</a> : <a href={`mailto:${selected[6]?.v}?subject=Pelo Fim da Escala 6x1`}>{selected[6]?.v}</a>}
              </div>
            </Typography>
            {
              selected[4]?.v && (
                <Typography gutterBottom variant="body2" component="div" sx={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ minWidth: 90 }}>
                    X:
                  </div>
                  <div style={{ flex: 2 }}>
                    <a href={`${selected[4].v}`} target='_blank'>@{`${selected[4].v}`.replaceAll('https://x.com/', '').replaceAll('https://www.x.com/', '').replaceAll('https://www.twitter.com/', '').replaceAll('https://twitter.com/', '')}</a>
                  </div>
                </Typography>
              )
            }
            {
              selected[5]?.v && (
                <Typography gutterBottom variant="body2" component="div" sx={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ minWidth: 90 }}>
                    Instagram:
                  </div>
                  <div style={{ flex: 2 }}>
                    <a href={`${selected[5]?.v}`} target='_blank'>@{`${selected[5]?.v}`.replaceAll('https://www.instagram.com/', '').replaceAll('https://instagram.com/', '')}</a>
                  </div>
                </Typography>
              )
            }
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleClose} sx={{ mt: 3 }}>Fechar</Button>
          </CardActions>
        </Card>
      </Modal>
      <StyledDataGrid
        autoHeight
        rows={transformRows(data.rows)}
        columns={columns}
        onRowClick={handleRowClick}
        slots={{ toolbar: GridToolbar }}
        getRowClassName={(params) => {
          const signed = + params.row.signed ? 'super-app-theme--Filled' : 'super-app-theme--Rejected'
          return signed;
        }
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[20, 50, 100]}
        autosizeOnMount
        autosizeOptions={{
          includeOutliers: true,                 // Columns sized to fit all cell content
          includeHeaders: true,                  // Columns sized to fit all header content
        }}
        disableDensitySelector
        density='compact'
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
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
    </>
  );
}
