import type { GridApi, IRowNode, RowSelectedEvent } from "ag-grid-community";
import { useCallback, useRef, useState } from "react";
import type { Option } from "../mocks/types";

export function useRowSelection() {
	const [selectedRow, setSelectedRow] = useState<Option | null>(null);
	const selectedRowRef = useRef<Option | null>(null);

	// Keep ref in sync with state
	// This ref is needed to access the current selectedRow value in handleSelection
	// without creating a dependency that would cause stale closures and race conditions
	// between handleRowSelected and handleSelection callbacks
	selectedRowRef.current = selectedRow;

	// Function to handle row selection from grid events
	const handleRowSelected = (event: RowSelectedEvent<Option>) => {
		if (event.node.isSelected()) {
			setSelectedRow(event.data || null);
		} else {
			// Only clear selection if the deselected row is no longer in the grid
			setSelectedRow((currentlySelected) => {
				if (
					currentlySelected &&
					event.data &&
					currentlySelected.id === event.data.id
				) {
					// Check if the row still exists in the grid
					const rowStillExists = event.api.getRowNode(event.data.id);
					if (!rowStillExists) {
						console.log("Row removed from grid, clearing selection");
						return null;
					}
				}
				return currentlySelected;
			});
		}
	};

	// Function to restore selection when nothing is selected
	const handleSelection = useCallback(
		(
			newGridData: Option[],
			gridApi: GridApi<Option> | undefined,
			savedSelectedRowId?: string,
		) => {
			// Only restore if we have data and grid API
			if (newGridData.length > 0 && gridApi) {
				// Check if there's already a selected row in the grid
				const selectedNodes = gridApi.getSelectedNodes();
				if (selectedNodes.length > 0) {
					// Update our state to match the grid's selection
					const selectedData = selectedNodes[0].data;
					if (selectedData && selectedData !== selectedRowRef.current) {
						setSelectedRow(selectedData);
					}
					return;
				}

				// Try to restore saved selection first
				const savedRow = newGridData.find(
					(option) => option.id === savedSelectedRowId,
				);

				if (savedRow) {
					// Restore saved selection
					const savedRowNode = gridApi.getRowNode(savedRow.id);
					if (savedRowNode) {
						savedRowNode.setSelected(true);
						setSelectedRow(savedRow);
						console.log("Restored saved selection:", savedRow.id);
					}
				} else {
					// Fallback to first row after filtering and sorting if saved selection not found
					let firstRowNode: IRowNode<Option> | undefined;
					gridApi.forEachNodeAfterFilterAndSort((rowNode, idx) => {
						if (idx === 0) {
							firstRowNode = rowNode;
						}
					});

					if (firstRowNode) {
						firstRowNode.setSelected(true);
						setSelectedRow(newGridData[0]);
						console.log("Defaulted to first row:", newGridData[0].id);
					}
				}
			}
		},
		[], // Remove selectedRow from dependencies to prevent stale closures
	);

	return {
		selectedRow,
		handleRowSelected,
		handleSelection,
	};
}
