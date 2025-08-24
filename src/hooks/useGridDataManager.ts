import type { GridApi } from "ag-grid-community";
import { useEffect, useRef } from "react";
import type { Option } from "../mocks/types";

export type GridDataChange = {
	newGridData: Option[];
	updated: Option[];
	deleted: Option[];
	added: Option[];
};

type GridDataChangeHandler = (change: GridDataChange) => void;

type UseGridDataManagerConfig = {
	options: Option[];
	gridApi: GridApi<Option> | undefined;
	onGridDataChange: GridDataChangeHandler;
};

export function useGridDataManager({
	options,
	gridApi,
	onGridDataChange,
}: UseGridDataManagerConfig) {
	const prevOptionsRef = useRef<Option[]>([]);

	useEffect(() => {
		// Only run when both options and gridApi are available
		if (options.length > 0 && gridApi) {
			const prevOptions = prevOptionsRef.current;

			// Calculate what changed
			const added = options.filter(
				(option) => !prevOptions.some((prev) => prev.id === option.id),
			);

			const deleted = prevOptions.filter(
				(option) => !options.some((curr) => curr.id === option.id),
			);

			const updated = options.filter((option) => {
				const prevOption = prevOptions.find((prev) => prev.id === option.id);
				return (
					prevOption && JSON.stringify(prevOption) !== JSON.stringify(option)
				);
			});

			// Only call handler if there are actual changes
			if (added.length > 0 || deleted.length > 0 || updated.length > 0) {
				onGridDataChange({
					newGridData: options,
					updated,
					deleted,
					added,
				});
			}

			// Update the previous options reference
			prevOptionsRef.current = options;
		}
	}, [options, gridApi, onGridDataChange]);
}
