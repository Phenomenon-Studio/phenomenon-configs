import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@/modules/Home';

export const Route = createFileRoute('/_public/')({
    component: Home,
});
