'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, Bell, ChartNoAxesCombined, ChevronDown, CircleHelp, Crosshair, Gauge, Menu, RefreshCw, Settings2, ShieldCheck, Sparkles, Target, TrendingDown, TrendingUp, Wallet, X } from 'lucide-react'

type Props = { initialData: { ticker: any; klines: any[]; isLive: boolean } }

const fallbackTicker = { lastPrice: '67184.20', priceChangePercent: '2.84', highPrice: '68420.00', lowPrice: '64892.10', volume: '28491.62', quoteVolume: '1912345678' }
const fallbackKlines = Array.from({ length: 32 }, (_, i) => { const close = 66000 + Math.sin(i / 2.5) * 1100 + i * 42; return [0, close, close + 180, close - 220, close] })

function money(value: number, digits = 2) { return new Intl.NumberFormat('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value) }
function timeAgo(date: Date) { return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }

export default function Dashboard({ initialData }: Props) {
  const [ticker, setTicker] = useState(initialData.ticker ?? fallbackTicker)
  const [klines, setKlines] = useState(initialData.klines.length ? initialData.klines : fallbackKlines)
  const [timeframe, setTimeframe] = useState('1H')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setLastUpdated(new Date())
  }, [])

  const price = Number(ticker.lastPrice)
  const change = Number(ticker.priceChangePercent)
  const levels = useMemo(() => ({ entry: price * 0.997, stop: price * 0.982, target: price * 1.034 }), [price])
  const chartPoints = klines.map((k: any) => Number(k[4] ?? k[1]))
  const min = Math.min(...chartPoints), max = Math.max(...chartPoints)
  const chartPath = chartPoints.map((v, i) => `${(i / (chartPoints.length - 1 || 1)) * 100},${92 - ((v - min) / (max - min || 1)) * 72}`).join(' ')

  async function refresh() {
    setRefreshing(true)
    try {
      const [t, k] = await Promise.all([
        fetch('https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=BTCUSDT').then(r => r.json()),
        fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=${timeframe === '4H' ? '4h' : timeframe === '15M' ? '15m' : '1h'}&limit=32`).then(r => r.json()),
      ])
      setTicker(t); setKlines(k); setLastUpdated(new Date())
    } finally { setRefreshing(false) }
  }

  return (
    <main className="min-h-screen bg-[#080b10] text-[#e9edf3] selection:bg-cyan-300/20">
      <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#080b10]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f59e0b] text-lg font-black text-[#111]">₿</div><div><div className="font-semibold tracking-tight">Signal Desk</div><div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">BTC / Futures intelligence</div></div></div>
          <nav className="hidden items-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.02] p-1 md:flex">{['Overview', 'Market', 'Trade ideas', 'Journal'].map((item, i) => <button key={item} className={`rounded-md px-4 py-2 text-xs font-medium ${i === 0 ? 'bg-white/[0.08] text-white' : 'text-slate-500 hover:text-slate-300'}`}>{item}</button>)}</nav>
          <div className="flex items-center gap-3"><div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />Binance Futures <span className="text-slate-700">|</span> {lastUpdated ? timeAgo(lastUpdated) : '—'}</div><button aria-label="Notifications" className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"><Bell size={16} /></button><button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 rounded-lg border border-white/10 p-2 text-slate-300"><div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-300 to-blue-600" /><ChevronDown size={13} /></button></div>
        </div>
      </header>
      {menuOpen && <div className="absolute right-5 top-[64px] z-30 w-40 rounded-xl border border-white/10 bg-[#121821] p-2 text-xs shadow-2xl"><button className="w-full rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-white/5">Account settings</button><button className="w-full rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-white/5">API connection</button></div>}
      <div className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300"><Sparkles size={14} /> Market pulse</div><h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Good morning, trader.</h1><p className="mt-2 text-sm text-slate-500">A clear read on BTC before your next move.</p></div><button onClick={refresh} disabled={refreshing} className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-50"><RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh data</button></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="BTC / USDT" value={`$${money(price)}`} change={`${change >= 0 ? '+' : ''}${change.toFixed(2)}%`} positive={change >= 0} icon={<ChartNoAxesCombined size={16} />} />
          <Stat label="24h high" value={`$${money(Number(ticker.highPrice))}`} sub="Resistance zone" icon={<ArrowUpRight size={16} />} />
          <Stat label="24h low" value={`$${money(Number(ticker.lowPrice))}`} sub="Support zone" icon={<ArrowDownRight size={16} />} />
          <Stat label="24h volume" value={`${money(Number(ticker.volume), 0)} BTC`} sub="Binance perpetual" icon={<Activity size={16} />} />
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.8fr)]">
          <section className="rounded-2xl border border-white/[0.08] bg-[#0d1219] p-5 lg:p-6"><div className="mb-5 flex items-center justify-between"><div><div className="flex items-center gap-2 text-sm font-medium text-slate-300"><span className="h-2 w-2 rounded-full bg-[#f59e0b]" />BTCUSDT Perpetual</div><div className="mt-1 text-xs text-slate-600">Binance Futures · Linear contract</div></div><div className="flex items-center gap-1 rounded-lg border border-white/10 p-1">{['15M', '1H', '4H'].map(tf => <button key={tf} onClick={() => setTimeframe(tf)} className={`rounded px-2.5 py-1 text-[10px] font-semibold ${timeframe === tf ? 'bg-white/10 text-white' : 'text-slate-600'}`}>{tf}</button>)}</div></div><div className="relative h-[280px] w-full overflow-hidden rounded-xl bg-[#0a0f15] p-2"><div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:20%_25%]" /><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full px-2 py-5"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#22d3ee" stopOpacity=".18" /><stop offset="1" stopColor="#22d3ee" stopOpacity="0" /></linearGradient></defs><polyline points={`${chartPath} 100,100 0,100`} fill="url(#fill)" stroke="none" /><polyline points={chartPath} fill="none" stroke="#39d8e8" strokeWidth="0.8" vectorEffect="non-scaling-stroke" /></svg><div className="absolute right-3 top-3 text-[10px] text-slate-600">${money(max)}</div><div className="absolute right-3 bottom-3 text-[10px] text-slate-600">${money(min)}</div><div className="absolute bottom-3 left-3 rounded bg-cyan-300/10 px-2 py-1 text-[10px] text-cyan-300">${money(price)}</div></div><div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs"><span className="text-slate-600">Last candle · {lastUpdated ? timeAgo(lastUpdated) : '—'}</span><span className="flex items-center gap-1.5 text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Live market data</span></div></section>
          <section className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-[radial-gradient(circle_at_90%_0%,rgba(34,211,238,.12),transparent_42%),#0d1219] p-5 lg:p-6"><div className="flex items-start justify-between"><div><div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-cyan-300"><Crosshair size={14} /> Generated idea</div><h2 className="text-xl font-semibold text-white">Momentum long</h2></div><span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">HIGH CONVICTION</span></div><p className="mt-3 text-sm leading-6 text-slate-400">Price is holding above the session VWAP with buyers absorbing the latest pullback. Momentum favors a continuation toward the prior day high.</p><div className="mt-6 grid grid-cols-3 gap-2"><Level label="Entry" value={`$${money(levels.entry)}`} /><Level label="Stop loss" value={`$${money(levels.stop)}`} tone="red" /><Level label="Take profit" value={`$${money(levels.target)}`} tone="green" /></div><div className="mt-6 rounded-xl border border-white/[0.07] bg-black/15 p-3.5"><div className="mb-3 flex items-center justify-between text-[11px] text-slate-500"><span>Signal strength</span><span className="font-semibold text-cyan-300">78 / 100</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[78%] rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400" /></div><div className="mt-3 flex justify-between text-[10px] text-slate-600"><span>Trend aligned</span><span>RSI 61.4</span><span>Funding +0.008%</span></div></div><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 py-3 text-xs font-semibold text-[#071116] transition hover:bg-cyan-200"><Target size={15} /> View execution plan</button></section>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3"><Insight icon={<Gauge />} title="Market regime" value="Trending up" detail="ADX 28.6 · Strong" color="cyan" /><Insight icon={<ShieldCheck />} title="Risk profile" value="Moderate" detail="Suggested leverage 3–5x" color="amber" /><Insight icon={<Wallet />} title="Open interest" value="$12.84B" detail="+4.7% in 24 hours" color="violet" /></div>
        <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5 text-[10px] leading-5 text-slate-600"><span className="flex items-center gap-2"><CircleHelp size={13} /> Ideas are algorithmic observations, not financial advice. Trade responsibly.</span><span>Data source: Binance public API</span></div>
      </div>
    </main>
  )
}

function Stat({ label, value, change, positive, sub, icon }: any) { return <div className="rounded-2xl border border-white/[0.08] bg-[#0d1219] p-4"><div className="flex items-center justify-between text-[11px] uppercase tracking-[0.13em] text-slate-600"><span>{label}</span><span className="text-slate-500">{icon}</span></div><div className="mt-3 flex items-end justify-between"><div className="text-2xl font-semibold tracking-[-0.04em] text-white">{value}</div>{change && <span className={`mb-1 text-xs font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>{change}</span>}</div>{sub && <div className="mt-2 text-[11px] text-slate-600">{sub}</div>}</div> }
function Level({ label, value, tone }: any) { return <div className="rounded-lg border border-white/[0.07] bg-black/15 p-3"><div className="text-[10px] uppercase tracking-wider text-slate-600">{label}</div><div className={`mt-1 text-sm font-medium ${tone === 'red' ? 'text-red-300' : tone === 'green' ? 'text-emerald-300' : 'text-white'}`}>{value}</div></div> }
function Insight({ icon, title, value, detail, color }: any) { const colors: any = { cyan: 'text-cyan-300 bg-cyan-300/10', amber: 'text-amber-300 bg-amber-300/10', violet: 'text-violet-300 bg-violet-300/10' }; return <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0d1219] p-4"><div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors[color]}`}>{icon}</div><div><div className="text-[10px] uppercase tracking-wider text-slate-600">{title}</div><div className="mt-0.5 text-sm font-semibold text-white">{value}</div><div className="mt-0.5 text-[11px] text-slate-600">{detail}</div></div></div> }
