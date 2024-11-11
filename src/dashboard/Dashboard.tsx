import * as React from 'react';
import type { } from '@mui/x-date-pickers/themeAugmentation';
import type { } from '@mui/x-charts/themeAugmentation';
import type { } from '@mui/x-data-grid/themeAugmentation';
import type { } from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AnalyticsGrid from './components/AnalyticsGrid';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainGrid />,
  },
  {
    path: "/party-analytics",
    element: <AnalyticsGrid />,
  },
]);

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>

      <CssBaseline enableColorScheme />
      <RouterProvider router={router}>
      </RouterProvider>
    </AppTheme>
  );
}
