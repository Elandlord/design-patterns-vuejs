import { h, toRefs, watch, ref } from 'vue'

const withTabId = (content) => ({
  props: {
    tabId: {
      type: String,
      required: true
    }
  },
  ...content
})

export const TabContent = withTabId({
  setup(props, { slots }) {
    return () => h(slots.default)
  }
})

export const Tab = withTabId({
  setup(props, { slots }) {
      return () => h('div', h(slots.default))
  }
})

export const TabContainer = {
  props: {
    activeTabId: String
  },

  emits: ['update:activeTabId'],

  setup(props, { attrs, slots, emit }) {
    let content = ref()

    const { activeTabId } = toRefs(props)

    const $slots = slots.default()
    const tabs = $slots
        .filter(slot => slot.type === Tab)
        .map(tab => {
          return h(
              tab,
              {
                class: {
                  tab: true,
                  active: tab.props.tabId === activeTabId.value
                },
                onClick: () => {
                  emit('update:activeTabId', tab.props.tabId)
                }
              }
          )
        })

      watch(
          () => activeTabId.value,
          (newActiveTabId, oldActiveTabId) => {
              content = $slots.find(slot =>
                  slot.type === TabContent &&
                  slot.props.tabId === newActiveTabId
              );
          },
          {
              immediate: true,
          }
      );

    return () => [
      h(() => h('div', { class: 'tabs' }, tabs)),
      h(() => h('div', { class: 'content' }, content)),
    ]
  },
}

const style = `
.tabs {
  display: flex;
}

.tab {
  border: 1px solid;
  cursor: pointer;
  padding: 10px;
  width: 100px;
  text-align: center;
}

.tab:first-child {
  border-right: none;
}

.active {
  color: blue;
  border-bottom: 5px solid blue;
}

.content {
  margin: 10px;
  font-size: 1.5rem;
}
`
