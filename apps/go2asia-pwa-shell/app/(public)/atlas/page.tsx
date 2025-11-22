import type { Metadata } from 'next';
import { AtlasHomeView } from '@/modules/atlas';

export const metadata: Metadata = {
  title: 'Atlas Asia - Путеводитель по Юго-Восточной Азии | Go2Asia',
  description: 'Исследуйте страны, города и места Юго-Восточной Азии с Go2Asia Atlas',
  openGraph: {
    title: 'Atlas Asia - Путеводитель по Юго-Восточной Азии',
    description: 'Исследуйте страны, города и места Юго-Восточной Азии',
    type: 'website',
  },
};

// Пока используем статичные данные.
// В дальнейшем сюда придёт SDK-слой (@go2asia/sdk) и серверные вызовы.
const countries = [
  {
    id: 'thailand',
    name: 'Таиланд',
    flag: '🇹🇭',
    placesCount: 245,
    description: 'Королевство Таиланд',
  },
  {
    id: 'vietnam',
    name: 'Вьетнам',
    flag: '🇻🇳',
    placesCount: 189,
    description: 'Социалистическая Республика Вьетнам',
  },
  {
    id: 'indonesia',
    name: 'Индонезия',
    flag: '🇮🇩',
    placesCount: 312,
    description: 'Республика Индонезия',
  },
];

const popularPlaces = [
  {
    id: '1',
    title: 'Большой дворец, Бангкок',
    city: 'Бангкок',
    country: 'Таиланд',
    rating: 4.8,
    reviewsCount: 1234,
  },
  {
    id: '2',
    title: 'Ханойская цитадель',
    city: 'Ханой',
    country: 'Вьетнам',
    rating: 4.6,
    reviewsCount: 892,
  },
  {
    id: '3',
    title: 'Храмовый комплекс Боробудур',
    city: 'Джокьякарта',
    country: 'Индонезия',
    rating: 4.9,
    reviewsCount: 2156,
  },
];

export default function AtlasPage() {
  return (
    <AtlasHomeView countries={countries} popularPlaces={popularPlaces} />
  );
}
