import { Link } from '@tanstack/react-router';
import { FileSearch, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

function NotFound() {
    return (
        <EmptyState Icon={FileSearch} title="404" description="Page Not Found">
            <Button
                nativeButton={false}
                render={
                    <Link to="/dashboard">
                        <HomeIcon aria-hidden />
                        Go back to the main page
                    </Link>
                }
            />
        </EmptyState>
    );
}

export { NotFound };
