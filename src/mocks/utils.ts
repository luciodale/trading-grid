import type { Option } from "./types";

// Shared constants
export const WEBSOCKET_URL = "ws://localhost:5173/ws/options";
export const API_ENDPOINTS = {
	OPTIONS: "/api/options",
} as const;

// Interval constants (in milliseconds)
export const INTERVALS = {
	UPDATE: 100,
	ADD: 1000,
	REMOVE: 1000,
} as const;

// Generate initial options data
export const generateOptions = (): Option[] => {
	const symbols = ["AAPL", "TSLA", "META"];
	const options: Option[] = [];

	symbols.forEach((symbol) => {
		for (let i = 0; i < 10; i++) {
			const basePrice = symbol === "AAPL" ? 150 : symbol === "TSLA" ? 200 : 300;
			const strikeOffset = (i - 5) * 10; // Creates strikes around the base price
			const strikePrice = basePrice + strikeOffset;

			options.push({
				id: `${symbol}-${i + 1}`,
				underlyingSymbol: symbol,
				strikePrice,
				expirationDate: "2024-12-20",
				optionType: i % 2 === 0 ? "call" : "put",
				bid: Math.round((strikePrice * 0.05 + Math.random() * 2) * 100) / 100,
				ask:
					Math.round((strikePrice * 0.05 + Math.random() * 2 + 0.5) * 100) /
					100,
			});
		}
	});

	return options;
};

// Function to update bid/ask prices with some randomness
export const updatePrices = (option: Option): Option => {
	const priceChange = (Math.random() - 0.5) * 2; // Random change between -1 and 1
	const newBid = Math.max(0.01, option.bid + priceChange);
	const newAsk = Math.max(newBid + 0.01, option.ask + priceChange);

	return {
		...option,
		bid: Math.round(newBid * 100) / 100,
		ask: Math.round(newAsk * 100) / 100,
	};
};

// Function to generate a new option
export const generateNewOption = (nextId: number): Option => {
	const symbols = ["AAPL", "TSLA", "META"];
	const symbol = symbols[Math.floor(Math.random() * symbols.length)];
	const basePrice = symbol === "AAPL" ? 150 : symbol === "TSLA" ? 200 : 300;
	const strikeOffset = (Math.random() - 0.5) * 100; // Random strike around base price
	const strikePrice = Math.round((basePrice + strikeOffset) * 100) / 100;

	return {
		id: `NEW-${nextId}`,
		underlyingSymbol: symbol,
		strikePrice,
		expirationDate: "2024-12-20",
		optionType: Math.random() > 0.5 ? "call" : "put",
		bid: Math.round((strikePrice * 0.05 + Math.random() * 2) * 100) / 100,
		ask: Math.round((strikePrice * 0.05 + Math.random() * 2 + 0.5) * 100) / 100,
	};
};
