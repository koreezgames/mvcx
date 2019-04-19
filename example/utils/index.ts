export const getUUID = (function() {
    let num = 0;
    return function(prefix: string = "") {
        const value = ++num < 10 ? "0" + num : num;
        return `${prefix}${value.toString()}`;
    };
})();
