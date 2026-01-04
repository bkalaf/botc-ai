// src/store/middleware/dynamic-middleware.ts
import type { Middleware } from '@reduxjs/toolkit';

export type DynamicMiddlewareKey = string;

export interface DynamicMiddlewareRegistry {
    middleware: Middleware;
    register: (key: DynamicMiddlewareKey, middleware: Middleware) => void;
    unregister: (key: DynamicMiddlewareKey) => void;
    has: (key: DynamicMiddlewareKey) => boolean;
    keys: () => DynamicMiddlewareKey[];
}

export const createDynamicMiddlewareRegistry = (): DynamicMiddlewareRegistry => {
    const registry = new Map<DynamicMiddlewareKey, Middleware>();

    const middleware: Middleware = (api) => (next) => (action) => {
        if (registry.size === 0) {
            return next(action);
        }

        const chain = Array.from(registry.values()).map((registered) => registered(api));
        const composed = chain.reduceRight((nextFn, current) => current(nextFn), next);

        return composed(action);
    };

    return {
        middleware,
        register: (key, nextMiddleware) => {
            registry.set(key, nextMiddleware);
        },
        unregister: (key) => {
            registry.delete(key);
        },
        has: (key) => registry.has(key),
        keys: () => Array.from(registry.keys())
    };
};
