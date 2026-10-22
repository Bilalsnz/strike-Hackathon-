# Strike StressLab

**Know your risk before the move.** A responsive workspace for stress-testing hypothetical perpetual positions against market shocks.

## Features
- Long/short P&L simulator with entry price, notional size and leverage assumptions.
- Interactive price shocks from -50% to +50%, plus a scenario matrix.
- Public Strike market snapshot request with LIVE / STALE / DEMO status.
- Deterministic P&L calculations, no wallet connection or order execution.
- Responsive layout for mobile and desktop.

## Run
This is currently a zero-build static app. Open `index.html` directly, or deploy the repository to Vercel as a static site with no build command and `.` as the output directory.

## Market data
The app attempts to read Strike's public market endpoint: `https://api.strikefinance.org/price/v2/premiumIndex`. The browser may block the request because of network or CORS restrictions. When it fails, the app clearly labels its sample prices as demo data. Verify the endpoint and response schema against the official [Strike market price docs](https://docs.strikefinance.org/api/market/rest-api/prices) before relying on live data.

## Calculation notes
- Units = position notional / entry price.
- Long P&L = (scenario price - entry price) × units.
- Short P&L = (entry price - scenario price) × units.
- Scenario price = entry price × (1 + price shock).
- Estimated initial margin = notional / leverage.

P&L excludes fees, funding, slippage and exchange-specific adjustments. Leverage changes estimated margin, not dollar P&L for fixed notional. **Liquidation price is intentionally excluded** until Strike margin tiers, maintenance margin, margin mode and other required rules are implemented and validated.

## Safety
This is a hypothetical analysis tool, not financial advice. It does not connect a wallet or submit orders. Demo values are illustrative, not live prices.