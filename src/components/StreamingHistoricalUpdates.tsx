import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { READONLY_GRID_CONFIG } from "../config/agGridConfig";
import type { StreamingUpdate } from "../mocks/types";

type StreamingHistoricalUpdatesProps = {
	updates: StreamingUpdate[];
};

const columnDefs: ColDef<StreamingUpdate>[] = [
	{ field: "id", hide: true },
	{ field: "timestamp", headerName: "Time" },
	{ field: "type", headerName: "Type" },
	{ field: "rowId", headerName: "Row ID" },
];

export function StreamingHistoricalUpdates({
	updates,
}: StreamingHistoricalUpdatesProps) {
	if (updates.length === 0) {
		return <div className="empty-state">No updates yet</div>;
	}

	return (
		<div className="ag-grid-container">
			<AgGridReact
				rowData={updates}
				columnDefs={columnDefs}
				getRowId={(params) => params.data.id}
				{...READONLY_GRID_CONFIG}
			/>
		</div>
	);
}
