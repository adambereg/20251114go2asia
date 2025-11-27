'use client';

import { FeedView } from '@/components/space/Feed';
import { mockPosts, currentUser } from '@/components/space/mockData';

export default function SpacePage() {
  return <FeedView posts={mockPosts} currentUser={currentUser} />;
}

