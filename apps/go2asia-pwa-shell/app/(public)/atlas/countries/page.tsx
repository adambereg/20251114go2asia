import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Страны Юго-Восточной Азии | Go2Asia Atlas',
  description: 'Список всех стран Юго-Восточной Азии в Go2Asia Atlas',
  openGraph: {
    title: 'Страны Юго-Восточной Азии',
    description: 'Исследуйте страны Юго-Восточной Азии',
    type: 'website',
  },
};

// SSG с revalidation каждый час
export const revalidate = 3600;

export default async function CountriesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
  
  // Fetch countries from API
  const countries = await fetch(`${apiUrl}/v1/api/content/countries`, {
    next: { revalidate: 3600 },
  })
    .then((res) => res.json())
    .then((data) => data.items || [])
    .catch(() => []);

  return (
    <main>
      <h1>Страны Юго-Восточной Азии</h1>
      <ul>
        {countries.map((country: any) => (
          <li key={country.id}>
            <a href={`/atlas/countries/${country.id}`}>{country.name}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}

