'use client';

import { SpaceLayout } from '@/components/space/Shared';
import { FeedView } from '@/components/space/Feed';
import { mockPosts, currentUser } from '@/components/space/mockData';

export default function CommunityFeedPage() {
  return (
    <SpaceLayout>
      <FeedView posts={mockPosts} currentUser={currentUser} />
    </SpaceLayout>
  );
}


