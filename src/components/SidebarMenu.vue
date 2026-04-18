<template>
  <q-list padding class="menu-list q-px-sm">
      <template v-for="menu in filteredMenus" :key="menu.id">
        <!-- Main Item without Sub-items -->
        <q-item
          v-if="!menu.subItems || menu.subItems.length === 0"
          :to="menu.to"
          clickable
          v-ripple
          class="menu-item q-mb-xs"
          active-class="menu-item-active"
        >
          <q-item-section avatar v-if="menu.icon">
            <q-icon :name="menu.icon" size="20px" />
          </q-item-section>
          <q-item-section v-if="!mini">
            {{ menu.name }}
          </q-item-section>

          <q-tooltip v-if="mini" anchor="center right" self="center left" :offset="[10, 10]" class="bg-purple-9">
            {{ menu.name }}
          </q-tooltip>
        </q-item>

        <!-- Main Item with Sub-items (Expansion) -->
        <q-expansion-item
          v-else
          class="menu-expansion-item q-mb-xs"
          header-class="menu-item"
          :icon="menu.icon"
          :label="mini ? '' : menu.name"
          expand-separator
          :default-opened="isSubItemActive(menu)"
          :hide-expand-icon="mini"
        >
          <q-item
            v-for="subItem in menu.subItems"
            :key="subItem.id"
            :to="subItem.to"
            clickable
            v-ripple
            class="submenu-item q-mb-xs"
            active-class="menu-item-active"
          >
             <q-item-section avatar v-if="subItem.icon && !mini">
              <q-icon :name="subItem.icon" size="18px" />
            </q-item-section>
            <q-item-section v-if="!mini">
              {{ subItem.name }}
            </q-item-section>

            <q-tooltip v-if="mini" anchor="center right" self="center left" :offset="[10, 10]" class="bg-purple-9">
              {{ subItem.name }}
            </q-tooltip>
          </q-item>

          <q-tooltip v-if="mini" anchor="center right" self="center left" :offset="[10, 10]" class="bg-purple-9">
            {{ menu.name }}
          </q-tooltip>
        </q-expansion-item>
      </template>
  </q-list>
</template>

<script>
export default {
  name: "SidebarMenu",
  props: {
    menus: {
      type: Array,
      required: true,
    },
    mini: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    filteredMenus() {
      return this.menus;
    },
  },
  methods: {
    isSubItemActive(menu) {
      if (!menu.subItems) return false;
      return menu.subItems.some((sub) => this.$route.path === sub.to);
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-list {
  padding-top: 10px;

  .menu-item {
    color: rgba(255, 255, 255, 0.7) !important;
    font-size: 14px;
    font-weight: 500;
    border-radius: 10px !important;
    min-height: 44px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 0 4px;

    &:hover {
      color: #fff !important;
      background: rgba(255, 255, 255, 0.1) !important;
    }

    &.q-router-link-active, &.menu-item-active {
      color: #fff !important;
      background: rgba(255, 255, 255, 0.15) !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      font-weight: 600;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 20%;
        bottom: 20%;
        width: 3px;
        background: #fff;
        border-radius: 0 4px 4px 0;
      }
    }
  }

  .submenu-item {
    color: rgba(255, 255, 255, 0.6) !important;
    font-size: 13px;
    margin-left: 12px;
    border-radius: 8px !important;
    min-height: 38px;
    transition: all 0.2s ease;

    &:hover {
      color: #fff !important;
      background: rgba(255, 255, 255, 0.08) !important;
    }

    &.q-router-link-active, &.menu-item-active {
      color: #fff !important;
      background: rgba(255, 255, 255, 0.12) !important;
    }
  }
}

.menu-expansion-item {
  ::v-deep(.q-expansion-item__container) {
    .q-item {
      @extend .menu-item;
    }
  }
}

// Inset/Floating style for active item
.menu-item-active {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateX(2px);
}
</style>
