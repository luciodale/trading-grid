import { HttpResponse, http, ws } from "msw";
import type { Option, StreamMessage } from "./types";
import {
	API_ENDPOINTS,
	generateNewOption,
	generateOptions,
	INTERVALS,
	updatePrices,
	WEBSOCKET_URL,
} from "./utils";

const optionsData = generateOptions();
let nextId = 31; // Start from 31 since we have 30 initial options

// Create WebSocket link for options streaming
const optionsSocket = ws.link(WEBSOCKET_URL);

// Global interval state and management
let currentIntervals: {
	update: number;
	add: number;
	remove: number;
} = {
	update: INTERVALS.UPDATE,
	add: INTERVALS.ADD,
	remove: INTERVALS.REMOVE,
};

let activeIntervals: {
	update?: number;
	add?: number;
	remove?: number;
} = {};

// Function to clear all active intervals
const clearActiveIntervals = () => {
	if (activeIntervals.update) clearInterval(activeIntervals.update);
	if (activeIntervals.add) clearInterval(activeIntervals.add);
	if (activeIntervals.remove) clearInterval(activeIntervals.remove);
	activeIntervals = {};
};

// Function to update intervals and restart if needed
export const updateIntervals = (intervals: {
	update?: number;
	add?: number;
	remove?: number;
}) => {
	currentIntervals = { ...currentIntervals, ...intervals };
	// Trigger a restart by dispatching a custom event
	window.dispatchEvent(new CustomEvent("restartStreamingIntervals"));
};

export const handlers = [
	// GET endpoint to fetch all options
	http.get(API_ENDPOINTS.OPTIONS, () => {
		return HttpResponse.json(optionsData);
	}),

	// WebSocket endpoint for real-time options updates
	optionsSocket.addEventListener("connection", ({ client }) => {
		console.log("WebSocket client connecting for options data...");

		// Send initial data immediately upon connection
		client.send(
			JSON.stringify({
				type: "initial",
				data: optionsData,
			} satisfies StreamMessage),
		);

		// Function to create intervals
		const createIntervals = () => {
			// Clear existing intervals
			clearActiveIntervals();

			// Set up periodic updates
			activeIntervals.update = setInterval(() => {
				// Update existing options
				const numToUpdate = Math.floor(Math.random() * 6) + 5;
				const updatedOptions: Option[] = [];

				for (let i = 0; i < numToUpdate; i++) {
					const randomIndex = Math.floor(Math.random() * optionsData.length);
					const updatedOption = updatePrices(optionsData[randomIndex]);
					optionsData[randomIndex] = updatedOption;
					updatedOptions.push(updatedOption);
				}

				client.send(
					JSON.stringify({
						type: "update",
						data: updatedOptions,
					} satisfies StreamMessage),
				);
			}, currentIntervals.update);

			// Set up periodic additions
			activeIntervals.add = setInterval(() => {
				// Add new option
				const newOption = generateNewOption(nextId++);
				optionsData.push(newOption);

				client.send(
					JSON.stringify({
						type: "add",
						data: [newOption],
					} satisfies StreamMessage),
				);
			}, currentIntervals.add);

			// Set up periodic removal of top row
			activeIntervals.remove = setInterval(() => {
				// Remove the top row (first element) if we have options
				if (optionsData.length > 0) {
					const removedOption = optionsData.shift(); // Remove first element
					if (removedOption) {
						client.send(
							JSON.stringify({
								type: "remove",
								data: [removedOption],
							} satisfies StreamMessage),
						);
					}
				}
			}, currentIntervals.remove);
		};

		// Create initial intervals
		createIntervals();

		// Listen for restart events
		const handleRestart = () => {
			createIntervals();
		};
		window.addEventListener("restartStreamingIntervals", handleRestart);

		// Handle client messages (if any)
		client.addEventListener("message", (event) => {
			console.log("Received message from client:", event.data);
			// You can handle client messages here if needed
		});

		// Clean up intervals when connection closes
		client.addEventListener("close", () => {
			console.log("WebSocket connection closed");
			clearActiveIntervals();
			window.removeEventListener("restartStreamingIntervals", handleRestart);
		});
	}),
];
