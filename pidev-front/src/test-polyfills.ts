/** sockjs-client expects Node's `global` in some browser test bundles */
(window as unknown as { global: typeof globalThis }).global = globalThis;
