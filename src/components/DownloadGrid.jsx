export function DownloadGrid({ items }) {
  return (
    <div className="download-grid">
        {items.map((platform) => (
          <section key={platform.name} className="download-platform">
            <div className="download-platform-icon">{platform.icon}</div>

            {/* Container for multiple primary buttons */}
            <div className="download-primary-container">
              {platform.primaries.map((btn) => (
                <a key={btn.label} href={btn.href} className="download-primary-btn">
                  <i className="codicon codicon-download"></i>
                  <span>
                    <strong>{btn.label}</strong>
                    <small>{btn.subtext}</small>
                  </span>
                </a>
              ))}
            </div>

            <div className="download-links">
              {platform.links.map((row) => (
                <div key={row.label} className="download-row">
                  <span className="download-row-label">{row.label}</span>
                  <div className="download-tags">
                    {row.options.map((option) => (
                      <a key={option.label} href={option.href} className="download-tag">
                        {option.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
  )
}