import { RouteOption } from '@/components/router/types';

export const account: RouteOption = {
    id: 'account',
    menu: true,
    path: 'account',
    meta: { name: '账号设置' },
    children: [
        {
            id: 'account.index',
            menu: true,
            index: true,
            page: 'account/center/index',
        },
        {
            id: 'account.setting',
            menu: false,
            path: 'setting',
            page: 'account/setting/index',
        },
    ],
};
