// src/server/buildHandler.tsx

export function buildHandler<T, U>(
    func: (x: T) => Promise<U>,
    resultant: (x: { confirmed: boolean; value: U }) => void
) {
    return async (args: T) => {
        const result = await func(args);
        resultant({ confirmed: true, value: result });
    };
}
