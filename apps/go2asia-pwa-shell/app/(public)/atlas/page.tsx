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
    heroImage: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
  },
  {
    id: 'vietnam',
    name: 'Вьетнам',
    flag: '🇻🇳',
    placesCount: 189,
    description: 'Социалистическая Республика Вьетнам',
    heroImage: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
  },
  {
    id: 'indonesia',
    name: 'Индонезия',
    flag: '🇮🇩',
    placesCount: 312,
    description: 'Республика Индонезия',
    heroImage: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
  },
  {
    id: 'malaysia',
    name: 'Малайзия',
    flag: '🇲🇾',
    placesCount: 156,
    description: 'Высокий уровень жизни, отличное медобслуживание, программа ММ2Н',
    heroImage: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
  },
  {
    id: 'singapore',
    name: 'Сингапур',
    flag: '🇸🇬',
    placesCount: 98,
    description: 'Современный мегаполис, высокий уровень жизни, бизнес-хаб Азии',
    heroImage: 'https://images.pexels.com/photos/774691/pexels-photo-774691.jpeg',
  },
  {
    id: 'cambodia',
    name: 'Камбоджа',
    flag: '🇰🇭',
    placesCount: 87,
    description: 'Самые низкие цены в регионе, простое получение долгосрочных виз',
    heroImage: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
  },
  {
    id: 'laos',
    name: 'Лаос',
    flag: '🇱🇦',
    placesCount: 45,
    description: 'Тихая жизнь среди гор и джунглей, минимальный туристический поток',
    heroImage: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
  },
  {
    id: 'myanmar',
    name: 'Мьянма',
    flag: '🇲🇲',
    placesCount: 32,
    description: 'Аутентичная Азия, минимум иностранцев, очень низкие цены',
    heroImage: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
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
