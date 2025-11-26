import type { Metadata } from 'next';
import { MyQuestsView } from './MyQuestsView';

export const metadata: Metadata = {
  title: 'Мои квесты - Quest Asia | Go2Asia',
  description: 'Управляйте своими активными и завершёнными квестами',
};

export default function MyQuestsPage() {
  return <MyQuestsView />;
}

