import { useCallback, useState } from "react";
import type { Option, StreamingUpdate } from "../mocks/types";

export function useStreamingUpdates() {
	const [updates, setUpdates] = useState<StreamingUpdate[]>([]);

	const addUpdate = useCallback(
		(update: Omit<StreamingUpdate, "id" | "timestamp">) => {
			const newUpdate: StreamingUpdate = {
				...update,
				id: Date.now().toString(),
				timestamp: new Date().toLocaleTimeString(),
			};

			setUpdates((prev) => {
				const newUpdates = [newUpdate, ...prev];
				// Keep only the last 100 updates to prevent memory issues
				return newUpdates.slice(0, 100);
			});
		},
		[],
	);

	const trackHistoricalUpdates = useCallback(
		({
			added,
			deleted,
			updated,
		}: {
			added: Option[];
			deleted: Option[];
			updated: Option[];
		}) => {
			// Track historical updates
			if (added.length > 0) {
				added.forEach((option) => {
					addUpdate({
						type: "add",
						rowId: option.id,
					});
				});
			}
			if (deleted.length > 0) {
				deleted.forEach((option) => {
					addUpdate({
						type: "remove",
						rowId: option.id,
					});
				});
			}
			if (updated.length > 0) {
				updated.forEach((option) => {
					addUpdate({
						type: "update",
						rowId: option.id,
					});
				});
			}
		},
		[addUpdate],
	);

	const clearUpdates = useCallback(() => {
		setUpdates([]);
	}, []);

	return {
		updates,
		addUpdate,
		trackHistoricalUpdates,
		clearUpdates,
	};
}
