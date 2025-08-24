import { useEffect } from "react";
import { updateIntervals } from "../mocks/handlers";

export function useStreamingIntervals(
	updateInterval: number,
	addRemoveInterval: number,
) {
	useEffect(() => {
		updateIntervals({
			update: updateInterval,
			add: addRemoveInterval,
			remove: addRemoveInterval,
		});
	}, [updateInterval, addRemoveInterval]);
}
