/**
 * Rielt.Market Asia - Listing Detail Page
 * Детальная страница объявления о жилье
 */

import { notFound } from 'next/navigation';
import { ListingDetailClient } from './ListingDetailClient';
import { mockListings } from '@/components/rielt';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ListingDetailPage({ params }: PageProps) {
  const listing = mockListings.find((l) => l.id === params.id);

  if (!listing) {
    notFound();
  }

  return <ListingDetailClient listing={listing} />;
}

