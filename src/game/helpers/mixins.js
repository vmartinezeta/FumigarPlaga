export function mezclar(...mixins) {
    return mixins.reduce((base, mixin) => {
        return class extends base {
            constructor(...args) {
                super(...args);
                Object.assign(this, new mixin(...args));
            }
        }
    }, class {})
}