export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://vaja-vocal-hub.preview.emergentagent.com'
  const now = new Date().toISOString()
  const routes = ['', '#about', '#music', '#voice', '#gallery', '#collabs', '#testimonials', '#book', '#contact']
  return routes.map((r) => ({
    url: `${base}/${r}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: r === '' ? 1 : 0.7,
  }))
}
