import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pulse Asia - События в Юго-Восточной Азии | Go2Asia',
  description: 'Календарь событий и мероприятий в Юго-Восточной Азии',
  openGraph: {
    title: 'Pulse Asia - События в ЮВА',
    description: 'Календарь событий и мероприятий',
    type: 'website',
  },
};

// SSG с revalidation каждые 5 минут (события часто меняются)
export const revalidate = 300;

export default async function PulsePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
  
  const events = await fetch(`${apiUrl}/v1/api/content/events`, {
    next: { revalidate: 300 },
  })
    .then((res) => res.json())
    .then((data) => data.items || [])
    .catch(() => []);

  return (
    <main>
      <h1>Pulse Asia</h1>
      <h2>События в Юго-Восточной Азии</h2>
      <ul>
        {events.map((event: any) => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            {event.startTime && (
              <p>{new Date(event.startTime).toLocaleDateString('ru-RU')}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

