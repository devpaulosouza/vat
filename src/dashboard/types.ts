import { Theme } from "@mui/material";

interface AddedProps {
    theme: Theme;
  };
  
export type ThemeProps = AddedProps;

interface GoogleSheetsResponseProps {
  body: ReadableStream<Uint8Array> | null;
};

export type GoogleSheetsResponse = GoogleSheetsResponseProps;

export interface SheetGridCol {
  id: string;
  label: string;
  type: string;
}

interface SheetGridRowItem {
  v: string | boolean;
}

export interface SheetGridRow {
  c: SheetGridRowItem[];
}

export interface SheetGrid {
  cols: SheetGridCol[];
  rows: SheetGridRow[];
}
