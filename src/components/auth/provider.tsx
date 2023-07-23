import { ReactNode, useEffect, useRef, useState } from 'react';
import { AuthContext } from './constants';
import { FetcherStore } from '../fetcher/store';
import { useFetcher } from '../fetcher/hooks';
import { IAuth } from './types';
import { config } from '@/config';
import { isNil } from 'lodash';

const Auth: FC<{ children?: ReactNode }> = ({ children }) => {
    const token = FetcherStore((state) => state.token);
    const fetcher = useFetcher();
    const [auth, setAuth] = useState<IAuth | null>(null);
    const { api, error } = config().auth ?? {};
    const requested = useRef(false);
    useEffect(() => {
        const getInfo = async () => {
            if (isNil(token) || isNil(api)) {
                setAuth(null);
            } else {
                try {
                    const { data } = await fetcher.get(api);
                    setAuth(data);
                } catch (err) {
                    setAuth(null);
                    !isNil(error) ? error() : console.log(err);
                }
            }
        };
        if (requested.current) getInfo();
        return () => {
            requested.current = true;
        };
    }, [token, api, error]);

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default Auth;
