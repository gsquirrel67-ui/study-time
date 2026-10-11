import { useEffect, useMemo, useState } from 'react'

const defaultSites = [
  { id: 1, name: 'Google', url: 'https://google.com', category: 'Search' },
  { id: 2, name: 'Wikipedia', url: 'https://wikipedia.org', category: 'Knowledge' },
  { id: 3, name: 'YouTube', url: 'https://youtube.com', category: 'Videos' },
  { id: 4, name: 'GitHub', url: 'https://github.com', category: 'Development' },
]

const defaultGames = [
  {
    id: 1,
    name: 'Memory Match',
    description: 'A simple memory challenge',
    thumbnail_url: '',
    html: `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: Arial, sans-serif;
        background: #020817;
        color: white;
      }
      .wrap {
        text-align: center;
        padding: 20px;
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(4, 64px);
        gap: 12px;
        margin-top: 20px;
      }
      .card {
        width: 64px;
        height: 64px;
        border-radius: 10px;
        background: #1e293b;
        border: 1px solid #475569;
        color: white;
        font-size: 28px;
        cursor: pointer;
      }
      .card.flipped {
        background: #22c55e;
      }
      button {
        background: #8b5cf6;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 18px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h2>Memory Match</h2>
      <button onclick="location.reload()">Restart</button>
      <div id="cards" class="cards"></div>
    </div>
    <script>
      const emojis = ['🍎', '🍊', '🍋', '🍇', '🍉', '🍒'];
      const cards = [...emojis, ...emojis];
      let picked = [];
      let matched = 0;

      function shuffle(list) {
        for (let i = list.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [list[i], list[j]] = [list[j], list[i]];
        }
        return list;
      }

      function render() {
        const container = document.getElementById('cards');
        const shuffled = shuffle([...cards]);
        container.innerHTML = '';

        shuffled.forEach((emoji, index) => {
          const button = document.createElement('button');
          button.className = 'card';
          button.textContent = '?';
          button.dataset.value = emoji;
          button.dataset.index = index;
          button.onclick = () => {
            if (button.classList.contains('flipped') || picked.length >= 2) return;
            button.textContent = emoji;
            button.classList.add('flipped');
            picked.push(button);

            if (picked.length === 2) {
              const [a, b] = picked;
              if (a.dataset.value === b.dataset.value) {
                setTimeout(() => {
                  a.disabled = true;
                  b.disabled = true;
                  a.style.opacity = '0.6';
                  b.style.opacity = '0.6';
                  matched += 2;
                  picked = [];
                  if (matched === cards.length) {
                    alert('You won!');
                  }
                }, 400);
              } else {
                setTimeout(() => {
                  a.textContent = '?';
                  b.textContent = '?';
                  a.classList.remove('flipped');
                  b.classList.remove('flipped');
                  picked = [];
                }, 700);
              }
            }
          };
          container.appendChild(button);
        });
      }

      render();
    </script>
  </body>
</html>`,
  },
]

const STORAGE_KEYS = {
  sites: 'studytime_sites',
  games: 'studytime_games',
}

function App() {
  const [sites, setSites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.sites)
      return saved ? JSON.parse(saved) : defaultSites
    } catch {
      return defaultSites
    }
  })

  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.games)
      return saved ? JSON.parse(saved) : defaultGames
    } catch {
      return defaultGames
    }
  })

  const [query, setQuery] = useState('')
  const [isAdmin, setIsAdmin] = useState(true)
  const [playing, setPlaying] = useState(null)

  const [siteName, setSiteName] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [siteCategory, setSiteCategory] = useState('')

  const [gameName, setGameName] = useState('')
  const [gameDescription, setGameDescription] = useState('')
  const [gameHtml, setGameHtml] = useState('')
  const [gameThumbnail, setGameThumbnail] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sites, JSON.stringify(sites))
  }, [sites])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.games, JSON.stringify(games))
  }, [games])

  const filteredSites = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sites

    return sites.filter((site) => {
      const name = (site.name || '').toLowerCase()
      const url = (site.url || '').toLowerCase()
      const category = (site.category || '').toLowerCase()
      return name.includes(q) || url.includes(q) || category.includes(q)
    })
  }, [sites, query])

  const addSite = (e) => {
    e.preventDefault()
    if (!siteName.trim() || !siteUrl.trim()) return

    const newSite = {
      id: Date.now(),
      name: siteName.trim(),
      url: siteUrl.trim(),
      category: siteCategory.trim(),
    }

    setSites((prev) => [newSite, ...prev])
    setSiteName('')
    setSiteUrl('')
    setSiteCategory('')
  }

  const deleteSite = (siteId) => {
    setSites((prev) => prev.filter((site) => site.id !== siteId))
  }

  const addGame = (e) => {
    e.preventDefault()
    if (!gameName.trim() || !gameHtml.trim()) return

    const newGame = {
      id: Date.now(),
      name: gameName.trim(),
      description: gameDescription.trim(),
      thumbnail_url: gameThumbnail.trim(),
      html: gameHtml.trim(),
    }

    setGames((prev) => [newGame, ...prev])
    setGameName('')
    setGameDescription('')
    setGameHtml('')
    setGameThumbnail('')
  }

  const deleteGame = (gameId) => {
    setGames((prev) => prev.filter((game) => game.id !== gameId))
  }

  const openSite = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (playing) {
    return (
      <div className="game-screen">
        <div className="topbar">
          <button className="back-btn" onClick={() => setPlaying(null)}>
            ← Back
          </button>
          <h3>{playing.name}</h3>
          <span className="running-label">Running locally in a sandbox</span>
        </div>

        <iframe
          title={playing.name}
          srcDoc={playing.html}
          sandbox="allow-scripts allow-pointer-lock allow-popups"
          allow="fullscreen"
          className="game-frame"
        />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="top-header">
        <div className="brand-wrap">
          <div className="brand-icon">S</div>
          <div>
            <h1>Home - Classroom</h1>
            <p>Search the web and open sites directly</p>
          </div>
        </div>

        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sites..."
          />
        </div>
      </header>

      <main className="content">
        <section className="panel">
          <div className="section-header">
            <h2>Saved Sites</h2>
            <span>{sites.length} saved</span>
          </div>

          <form onSubmit={addSite} className="inline-form">
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Site name"
            />
            <input
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://example.com"
            />
            <input
              value={siteCategory}
              onChange={(e) => setSiteCategory(e.target.value)}
              placeholder="Category"
            />
            <button type="submit">Add site</button>
          </form>

          {filteredSites.length === 0 ? (
            <div className="empty-box">
              <p>No sites match your search.</p>
            </div>
          ) : (
            <div className="card-grid">
              {filteredSites.map((site) => {
                const host = (() => {
                  try {
                    const url = /^https?:\/\//i.test(site.url)
                      ? site.url
                      : `https://${site.url}`
                    return new URL(url).hostname.replace(/^www\./, '')
                  } catch {
                    return site.url
                  }
                })()

                return (
                  <div key={site.id} className="site-card">
                    <div className="site-top">
                      <div className="site-badge">🌐</div>
                      <button
                        className="delete-btn"
                        onClick={() => deleteSite(site.id)}
                        title="Remove site"
                      >
                        ✕
                      </button>
                    </div>

                    <button className="site-main" onClick={() => openSite(site.url)}>
                      <h3>{site.name}</h3>
                      <p>{host}</p>
                      {site.category && <span>{site.category}</span>}
                    </button>

                    <div className="click-hint">Open</div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="section-header">
            <h2>Games</h2>
            <span>{games.length} added</span>
          </div>

          {isAdmin && (
            <form onSubmit={addGame} className="game-form">
              <div className="form-row">
                <input
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="Game name"
                />
                <input
                  value={gameDescription}
                  onChange={(e) => setGameDescription(e.target.value)}
                  placeholder="Description"
                />
              </div>

              <input
                value={gameThumbnail}
                onChange={(e) => setGameThumbnail(e.target.value)}
                placeholder="Thumbnail URL (optional)"
              />

              <textarea
                rows={8}
                value={gameHtml}
                onChange={(e) => setGameHtml(e.target.value)}
                placeholder="<html>...your game code...</html>"
              />

              <button type="submit">Save game</button>
            </form>
          )}

          {games.length === 0 ? (
            <div className="empty-box">
              <p>No games yet — add one above with its HTML code.</p>
            </div>
          ) : (
            <div className="card-grid">
              {games.map((game) => (
                <div key={game.id} className="game-card">
                  <div className="game-top">
                    {game.thumbnail_url ? (
                      <img src={game.thumbnail_url} alt={game.name} />
                    ) : (
                      <div className="game-icon">🎮</div>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => deleteGame(game.id)}
                      title="Remove game"
                    >
                      ✕
                    </button>
                  </div>

                  <button className="site-main" onClick={() => setPlaying(game)}>
                    <h3>{game.name}</h3>
                    {game.description && <p>{game.description}</p>}
                  </button>

                  <div className="play-hint">Play</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
