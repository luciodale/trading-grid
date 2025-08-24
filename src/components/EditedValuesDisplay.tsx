import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { memo, useMemo } from "react";
import { READONLY_GRID_CONFIG } from "../config/agGridConfig";
import type { EditedValues } from "../hooks/useEditedValues";

type EditedValuesDisplay = {
	id: string;
	rowId: string;
	field: string;
	value: unknown;
};
const columnDefs: ColDef<EditedValuesDisplay>[] = [
	{ field: "id", hide: true },
	{ field: "rowId", headerName: "Row ID", width: 120 },
	{ field: "field", headerName: "Field", width: 100 },
	{ field: "value", headerName: "Value", flex: 1 },
];

function EditedValuesDisplayInner({
	editedValues,
}: {
	editedValues: EditedValues;
}) {
	const editedRows = useMemo(() => {
		const rows: EditedValuesDisplay[] = [];
		Object.entries(editedValues).forEach(([rowId, edits]) => {
			Object.entries(edits).forEach(([field, value]) => {
				rows.push({ id: `${rowId}-${field}`, rowId, field, value });
			});
		});
		return rows;
	}, [editedValues]);

	if (editedRows.length === 0) {
		return <div className="empty-state">No edited values</div>;
	}

	return (
		<div className="ag-grid-container">
			<AgGridReact
				rowData={editedRows}
				columnDefs={columnDefs}
				getRowId={(params) => params.data.id}
				{...READONLY_GRID_CONFIG}
			/>
		</div>
	);
}

export const EditedValuesDisplay = memo(EditedValuesDisplayInner);
