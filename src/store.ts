import { createPersistStore } from './components/store/utils';

type CountStore = {
    count: number;
};

type CountStoreAction = {
    increment: (num: number) => void;
};

const countStore = createPersistStore<CountStore & CountStoreAction>(
    (set) => ({
        count: 0,
        increment: (num) => {
            set((state) => {
                state.count = state.count + num;
            });
        },
    }),
    {
        name: 'countStore',
    },
    {},
);

export { countStore };
