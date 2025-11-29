import type { Metadata } from 'next';
import { WalletView } from '@/components/connect/Wallet';

export const metadata: Metadata = {
  title: 'Кошелёк | Connect Asia | Go2Asia',
  description: 'Управляйте балансом Points, G2A токенов и NFT бейджей',
};

export default function WalletPage() {
  return <WalletView />;
}

