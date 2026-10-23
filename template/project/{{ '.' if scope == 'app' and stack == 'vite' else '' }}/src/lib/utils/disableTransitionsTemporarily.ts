export const disableTransitionsTemporarily = () => {
    const style = document.createElement('style');
    style.appendChild(
        document.createTextNode(`*,*::before,*::after{-webkit-transition:none!important;transition:none!important}`)
    );
    document.head.appendChild(style);

    return () => {
        window.getComputedStyle(document.body);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                style.remove();
            });
        });
    };
};
