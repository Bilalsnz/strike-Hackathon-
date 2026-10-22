module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const symbol = typeof req.query.symbol === 'string' ? req.query.symbol : '';
  const upstream = new URL('https://api.strikefinance.org/price/v2/premiumIndex');
  if (symbol) upstream.searchParams.set('symbol', symbol);

  try {
    const response = await fetch(upstream.toString(), {
      headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(8000)
    });
    const body = await response.text();
    if (!response.ok) {
      return res.status(502).json({
        error: 'Strike price API returned HTTP ' + response.status,
        upstreamStatus: response.status
      });
    }

    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return res.status(502).json({ error: 'Strike price API returned invalid JSON' });
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).send(JSON.stringify({
      source: 'Strike Finance public price API',
      fetchedAt: Date.now(),
      data
    }));
  } catch (error) {
    return res.status(502).json({
      error: 'Unable to reach Strike Finance price API',
      detail: error && error.name === 'TimeoutError' ? 'Upstream request timed out' : 'Upstream request failed'
    });
  }
};
