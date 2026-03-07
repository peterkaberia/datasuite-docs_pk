export function DownloadGrid({ items }) {
  return (
    <>
    <p className="download-page-lead">
        Free and built on open source. Integrated modular applications and secure data pipelines.
    </p>
    <div className="download-grid">
      {items.map((platform) => (
        <section key={platform.name} className="download-platform">
          <div className="download-platform-icon">{platform.icon}</div>

          <a href={platform.primary.href} className="download-primary-btn">
            <span className="download-primary-icon">↓</span>
            <span>
              <strong>{platform.primary.label}</strong>
              <small>{platform.primary.subtext}</small>
            </span>
          </a>

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
    </>
  )
}