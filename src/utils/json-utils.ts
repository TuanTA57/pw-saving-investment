export function sortJson(value: any): any {
    // Array → sort values
    if (Array.isArray(value)) {
        return value
            .map(sortJson)
            .sort((a, b) => {
                return JSON.stringify(a).localeCompare(JSON.stringify(b));
            });
    }
    // Object → sort keys
    if (value !== null && typeof value === "object") {
        const sorted: { [key: string]: any } = {};
        Object.keys(value)
            .sort()
            .forEach(key => {
                sorted[key] = sortJson(value[key]);
            });
        return sorted;
    }
    return value;
}