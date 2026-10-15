export function VisuallyHidden({ children }: React.PropsWithChildren) {
    return <span className="sr-only">{children}</span>;
}
