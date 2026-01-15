// src/server/joinWithCommaAndAnd.ts
export function joinWithCommasAndAnd(items: string[]): string {
    const len = items.length;

    if (len === 0) return '';
    if (len === 1) return items[0];
    if (len === 2) return `${items[0]} and ${items[1]}`;

    return `${items.slice(0, -1).join(', ')} and ${items[len - 1]}`;
}
