import { colorSchemeDarkBlue, themeQuartz } from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import type { ComponentProps } from "react";

const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

export const commonTheme = themeDarkBlue;

export const READONLY_GRID_CONFIG = {
	defaultColDef: {
		sortable: false,
		filter: false,
		resizable: true,
		flex: 1,
	},
	headerHeight: 32,
	rowHeight: 24,
	suppressCellFocus: true,
	theme: commonTheme,
} satisfies ComponentProps<typeof AgGridReact>;
