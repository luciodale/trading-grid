interface ConnectionStatusProps {
	isConnected: boolean;
	error: string | null;
	isPaused?: boolean;
	onTogglePause?: () => void;
	updateInterval?: number;
	addRemoveInterval?: number;
	onSaveIntervals?: (updateInterval: number, addRemoveInterval: number) => void;
}

import { useId, useState } from "react";

export function ConnectionStatus({
	isConnected,
	error,
	isPaused = false,
	onTogglePause,
	updateInterval = 100,
	addRemoveInterval = 1000,
	onSaveIntervals,
}: ConnectionStatusProps) {
	const [localUpdateInterval, setLocalUpdateInterval] =
		useState(updateInterval);
	const [localAddRemoveInterval, setLocalAddRemoveInterval] =
		useState(addRemoveInterval);

	const updateIntervalId = useId();
	const addRemoveIntervalId = useId();
	const getStatusClass = () => {
		if (error) return "error";
		return isConnected ? "connected" : "disconnected";
	};

	const getStatusText = () => {
		if (error) return `Connection Error: ${error}`;
		if (!isConnected) return "Disconnected";
		return isPaused
			? "Connected - Stream paused"
			: "Connected - Streaming live data";
	};

	return (
		<div className={`connection-status ${getStatusClass()}`}>
			<div className="connection-status-left">
				<div className={`status-indicator ${getStatusClass()}`} />
				<span>{getStatusText()}</span>
			</div>

			<div className="connection-status-right">
				{isConnected && !error && (
					<div className="streaming-controls-inline">
						<div className="control-group-inline">
							<label htmlFor={updateIntervalId}>Grid Updates (ms)</label>
							<input
								id={updateIntervalId}
								type="number"
								min="50"
								max="5000"
								step="50"
								value={localUpdateInterval}
								onChange={(e) => setLocalUpdateInterval(Number(e.target.value))}
								disabled={isPaused}
							/>
						</div>

						<div className="control-group-inline">
							<label htmlFor={addRemoveIntervalId}>
								Add/Remove Grid Rows (ms)
							</label>
							<input
								id={addRemoveIntervalId}
								type="number"
								min="100"
								max="10000"
								step="100"
								value={localAddRemoveInterval}
								onChange={(e) =>
									setLocalAddRemoveInterval(Number(e.target.value))
								}
								disabled={isPaused}
							/>
						</div>

						<div className="control-group-inline">
							<button
								type="button"
								onClick={() =>
									onSaveIntervals?.(localUpdateInterval, localAddRemoveInterval)
								}
								disabled={isPaused}
								className="save-button-inline"
							>
								Save
							</button>
							{isConnected && !error && onTogglePause && (
								<button
									type="button"
									onClick={onTogglePause}
									className={`pause-button ${isPaused ? "paused" : ""}`}
									title={isPaused ? "Resume streaming" : "Pause streaming"}
								>
									{isPaused ? (
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<title>Resume</title>
											<path d="M8 5v14l11-7z" />
										</svg>
									) : (
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<title>Pause</title>
											<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
										</svg>
									)}
								</button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
