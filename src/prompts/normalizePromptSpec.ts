//src/prompts/normalizePromptSpec.ts
/** Normalizer so your renderer can just use `input` and ignore legacy `inputs`. */
export function normalizePromptSpec(spec: PromptSpec) {
    return {
        ...spec,
        input: spec.input?.length ? spec.input : (spec.inputs ?? [])
    };
}
