import { useCallback, useMemo, useState } from "react";
import type { Option } from "../mocks/types";

// Type for tracking edited values
export type EditedValues = Record<string, Partial<Option>>;

export function useEditedValues() {
	const [editedValues, setEditedValues] = useState<EditedValues>({});

	// Function to update edited values
	const updateEditedValue = (
		optionId: string,
		field: keyof Option,
		value: string | number,
	) => {
		setEditedValues((prev) => ({
			...prev,
			[optionId]: {
				...prev[optionId],
				[field]: value,
			},
		}));
	};

	// Function to clear all edited values
	const clearAllEditedValues = () => {
		setEditedValues({});
	};

	// Wrapper function to handle edit cleanup for grid data changes
	const handleClearEdits = useCallback((deletedRows: Option[]) => {
		if (deletedRows.length > 0) {
			const deletedIds = deletedRows.map((row) => row.id);
			setEditedValues((prev) => {
				const newEditedValues = { ...prev };
				deletedIds.forEach((id) => {
					delete newEditedValues[id];
				});
				return newEditedValues;
			});
		}
	}, []);

	// Function to rebase edited values on socket data
	const rebaseOptionsWithEdits = useMemo(
		() =>
			(socketOptions: Option[]): Option[] => {
				return socketOptions.map((option) => {
					const edits = editedValues[option.id];
					if (edits) {
						return {
							...option,
							...edits,
						};
					}
					return option;
				});
			},
		[editedValues],
	);

	return {
		editedValues,
		updateEditedValue,
		clearAllEditedValues,
		handleClearEdits,
		rebaseOptionsWithEdits,
	};
}
