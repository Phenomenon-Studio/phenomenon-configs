import { useSuspenseQuery } from '@tanstack/react-query';
import { usersQueryOptions } from '@/services/users/queries';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

function Merchants() {
    const { data } = useSuspenseQuery(usersQueryOptions());

    return (
        <>
            <MainLayoutHeader>
                <h1 className="text-xl">Merchants</h1>
            </MainLayoutHeader>
            <ul className="flex flex-col gap-2">
                {data.users.map((user) => {
                    return (
                        <li key={user.id} className="flex items-center gap-4 rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                                <Avatar size="lg">
                                    <AvatarImage src={user.image} alt={`${user.firstName} ${user.lastName}`} />
                                    <AvatarFallback>
                                        {user.firstName[0]}
                                        {user.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium">
                                        {user.firstName} {user.lastName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                </div>
                            </div>
                            <Badge className="ml-auto" variant="outline">
                                {user.role}
                            </Badge>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

export { Merchants };
