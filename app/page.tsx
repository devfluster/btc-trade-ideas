import Dashboard from '@/components/dashboard'

async function getMarketData() {
  try {
    const [tickerResponse, klinesResponse] = await Promise.all([
      fetch('https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=BTCUSDT', { next: { revalidate: 30 } }),
      fetch('https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=1h&limit=32', { next: { revalidate: 30 } }),
    ])
    if (!tickerResponse.ok || !klinesResponse.ok) throw new Error('Binance unavailable')
    const ticker = await tickerResponse.json()
    const klines = await klinesResponse.json()
    return { ticker, klines, isLive: true }
  } catch {
    return { ticker: null, klines: [], isLive: false }
  }
}

export default async function Home() {
  const data = await getMarketData()
  return <Dashboard initialData={data} />
}

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'BTC Signal Desk | Futures Trade Ideas',
  description: 'Live Bitcoin futures market intelligence and trade ideas powered by Binance data.',
}
