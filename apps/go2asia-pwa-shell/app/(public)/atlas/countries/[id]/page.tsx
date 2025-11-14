import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
  
  const country = await fetch(`${apiUrl}/v1/api/content/countries/${id}`)
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

  if (!country) {
    return {
      title: 'Страна не найдена | Go2Asia',
    };
  }

  return {
    title: `${country.name} - Go2Asia Atlas`,
    description: country.description || `Информация о ${country.name}`,
    openGraph: {
      title: country.name,
      description: country.description || `Информация о ${country.name}`,
      images: country.flag ? [country.flag] : [],
      type: 'website',
    },
  };
}

export default async function CountryPage({ params }: PageProps) {
  const { id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
  
  const country = await fetch(`${apiUrl}/v1/api/content/countries/${id}`)
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

  if (!country) {
    notFound();
  }

  return (
    <main>
      <h1>{country.name}</h1>
      {country.description && <p>{country.description}</p>}
      {country.flag && <img src={country.flag} alt={`Флаг ${country.name}`} />}
    </main>
  );
}

