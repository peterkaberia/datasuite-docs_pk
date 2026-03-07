export function HomeCards({ items, columns = 3 }) {
  return (
    <div
      className="home-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <a key={item.href} href={item.href} className="home-card">
           {item.icon ? <i className={`codicon codicon-${item.icon}`}></i> : null}
          <h3 className="home-card-title">{item.title}</h3>
          <p>{item.description}</p>
        </a>
      ))}
    </div>
  )
}