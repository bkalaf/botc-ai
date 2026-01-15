// src/server/rangeFrom.tsx
export function rangeFrom(start: number, count: number): number[] {
    if (count <= 0) return [];
    return Array.from({ length: count }, (_, i) => start + i);
}
