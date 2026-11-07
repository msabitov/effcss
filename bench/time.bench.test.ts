import { describe, test } from 'vitest';
import { context } from '../src/index';

const EFFCSS_KEY_ATTR = 'data-effcss-key';

// How many rules
const COUNTS = [100, 1000, 5000];

// Each variant creates `count` className rules inside the given context.
type Variant = {
    name: string;
    create: (ctx: ReturnType<typeof context>, count: number) => void;
};

const cls: Record<'utility' | 'pseudo' | 'media', Variant[]> = {
    utility: [
        {
            name: 'object arg',
            create: (ctx, count) => {
                for (let i = 0; i < count; i++) ctx.className({ padding: `${i}px` })();
            }
        },
        {
            name: 'function arg',
            create: (ctx, count) => {
                for (let i = 0; i < count; i++) ctx.className(() => ({ padding: `${i}px` }))();
            }
        }
    ],
    pseudo: [
        {
            name: 'object arg',
            create: (ctx, count) => {
                for (let i = 0; i < count; i++)
                    ctx.className({
                        padding: `${i}px`,
                        '&:hover': { color: '#eff' },
                        '&:focus': { outline: 'none' }
                    })();
            }
        },
        {
            name: 'function arg',
            create: (ctx, count) => {
                for (let i = 0; i < count; i++)
                    ctx.className(() => ({
                        padding: `${i}px`,
                        '&:hover': { color: '#eff' },
                        '&:focus': { outline: 'none' }
                    }))();
            }
        }
    ],
    media: [
        {
            name: 'object arg',
            create: (ctx, count) => {
                for (let i = 0; i < count; i++)
                    ctx.className({
                        padding: `${i}px`,
                        '@media (min-width: 768px)': { padding: `${i + 1}px` }
                    })();
            }
        },
        {
            name: 'function arg',
            create: (ctx, count) => {
                for (let i = 0; i < count; i++)
                    ctx.className(() => ({
                        padding: `${i}px`,
                        '@media (min-width: 768px)': { padding: `${i + 1}px` }
                    }))();
            }
        }
    ]
};

// prebuild the SSR <style> blocks
const buildServerHtml = (key: string, variant: Variant, count: number) => {
    const server = context({ key });
    variant.create(server, count);
    const html = server.serialize();
    server.dispose();
    return html;
};

// Remove only the <style> nodes owned by a given context key.
const cleanHead = (key: string) => {
    document.head.querySelectorAll(`style[${EFFCSS_KEY_ATTR}^="${key}"]`).forEach((el) => el.remove());
};

// Build a single bench registration for a (category, variant) pair.
const makeBench = (bench: any, mode: 'csr' | 'ssr', category: string, variant: Variant, count: number) => {
    const slug = variant.name.replace(/[^a-z0-9]/gi, '');
    const key = `${mode}-${category}-${slug}-${count}`;
    const ssrHtml = mode === 'ssr' ? buildServerHtml(key, variant, count) : null;
    let ctx: ReturnType<typeof context>;
    return bench(
        `${category}/${variant.name}`,
        {
            beforeEach: () => {
                if (ssrHtml) {
                    cleanHead(key);
                    document.head.insertAdjacentHTML('beforeend', ssrHtml);
                }
                ctx = context({ key });
            },
            afterEach: () => {
                ctx.dispose();
            }
        },
        () => {
            variant.create(ctx, count);
        }
    );
};

const testVariants = (tests: Record<string, Variant[]>) => {
    for (const mode of ['csr', 'ssr'] as const) {
        describe(mode, () => {
            for (const count of COUNTS) {
                test(`${count} rules`, async ({ bench }) => {
                    const registrations = Object.entries(tests).flatMap(([category, variants]) =>
                        variants.map((variant) => makeBench(bench, mode, category, variant, count))
                    );
                    await bench.compare(...registrations);
                });
            }
        });
    }
};

testVariants(cls);
