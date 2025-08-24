export type Option = {
	id: string;
	underlyingSymbol: string;
	strikePrice: number;
	expirationDate: string;
	optionType: "call" | "put";
	bid: number;
	ask: number;
};

type StreamMessageType = "initial" | "update" | "add" | "remove";

export type StreamMessage = {
	type: StreamMessageType;
	data: Option[];
};

export type StreamingUpdate = {
	id: string;
	timestamp: string;
	type: StreamMessageType;
	rowId: string;
};
