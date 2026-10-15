import { createFileRoute } from '@tanstack/react-router';
import { Dashboard } from '@/modules/Dashboard';

export const Route = createFileRoute('/_authenticated/dashboard/')({
    component: Dashboard,
});
