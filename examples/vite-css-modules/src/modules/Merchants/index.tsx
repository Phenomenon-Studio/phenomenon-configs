import { useSuspenseQuery } from '@tanstack/react-query';
import { getNameInitials } from '@/lib/utils/getNameInitials';
import { usersQueryOptions } from '@/services/users/queries';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import s from './styles.module.css';

function Merchants() {
    const { data } = useSuspenseQuery(usersQueryOptions());

    return (
        <>
            <MainLayoutHeader>
                <h1>Merchants</h1>
            </MainLayoutHeader>
            <ul className={s.list}>
                {data.users.map((user) => {
                    const fullName = `${user.firstName} ${user.lastName}`;

                    return (
                        <li key={user.id} className={s.item}>
                            {user.image ? (
                                <img className={s.avatar} src={user.image} alt={fullName} width={40} height={40} />
                            ) : (
                                <span className={s.avatar} aria-hidden={true}>
                                    {getNameInitials(fullName)}
                                </span>
                            )}
                            <div className={s.details}>
                                <span className={s.name}>{fullName}</span>
                                <span className={s.email}>{user.email}</span>
                            </div>
                            <span className={s.badge}>{user.role}</span>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

export { Merchants };
