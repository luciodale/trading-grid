import {
	AllCommunityModule,
	type CellEditRequestEvent,
	type GridApi,
	ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { useCallback, useState } from "react";
import "./App.css";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { EditedValuesDisplay } from "./components/EditedValuesDisplay";
import { Header } from "./components/Header";
import { SelectedRowDetails } from "./components/SelectedRowDetails";
import { StreamingHistoricalUpdates } from "./components/StreamingHistoricalUpdates";
import { commonTheme } from "./config/agGridConfig";
import { OPTIONS_COLUMN_DEFINITIONS } from "./config/columnDefinitions";
import { useEditedValues } from "./hooks/useEditedValues";
import { useGridDataManager } from "./hooks/useGridDataManager";
import { useHistoricalUpdates } from "./hooks/useHistoricalUpdates";
import { useOptionsStream } from "./hooks/useOptionsStream";
import { useRowSelection } from "./hooks/useRowSelection";
import { useStreamingIntervals } from "./hooks/useStreamingIntervals";
import type { Option } from "./mocks/types";

ModuleRegistry.registerModules([AllCommunityModule]);

// Simulate saved selected row ID (could come from localStorage, API, etc.)
const SAVED_SELECTED_ROW_ID = "AAPL-3";

export function App() {
	const [updateInterval, setUpdateInterval] = useState(100);
	const [addRemoveInterval, setAddRemoveInterval] = useState(1000);

	const {
		options: socketOptions,
		isConnected,
		error,
		isPaused,
		togglePause,
	} = useOptionsStream();

	// Update streaming intervals when they change
	useStreamingIntervals(updateInterval, addRemoveInterval);

	const handleSaveIntervals = (
		newUpdateInterval: number,
		newAddRemoveInterval: number,
	) => {
		setUpdateInterval(newUpdateInterval);
		setAddRemoveInterval(newAddRemoveInterval);
	};
	const {
		rebaseOptionsWithEdits,
		updateEditedValue,
		handleClearEdits,
		editedValues,
	} = useEditedValues();

	// Rebase edited values on socket data
	const options = rebaseOptionsWithEdits(socketOptions);
	const [gridApi, setGridApi] = useState<GridApi<Option>>();

	const { selectedRow, handleRowSelected, handleSelection } = useRowSelection();
	const { updates, trackHistoricalUpdates } = useHistoricalUpdates();

	// Centralized grid data change handler for side effects / edge cases
	const handleGridDataChanges = useCallback(
		({
			newGridData,
			updated,
			deleted,
			added,
		}: {
			newGridData: Option[];
			updated: Option[];
			deleted: Option[];
			added: Option[];
		}) => {
			// Handle edit cleanup
			handleClearEdits(deleted);
			// Handle selection logic
			handleSelection(newGridData, gridApi, SAVED_SELECTED_ROW_ID);

			// Track historical updates using the hook's wrapper function
			trackHistoricalUpdates({ added, deleted, updated });
		},
		[handleClearEdits, handleSelection, gridApi, trackHistoricalUpdates],
	);

	useGridDataManager({
		options,
		gridApi,
		onGridDataChange: handleGridDataChanges,
	});

	// Handle cell edit requests in the grid
	const handleCellEditRequest = (event: CellEditRequestEvent<Option>) => {
		const { data, colDef, newValue } = event;
		if (data && colDef.field && newValue !== undefined) {
			updateEditedValue(data.id, colDef.field as keyof Option, newValue);
		}
	};

	const handleGridReady = (params: { api: GridApi }) => {
		setGridApi(params.api);
	};

	return (
		<div className="app-container">
			<Header />
			<div className="app-main">
				{/* Left side - Main grid */}
				<div className="grid-section">
					<ConnectionStatus
						isConnected={isConnected}
						error={error}
						isPaused={isPaused}
						onTogglePause={togglePause}
						updateInterval={updateInterval}
						addRemoveInterval={addRemoveInterval}
						onSaveIntervals={handleSaveIntervals}
					/>
					<div className="grid-container">
						<AgGridReact
							defaultColDef={{
								flex: 1,
							}}
							headerHeight={32}
							rowHeight={26}
							theme={commonTheme}
							suppressCellFocus
							getRowId={(params) => params.data.id}
							rowData={options}
							columnDefs={OPTIONS_COLUMN_DEFINITIONS}
							readOnlyEdit={true}
							onCellEditRequest={handleCellEditRequest}
							onGridReady={handleGridReady}
							rowSelection="single"
							onRowSelected={handleRowSelected}
							context={{
								editedValues,
							}}
						/>
					</div>
				</div>

				{/* Right side - Panels */}
				<div className="panels-section">
					<div className="panel">
						<div className="panel-header">Edited Values</div>
						<div className="panel-content">
							<EditedValuesDisplay editedValues={editedValues} />
						</div>
					</div>
					<div className="panel">
						<div className="panel-header">Selected Row</div>
						<div className="panel-content">
							<SelectedRowDetails selectedRow={selectedRow} />
						</div>
					</div>
					<div className="panel">
						<div className="panel-header">
							Streaming Updates ({updates.length}/100)
						</div>
						<div className="panel-content">
							<StreamingHistoricalUpdates updates={updates} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
