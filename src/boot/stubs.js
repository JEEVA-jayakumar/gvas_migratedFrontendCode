import { boot } from 'quasar/wrappers'
import { h, resolveComponent, defineComponent, getCurrentInstance } from 'vue'
import _ from 'lodash'

export default boot(({ app }) => {
  window._ = _
  // Stub for q-search which is deprecated in Quasar 2
  app.component('q-search', defineComponent({
    props: ['modelValue', 'placeholder', 'float-label', 'clearable', 'color'],
    emits: ['update:modelValue'],
    setup(props, { emit, slots }) {
      const QInput = resolveComponent('q-input')
      const QIcon = resolveComponent('q-icon')
      return () => h(QInput, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (val) => emit('update:modelValue', val),
        placeholder: props.placeholder,
        label: props['float-label'],
        clearable: props.clearable !== undefined,
        color: props.color || 'primary',
        dense: true
      }, {
        prepend: () => h(QIcon, { name: 'search' })
      })
    }
  }))

  // Stub for q-autocomplete which is deprecated in Quasar 2
  app.component('q-autocomplete', defineComponent({
    props: ['debounce', 'min-characters'],
    emits: ['search', 'selected'],
    setup(props, { emit }) {
      return () => null
    }
  }))

  // Re-mapping legacy props for common components
  const wrapComponent = (name, extraProps = {}) => {
    const Original = resolveComponent(name)
    if (typeof Original === 'string') return // Component not found

    app.component(name, defineComponent({
      props: ['float-label', 'stack-label', 'inverted', ...Object.keys(extraProps)],
      setup(props, { attrs, slots }) {
        const mappedProps = { ...attrs }
        if (props['float-label']) mappedProps.label = props['float-label']
        if (props['stack-label']) mappedProps.label = props['stack-label']
        if (props.inverted !== undefined) mappedProps.filled = true // closest visual match

        return () => h(Original, mappedProps, slots)
      }
    }))
  }

  // We can't easily wrap already registered components this way because of infinite recursion if not careful.
  // Better to use a different name or handle it differently.
  // For now, let's focus on the explicitly deprecated ones.

  app.component('q-tab-pane', defineComponent({
    props: ['name'],
    setup(props, { slots }) {
      // In Q1, q-tab-pane was inside q-tabs.
      // In Q2, we use q-tab-panels.
      // This stub is a placeholder to prevent crashes.
      return () => h('div', { class: 'q-tab-pane' }, {
        default: () => slots.default && slots.default()
      })
    }
  }))

  app.component('q-item-main', defineComponent({
    setup(props, { slots }) {
      const QItemSection = resolveComponent('q-item-section')
      return () => h(QItemSection, null, {
        default: () => slots.default && slots.default()
      })
    }
  }))

  app.component('q-item-side', defineComponent({
    props: ['right', 'left', 'icon', 'avatar', 'image', 'letter'],
    setup(props, { slots }) {
      const QItemSection = resolveComponent('q-item-section')
      return () => h(QItemSection, {
        side: true,
        avatar: props.avatar !== undefined || props.image !== undefined
      }, {
        default: () => slots.default ? slots.default() : (props.icon ? h(resolveComponent('q-icon'), { name: props.icon }) : null)
      })
    }
  }))

  app.component('q-item-tile', defineComponent({
    props: ['label', 'sublabel', 'title', 'icon', 'stamp'],
    setup(props, { slots }) {
      // q-item-tile was used for various parts.
      // Often label, sublabel, or just a wrapper.
      let className = ''
      if (props.label !== undefined) className = 'q-item-label'
      if (props.sublabel !== undefined) className = 'q-item-label q-item-label--caption'

      return () => h('div', { class: className }, {
        default: () => slots.default && slots.default()
      })
    }
  }))

  app.component('q-card-title', defineComponent({
    setup(props, { slots }) {
      const QCardSection = resolveComponent('q-card-section')
      return () => h(QCardSection, { class: 'q-card__title' }, {
        default: () => slots.default && slots.default()
      })
    }
  }))

  app.component('q-card-main', defineComponent({
    setup(props, { slots }) {
      const QCardSection = resolveComponent('q-card-section')
      return () => h(QCardSection, null, {
        default: () => slots.default && slots.default()
      })
    }
  }))

  app.component('q-card-separator', defineComponent({
    setup() {
      return () => h(resolveComponent('q-separator'))
    }
  }))

  // Stub for q-modal which is deprecated in Quasar 2
  app.component('q-modal', defineComponent({
    props: ['modelValue', 'minimized', 'content-css'],
    emits: ['update:modelValue'],
    setup(props, { emit, slots }) {
      const QDialog = resolveComponent('q-dialog')
      return () => h(QDialog, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (val) => emit('update:modelValue', val),
        maximized: !props.minimized
      }, {
        default: () => slots.default && slots.default()
      })
    }
  }))

  // Stub for q-datetime which is deprecated in Quasar 2
  app.component('q-datetime', defineComponent({
    props: ['modelValue', 'placeholder', 'label', 'color', 'error'],
    emits: ['update:modelValue', 'blur'],
    setup(props, { emit }) {
      const QInput = resolveComponent('q-input')
      const QIcon = resolveComponent('q-icon')
      return () => h(QInput, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (val) => emit('update:modelValue', val),
        placeholder: props.placeholder,
        label: props.label,
        color: props.color || 'primary',
        error: props.error,
        onBlur: (evt) => emit('blur', evt),
        type: 'date',
        mask: 'YYYY/MM/DD',
        hint: 'YYYY/MM/DD'
      })
    }
  }))
})
