import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
  
  const article = await fetch(`${apiUrl}/v1/api/content/articles/${params.slug}`)
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

  if (!article) {
    return {
      title: 'Статья не найдена | Go2Asia',
    };
  }

  return {
    title: `${article.title} | Go2Asia Blog`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: article.coverImage ? [article.coverImage] : [],
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
  
  const article = await fetch(`${apiUrl}/v1/api/content/articles/${params.slug}`)
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

  if (!article) {
    notFound();
  }

  return (
    <main>
      <article>
        <h1>{article.title}</h1>
        {article.coverImage && (
          <img src={article.coverImage} alt={article.title} />
        )}
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </main>
  );
}

