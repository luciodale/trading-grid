import { useEffect, useRef, useState } from "react";
import type { Option, StreamMessage } from "../mocks/types";
import { WEBSOCKET_URL } from "../mocks/utils";

// Abstracted logic functions
const handleInitialData = (data: Option[]): Option[] => {
	return data;
};

const handleUpdateData = (
	prevOptions: Option[],
	updatedOptions: Option[],
): Option[] => {
	const updatedOptionsMap = new Map(
		updatedOptions.map((option) => [option.id, option]),
	);

	return prevOptions.map(
		(option) => updatedOptionsMap.get(option.id) || option,
	);
};

const handleAddData = (
	prevOptions: Option[],
	newOptions: Option[],
): Option[] => {
	return [...prevOptions, ...newOptions];
};

const handleRemoveData = (
	prevOptions: Option[],
	optionsToRemove: Option[],
): Option[] => {
	const idsToRemove = new Set(optionsToRemove.map((option) => option.id));
	return prevOptions.filter((option) => !idsToRemove.has(option.id));
};

export function useOptionsStream() {
	const [options, setOptions] = useState<Option[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isPaused, setIsPaused] = useState(false);
	const isPausedRef = useRef(isPaused);

	useEffect(() => {
		const socket = new WebSocket(WEBSOCKET_URL);

		socket.onopen = () => {
			setIsConnected(true);
			setError(null);
			console.log("WebSocket connected");
		};

		socket.onmessage = (event) => {
			// Don't process messages if paused
			if (isPausedRef.current) return;

			try {
				const message: StreamMessage = JSON.parse(event.data);

				switch (message.type) {
					case "initial":
						setOptions(handleInitialData(message.data));
						break;
					case "update":
						setOptions((prevOptions) =>
							handleUpdateData(prevOptions, message.data),
						);
						break;
					case "add":
						setOptions((prevOptions) =>
							handleAddData(prevOptions, message.data),
						);
						break;
					case "remove":
						setOptions((prevOptions) =>
							handleRemoveData(prevOptions, message.data),
						);
						break;
					default:
						console.warn(`Unknown message type: ${message.type}`);
				}
			} catch (err) {
				console.error("Failed to parse WebSocket data", err);
				setError("Failed to parse WebSocket data");
			}
		};

		socket.onerror = (event) => {
			setIsConnected(false);
			setError("WebSocket connection error");
			console.error("WebSocket error:", event);
		};

		socket.onclose = () => {
			setIsConnected(false);
			setError("WebSocket connection closed");
			console.log("WebSocket disconnected");
		};

		return () => {
			socket.close();
		};
	}, []); // Remove isPaused from dependencies to prevent reconnection

	const togglePause = () => {
		setIsPaused((prev) => {
			const newPaused = !prev;
			isPausedRef.current = newPaused;
			return newPaused;
		});
	};

	return { options, isConnected, error, isPaused, togglePause };
}
