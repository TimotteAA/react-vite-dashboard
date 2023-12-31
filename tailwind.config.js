/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,tsx,jsx}'],
    plugins: [],
    // tw全局类前缀
    prefix: 'tw-',
    // 暗黑模式，在html元素上添加类名
    darkMode: 'class',
    // 自定义断点
    theme: {
        screens: {
            xs: '480px',
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1400px',
        },
        fontFamily: {
            standard: 'var(--font-family-standard)',
            kaiti: 'var(--font-family-kaiti)',
            firacode: 'var(--font-family-firacode)',
        },
        extend: {
            transitionProperty: {
                padding: 'padding-left',
            },
        },
    },
    corePlugins: {
        preflight: false,
    },
};
