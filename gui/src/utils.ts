export const equal = (a: any, b: any): boolean => {
    return JSON.stringify(a) === JSON.stringify(b);
};

export const clone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};
