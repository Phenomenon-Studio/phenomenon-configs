import { getRouteApi, Link } from '@tanstack/react-router';
import { LayoutDashboardIcon, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const routeApi = getRouteApi('/_public/');

function Home() {
    const isAuthenticated = routeApi.useRouteContext({
        select(context) {
            return context.auth.isAuthenticated;
        },
    });

    return (
        <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/30">
            <section className="relative overflow-hidden">
                <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:mask-[linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
                <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-12 flex justify-center">
                            <img
                                src="/images/logo-black.svg"
                                alt="Phenomenon Logo"
                                className="h-16 w-auto dark:hidden"
                            />
                            <img
                                src="/images/logo-white.svg"
                                alt="Phenomenon Logo"
                                className="hidden h-16 w-auto dark:block"
                            />
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
                            Welcome to the
                            <span className="block bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                                Template Admin Panel
                            </span>
                        </h1>
                        <div className="mx-auto mt-8 max-w-4xl">
                            <p className="mb-8 text-xl leading-8 text-muted-foreground">
                                Vite, React, TypeScript, Tailwind CSS, Shadcn/ui, TanStack Router, TanStack Query, Ky,
                                TansTack Form, Zod, Lucide Icons
                            </p>
                        </div>
                        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {isAuthenticated ? (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-4 text-lg font-semibold"
                                    nativeButton={false}
                                    render={
                                        <Link to="/dashboard">
                                            Dashboard
                                            <LayoutDashboardIcon className="ml-2 h-5 w-5" />
                                        </Link>
                                    }
                                />
                            ) : (
                                <Button
                                    size="lg"
                                    className="group px-8 py-4 text-lg font-semibold"
                                    nativeButton={false}
                                    render={
                                        <Link to="/login">
                                            Login
                                            <LogIn className="ml-2 h-5 w-5" />
                                        </Link>
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export { Home };
