import { useDeepCompareEffect } from 'ahooks';
import { useRef, DependencyList, EffectCallback } from 'react';

export const useDeepCompareUpdateEffect = (effect: EffectCallback, deps: DependencyList) => {
    // 是否首次渲染，默认为true
    const isFirst = useRef(false);

    // 深度比较依赖
    useDeepCompareEffect(() => {
        // 非初次渲染才会执行
        if (!isFirst.current) {
            return effect();
        }
        isFirst.current = false;
    }, deps);
};
