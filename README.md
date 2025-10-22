# Trading Grid [DEMO](https://trading-grid.netlify.app/)

A real-time options trading data visualization tool built with React, TypeScript, and AG Grid.

## Features

- **Real-time Data Streaming**: Live options data with configurable update intervals
- **Interactive Grid**: Editable cells with AG Grid integration
- **Connection Status**: Real-time connection monitoring with pause/resume controls
- **Historical Updates**: Track of all data changes
- **Responsive Design**: Mobile-friendly layout with flexbox

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build
```

## Development

The app uses mock WebSocket data for development. Real-time updates simulate options trading data with configurable intervals for grid updates and row additions/removals.
