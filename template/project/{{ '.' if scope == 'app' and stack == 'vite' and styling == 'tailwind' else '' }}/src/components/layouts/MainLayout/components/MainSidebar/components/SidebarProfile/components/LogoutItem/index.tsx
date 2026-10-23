import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { logoutMutationOptions } from '@/services/authExample/queries';
import { DropdownMenuItem } from '@/components/ui/DropdownMenu';

function LogoutItem() {
    const navigate = useNavigate();
    const { mutate: logout, isPending: isLogOutPending } = useMutation(logoutMutationOptions());

    return (
        <DropdownMenuItem
            onClick={() => {
                logout(undefined, {
                    onSuccess() {
                        navigate({
                            to: '/login',
                            ignoreBlocker: true,
                        });
                    },
                });
            }}
            disabled={isLogOutPending}
        >
            <LogOut />
            Log out
        </DropdownMenuItem>
    );
}

export { LogoutItem };
