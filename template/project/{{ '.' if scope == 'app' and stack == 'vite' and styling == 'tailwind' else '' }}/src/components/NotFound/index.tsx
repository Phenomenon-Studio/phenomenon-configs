import { Link } from '@tanstack/react-router';
import { FileSearch, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/Empty';

function NotFound() {
    return (
        <Empty>
            <EmptyHeader className="max-w-2xl">
                <EmptyMedia variant="icon">
                    <FileSearch />
                </EmptyMedia>
                <EmptyTitle className="text-4xl">404</EmptyTitle>
                <EmptyDescription className="text-xl">Page Not Found</EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="max-w-2xl">
                <Button
                    nativeButton={false}
                    render={
                        <Link to="/dashboard">
                            <HomeIcon aria-hidden />
                            Go back to the main page
                        </Link>
                    }
                />
            </EmptyContent>
        </Empty>
    );
}

export { NotFound };
