import type { CellClassParams, ColDef } from "ag-grid-community";
import type { Option } from "../mocks/types";

// Function to check if a cell is edited
const getEditedCellClass = (params: CellClassParams<Option>) => {
	const context = params.context as {
		editedValues: Record<string, Partial<Option>>;
	};
	const rowId = params.data?.id;
	const field = params.column.getColId();

	if (
		rowId &&
		context?.editedValues?.[rowId]?.[field as keyof Option] !== undefined
	) {
		return "edited-cell";
	}
	return "";
};

export const OPTIONS_COLUMN_DEFINITIONS: ColDef<Option>[] = [
	{ field: "id", headerName: "ID" },
	{
		field: "underlyingSymbol",
		editable: true,
		cellClass: getEditedCellClass,
	},
	{
		field: "bid",
		cellStyle: { color: "green" },
		editable: true,
		cellClass: getEditedCellClass,
	},
	{
		field: "ask",
		cellStyle: { color: "red" },
		editable: true,
		cellClass: getEditedCellClass,
	},
	{
		field: "strikePrice",
		editable: true,
		cellClass: getEditedCellClass,
	},
	{
		field: "expirationDate",
		editable: true,
		cellClass: getEditedCellClass,
	},
	{
		field: "optionType",
		editable: true,
		cellClass: getEditedCellClass,
	},
];
