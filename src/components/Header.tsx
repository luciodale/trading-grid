export function Header() {
	return (
		<header className="app-header">
			<div className="header-content">
				<a href="https://koolcodez.com" className="logo-container">
					<img
						src="/kool-codez-inline-logo.svg"
						alt="Kool Codez"
						className="logo"
					/>
				</a>
				<div className="header-title">
					<h1>Options Trading Dashboard</h1>
					<p>Real-time streaming data with AG Grid</p>
				</div>
			</div>
		</header>
	);
}
