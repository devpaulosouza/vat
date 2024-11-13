import React, { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import { StatCardProps } from './StatCard';
import SignatureGrid from '../vat-components/SignatureGrid';
import { GoogleSheetsResponse, SheetGrid } from '../types';
import debounce from 'lodash.debounce';
import { alpha, Stack } from '@mui/material';
import Header from './Header';
import SideMenu from './SideMenu';
import AppNavbar from './AppNavbar';
import { PieChart } from '@mui/x-charts';

const EMPTY = { rows: [], cols: [] };

// export const UseDebounce = (value: any, delay: number) => {
//   const [debouncedValue, setDebouncedValue] = useState();

//   useEffect(() => {
//     let timer = setTimeout(() => setDebouncedValue(value), delay)

//     return () => clearTimeout(timer);
//   }, [value])

//   return debouncedValue
// }

export async function streamToString(stream: ReadableStream<Uint8Array> | null): Promise<SheetGrid> {
  const res: string = await new Response(stream).text();

  if (res === null) {
    return EMPTY;
  }
  const json = res.match(/(?<=.*\().*(?=\);)/s);

  if (!json?.length) {
    return EMPTY;
  }

  return JSON.parse(json[0]).table;
}

export default function AnalyticsGrid() {

  const id = '1wNNB1XO2W5TxJFw0Ki1XmrwOm6-aH98asge2w16GoaI';
  const gid = '0';
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&tq&gid=${gid}&range=A:I`;

  const [data, setData] = useState<SheetGrid>(EMPTY);

  const fetchData = async () => {
    console.log('fetching')
    const res: GoogleSheetsResponse = await fetch(url);

    const json = await streamToString(res.body);

    setData(json);
  }

  useEffect(() => {
    fetchData();
  }, []);

  interface Signature {
    party: string;
    signed: boolean;
  }

  interface PartySignature {
    party: string;
    signed: number;
    notSigned: number;
    total: number;
  }

  const reducePartyVotes = (_data: SheetGrid): Record<string, PartySignature> => {
    const signatures: Signature[] = _data.rows.map(r => r.c).map(c => ({ party: `${c[1].v}`, signed: `${c[3].v}` === 'true' }))

    if (!signatures.length) {
      return {};
    }

    const partySignatures: Record<string, Signature[] | undefined> = Object.groupBy(signatures, (item) => {

      return item.party
    });

    const response: Record<string, PartySignature> = {}

    Object.entries(partySignatures)
      .forEach(ps => {
        if (!response[ps[0]]) {
          response[ps[0]] = {
            party: ps[0],
            signed: ps[1]?.map(s => s.signed)?.filter(s => s)?.length || 0,
            notSigned: ps[1]?.map(s => s.signed)?.filter(s => !s)?.length || 0,
            total: ps[1]?.length || 0
          };
        }
      })

    return response;
  }

  const partySignatureData = reducePartyVotes(data);

  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
      <AppNavbar />
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: 'auto',
        })}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Header /><Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            {/* cards */}
            {/* <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid> */}
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Typography component="p" sx={{ mb: 2, mr: 4 }}>
                Assinaturas: {data.rows.map(r => r.c[3].v).reduce((p, c) => (c ? 1 : 0) + p, 0)}
              </Typography>
              <Typography component="p" sx={{ mb: 2, mr: 4 }}>
                Abstenções: {data.rows.map(r => r.c[3].v).reduce((p, c) => (c ? 0 : 1) + p, 0)}
              </Typography>
              <Typography component="p" sx={{ mb: 2 }}>
                Total: {data.rows.length}
              </Typography>
            </div>
            <Typography component="h2">
              Parttidos que assinaram
            </Typography>
            <Grid container spacing={2} columns={12}>
              {
                Object.entries(partySignatureData)
                .sort((p, c) => (c[1].signed / c[1].total) - (p[1].signed/p[1].total))
                .map(p => {
                  return (<Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} flexDirection='column' style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                    <Typography style={{textAlign: 'center'}} component="h2">
                      {`${p[0]} - Deputados: ${p[1].total}`}
                      </Typography>
                      <PieChart
                        series={[
                          {
                            data: [{
                              id: 'Assinados',
                              value: p[1].signed,
                              label: `Assinados`,
                              color: '#1fa324'
                            },
                            {
                              id: 'Omitidos',
                              value: p[1].notSigned,
                              label: `Omitidos`,
                              color: '#851b13'
                            }
                            ],
                            arcLabel: (item) => `${item.value}`,
                            arcLabelMinAngle: 1,
                            arcLabelRadius: '60%',
                          },
                        ]}
                        width={300}
                        height={200}
                        slotProps={{
                          legend: {
                            direction: 'column',
                            position: { vertical: 'middle', horizontal: 'right' },
                            padding: 0,
                            itemGap: 1,
                            itemMarkWidth: 10,
                            itemMarkHeight: 2,
                            hidden: true
                          },
                        }}
                      />
                  </Grid>
                  )
                })
              }
              {/* <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid> */}
            </Grid>
            <Copyright sx={{ my: 4 }} />
          </Box>
        </Stack>
      </Box>
    </Box>

  );
}
