import { useCallback, useState } from "react";
import type { Option, StreamingUpdate } from "../mocks/types";

export function useHistoricalUpdates() {
	const [updates, setUpdates] = useState<StreamingUpdate[]>([]);

	const addUpdate = useCallback(
		(update: Omit<StreamingUpdate, "id" | "timestamp">) => {
			const newUpdate: StreamingUpdate = {
				...update,
				id: crypto.randomUUID(),
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
				addUpdate({
					type: "add",
					rowId: added.map((option) => option.id).join(","),
				});
			}
			if (deleted.length > 0) {
				addUpdate({
					type: "remove",
					rowId: deleted.map((option) => option.id).join(","),
				});
			}
			if (updated.length > 0) {
				addUpdate({
					type: "update",
					rowId: updated.map((option) => option.id).join(","),
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
