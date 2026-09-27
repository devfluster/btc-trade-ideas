# BTC Trade Ideas Dashboard Specification

## 1. Product Overview

**Product name:** BTC Trade Ideas  
**Purpose:** Provide a focused dashboard for analyzing Bitcoin futures markets and generating educational long/short trade ideas from public Binance Futures market data.

The application is an analysis assistant, not a brokerage or financial advisor. It must clearly communicate that trade ideas are informational and that users are responsible for their own decisions.

## 2. Primary Users

- Crypto traders monitoring BTC perpetual futures
- Short-term and intraday technical analysts
- Users who want a concise market snapshot without configuring a full trading terminal

## 3. Core User Experience

Users should be able to:

1. Open the dashboard and immediately see the current BTCUSDT market state.
2. Review current price, 24-hour change, volume, funding rate, and open interest when available.
3. Inspect a BTC price chart across supported timeframes.
4. Generate or refresh a technical futures trade idea.
5. Understand the suggested direction, confidence, entry zone, stop loss, take profit, and risk/reward ratio.
6. Refresh market data manually and understand when the data was last updated.
7. Use the dashboard comfortably on desktop and mobile screens.

## 4. Data Source

### Binance Futures Public API

The application uses publicly available Binance Futures endpoints and does not require user authentication, API keys, order permissions, or exchange account access.

Expected data includes:

- BTCUSDT mark or last price
- 24-hour price change percentage
- 24-hour high and low
- 24-hour volume
- Candlestick/Kline data
- Funding rate, when available
- Open interest, when available

The implementation should handle API errors, rate limits, delayed responses, empty responses, and temporary unavailability without crashing the dashboard.

## 5. Trade-Idea Generation

Trade ideas should be generated from the available market data using transparent technical signals rather than arbitrary text.

### Suggested inputs

- Current BTCUSDT price
- Recent candlestick closes and highs/lows
- Short- and medium-term trend direction
- Moving averages or trend filters
- Momentum indicator such as RSI
- Volatility measure such as ATR or recent trading range
- Support and resistance levels
- Volume behavior
- Funding rate and open interest when available

### Idea output

Each generated idea should include:

- Direction: Long, Short, or No clear setup
- Setup title
- Confidence score or confidence label
- Entry price or entry range
- Stop-loss price
- Take-profit price or target range
- Risk/reward ratio
- Timeframe
- Short rationale describing the signals used
- Timestamp of generation
- Data freshness indicator

### Safety behavior

- Do not present an idea as guaranteed or certain.
- Return “No clear setup” when signals conflict or data quality is insufficient.
- Avoid suggesting excessive leverage.
- Show a visible informational disclaimer near generated ideas.
- Never execute trades or submit orders.

## 6. Dashboard Sections

### Header

- Product name and BTC market identifier
- Binance data-source indicator
- Last updated timestamp
- Refresh action
- Theme-consistent status indicator

### Market overview

Display compact cards for:

- BTC price
- 24-hour change
- 24-hour high/low
- Volume
- Funding rate
- Open interest

Cards should show loading, stale, and unavailable states where relevant.

### Price chart

- Candlestick or line visualization using Binance Kline data
- Timeframe selector
- Responsive sizing
- Clear price axis and time axis
- Visual indication of the selected timeframe
- Graceful empty and error states

Initial supported timeframes should include:

- 5m
- 15m
- 1h
- 4h
- 1d

### Trade idea panel

- Generated setup direction
- Confidence
- Entry, stop, and target levels
- Risk/reward ratio
- Signal rationale
- Generate idea action
- Timestamp and data freshness

### Market context

Optional supporting information may include:

- Trend bias
- Momentum state
- Volatility state
- Key support and resistance levels
- Recent market structure

## 7. Visual Design Requirements

- Dark trading-terminal aesthetic
- High contrast and accessible text
- Neutral charcoal background with restrained green/red market colors
- Green for bullish or positive movement
- Red for bearish or negative movement
- Amber for warnings and data-quality states
- Use one primary sans-serif typeface with tabular numerals for prices
- Prefer clean cards, subtle borders, compact spacing, and clear hierarchy
- Avoid decorative elements that distract from market information
- Use semantic HTML and accessible labels for controls
- Maintain readable layouts at desktop, tablet, and mobile widths

## 8. Interaction Requirements

- Refresh controls must provide visible loading feedback.
- Timeframe changes must update the chart data and selected state.
- Generate-idea actions must provide feedback while calculations are running.
- Buttons must be keyboard accessible and have visible focus states.
- Interactive controls must have accessible names.
- Error messages must be understandable and actionable.
- Do not submit or trigger actions while an equivalent request is already pending.

## 9. Technical Requirements

- Next.js App Router
- TypeScript
- React client components only where interactivity is required
- Binance public Futures REST API for market data
- Responsive CSS using the project’s existing styling system
- No user API keys or exchange credentials
- No order execution functionality
- No client-side persistence required for the initial version

If server-side API proxying is introduced later, validate and cache requests appropriately to protect the public API and improve reliability.

## 10. Error and Empty States

The app must display clear states for:

- Initial loading
- Refreshing data
- Binance API unavailable
- Rate-limited requests
- Malformed or missing market data
- Chart with insufficient candles
- No clear trade setup
- Stale market data

The dashboard should retain the most recent valid data when a refresh fails, while clearly marking it as stale.

## 11. Non-Goals

The initial version will not include:

- Live trading or order placement
- User authentication
- Portfolio management
- Deposits or withdrawals
- Private Binance account data
- Automated alerts or notifications
- Backtesting engine
- Guaranteed predictions or financial advice

## 12. Acceptance Criteria

The application is complete when:

- The dashboard loads without requiring Binance credentials.
- BTC market data is retrieved from Binance public Futures APIs.
- Current price and core market metrics are displayed clearly.
- Users can switch chart timeframes.
- Users can refresh market data.
- Users can generate a clearly labeled trade idea.
- The idea includes entry, stop loss, target, direction, confidence, and rationale when sufficient data exists.
- The application handles loading, stale, error, and no-setup states.
- The interface is responsive and keyboard accessible.
- The product clearly states that ideas are informational and not financial advice.
- No orders are created or submitted by the application.

## 13. Future Enhancements

- WebSocket streaming for live price and candle updates
- Configurable indicator settings
- Multi-timeframe confirmation
- Historical signal tracking
- Backtesting and performance reporting
- Price alerts and browser notifications
- Saved watchlists
- Optional user accounts and personalized risk settings
- Additional markets such as ETHUSDT and major BTC-margined contracts

## 14. Disclaimer

BTC Trade Ideas provides market data analysis and educational trade ideas only. It does not provide financial advice, investment advice, or a recommendation to buy or sell any asset. Cryptocurrency futures are highly volatile and leveraged products that can result in significant losses, including losses exceeding the initial amount invested.

---

**Document status:** Initial product specification  
**Version:** 1.0
