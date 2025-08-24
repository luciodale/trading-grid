import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { memo, useMemo } from "react";
import { READONLY_GRID_CONFIG } from "../config/agGridConfig";
import type { Option } from "../mocks/types";

type SelectedRowDetails = {
	id: string;
	value: string | number;
};

const columnDefs: ColDef<SelectedRowDetails>[] = [
	{ field: "id", headerName: "Field" },
	{ field: "value", headerName: "Value" },
];

export const SelectedRowDetails = memo(SelectedRowDetailsInner);

function SelectedRowDetailsInner({
	selectedRow,
}: {
	selectedRow: Option | null;
}) {
	const rowData = useMemo(() => {
		// Define the expected fields from Option type
		const optionFields = [
			"id",
			"underlyingSymbol",
			"strikePrice",
			"expirationDate",
			"optionType",
			"bid",
			"ask",
		];

		if (!selectedRow) {
			// Return empty data structure with all expected fields
			return optionFields.map((field) => ({
				id: field,
				value: "",
			}));
		}

		return Object.entries(selectedRow).map(([key, value]) => ({
			id: key,
			value: value?.toString() || "",
		}));
	}, [selectedRow]);

	return (
		<div className="ag-grid-container">
			<AgGridReact
				rowData={rowData}
				columnDefs={columnDefs}
				getRowId={(params) => params.data.id}
				{...READONLY_GRID_CONFIG}
			/>
		</div>
	);
}
