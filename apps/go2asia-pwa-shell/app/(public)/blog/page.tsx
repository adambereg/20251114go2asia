import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Asia - Статьи о путешествиях в ЮВА | Go2Asia',
  description: 'Читайте статьи о путешествиях, культуре и жизни в Юго-Восточной Азии',
  openGraph: {
    title: 'Blog Asia - Статьи о путешествиях',
    description: 'Читайте статьи о путешествиях в Юго-Восточной Азии',
    type: 'website',
  },
};

// SSG с revalidation каждый час
export const revalidate = 3600;

export default async function BlogPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
  
  const articles = await fetch(`${apiUrl}/v1/api/content/articles`, {
    next: { revalidate: 3600 },
  })
    .then((res) => res.json())
    .then((data) => data.items || [])
    .catch(() => []);

  return (
    <main>
      <h1>Blog Asia</h1>
      <ul>
        {articles.map((article: any) => (
          <li key={article.id}>
            <a href={`/blog/${article.slug}`}>
              <h2>{article.title}</h2>
              {article.excerpt && <p>{article.excerpt}</p>}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

