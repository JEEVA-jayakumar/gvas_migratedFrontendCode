# Migration Guide: Legacy (Vue 2) to Migrated (Vue 3)

This document outlines the key differences between the legacy `web_frontend-2` project (Vue 2 / Quasar 0.16) and the migrated project (Vue 3 / Quasar 2). It is intended for developers familiar with the legacy codebase to quickly adapt to the new structure and standards.

## 1. High-Level Overview

The project has been upgraded to leverage the performance and features of **Vue 3** and **Quasar 2**. While we have modernized the underlying framework, a strict **"no improvements" policy** was followed to ensure 100% functional and visual parity with the legacy system.

| Feature | Legacy (`web_frontend-2`) | Migrated (Current) |
| :--- | :--- | :--- |
| **Vue Version** | 2.5.x | 3.4.x |
| **Quasar Version** | 0.16.x | 2.18.x |
| **Router** | Vue Router 3 | Vue Router 4 |
| **Store** | Vuex 3 | Vuex 4 |
| **Validation** | Vuelidate 0.7 | Vuelidate 2 (@vuelidate/core) |

---

## 2. Project Structure Changes

The directory structure remains mostly similar, with a few key changes:

*   **Plugins to Boot**: The `src/plugins/` directory has been renamed to `src/boot/`. These files are now "boot files" and are initialized in `quasar.conf.js`.
*   **Statics to Public**: Global static assets previously in `src/statics/` are now handled in the `public/` or `src/assets/` directories depending on their use case.
*   **Babel & Config**: `.babelrc` and `quasar.conf.js` have been updated to support Vue 3 and Webpack 5.

---

## 3. Technical Migration Details

### A. Vue Components (SFC)
While the Options API (data, methods, computed) is still largely used for parity, there are minor changes in how internal utilities are accessed.

**Legacy (Vue 2):**
```javascript
export default {
  data() { return { ... } },
  validations: { ... }
}
```

**Migrated (Vue 3):**
```javascript
import { useVuelidate } from '@vuelidate/core'

export default {
  setup() {
    return { v$: useVuelidate() } // Required for Vuelidate 2
  },
  data() { return { ... } },
  validations: { ... }
}
```

### B. Vuelidate Changes
Vuelidate 2 (@vuelidate/core) replaces Vuelidate 0.7. It now uses the Composition API via `useVuelidate()`.

*   **Setup**: Must include `setup() { return { v$: useVuelidate() } }` in components.
*   **Accessing validation**: Use `this.v$` instead of `this.$v`.
*   **Template**: Use `v$.formData.email.$error` instead of `$v.formData.email.$error`.
*   **Method**: Call `this.v$.$touch()` instead of `this.$v.$touch()`.

### C. Vuex Store
The store initialization has changed to support Vue 3.

*   **Legacy**: `export default new Vuex.Store({ modules: { ... } })`
*   **Migrated**: `export default createStore({ modules: { ... } })`

### D. Quasar Component Parity
To maintain the legacy "flat" look, modern Quasar 2 styles like `outlined`, `filled`, or `dense` are generally **avoided** unless they were present in the original.

| Legacy Prop/Component | Migrated Equivalent |
| :--- | :--- |
| `float-label="Email"` | `label="Email"` |
| `gutter-md` (class) | `q-col-gutter-md` (class) |
| `q-alert` | `q-banner` |
| `q-search` | `q-input` |
| `q-card-main` | `q-card-section` |
| `:selected.sync` | `v-model:selected` |
| `:pagination.sync` | `v-model:pagination` |
| `q-tab-pane` | `q-tab-panel` |
| `slot="body-cell-name"` | `v-slot:body-cell-name` |

### E. Global Properties
Global variables and functions are no longer attached to `Vue.prototype`.

*   **Legacy**: `Vue.prototype.$myVar = 'value'`
*   **Migrated**: `app.config.globalProperties.$myVar = 'value'` (defined in `src/boot/GlobalVariables.js`)

### F. Routing & Lifecycle
*   **Initialization**: Now uses `createRouter` and `createWebHashHistory`.
*   **Navigation**: Same usage (`this.$router.push`), but ensures compatibility with Vue Router 4.
*   **Layout**: The `<router-view>` often requires `:key="$route.fullPath"` to prevent navigation-related crashes in Quasar 2.
*   **Lifecycle**: Note that `destroyed` is now `unmounted`, and `beforeDestroy` is now `beforeUnmount`.

---

## 4. Key Parity Rules & "No Improvements"
To ensure the transition is seamless for users, we adhere to these rules:

1.  **Visual Identity**: Keep the `#531b64` sidebar color and flat input styles.
2.  **No Modernization**: Do not add `elevated` to headers or `rounded` to buttons unless the legacy version had them.
3.  **Loading States**: Always use `this.$q.loading.show()` during API calls.
4.  **Table Alignment**: Text columns in `QTable` should generally be `align: "left"`.

---

## 5. Troubleshooting Common Issues

*   **`TypeError: Cannot read properties of null (reading 'parentNode')`**: Usually happens during route transitions. Ensure `router-view` has a `:key`.
*   **`TypeError: ... (reading 'subTree')`**: Check `QTable` body slots. Content inside `v-slot:body-cell` must be wrapped in a `<template>` tag, not directly on `<q-td>`.
*   **Missing End Tags**: Vue 3 is stricter. Ensure all tags (especially `<q-td>`, `<q-tr>`) are explicitly closed.
