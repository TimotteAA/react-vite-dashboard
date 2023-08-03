import { CSSProperties, FC, ReactNode } from 'react';

export const Logo: FC<{ style?: CSSProperties; children?: ReactNode }> = ({ style, children }) => {
    return <div style={style ?? {}}>{children}</div>;
};
