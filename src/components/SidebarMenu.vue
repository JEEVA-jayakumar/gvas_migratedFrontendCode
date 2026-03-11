<template>
  <q-list padding class="menu-list">
      <template v-for="menu in filteredMenus" :key="menu.id">
        <!-- Main Item without Sub-items -->
        <q-item
          v-if="!menu.subItems || menu.subItems.length === 0"
          :to="menu.to"
          clickable
          v-ripple
          class="menu-item"
          active-class="menu-item-active"
        >
          <q-item-section>
            {{ menu.name }}
          </q-item-section>
        </q-item>

        <!-- Main Item with Sub-items (Expansion) -->
        <q-expansion-item
          v-else
          :label="menu.name"
          class="menu-expansion-item"
          header-class="menu-item"
          expand-separator
          :default-opened="isSubItemActive(menu)"
        >
          <q-item
            v-for="subItem in menu.subItems"
            :key="subItem.id"
            :to="subItem.to"
            clickable
            v-ripple
            class="submenu-item"
            active-class="menu-item-active"
          >
            <q-item-section>
              {{ subItem.name }}
            </q-item-section>
          </q-item>
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
  },
  data() {
    return {
      thumbStyle: {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#61116a",
        width: "5px",
        opacity: 0.75,
      },
    };
  },
  computed: {
    filteredMenus() {
      // Visibility logic can be handled here or passed from parent
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
  padding-left: 0;
  padding-right: 0;

  .menu-item {
    color: #e3e4e5 !important;
    font-size: 14px;
    min-height: 50px;
    padding: 10px 20px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

    &:hover {
      background: #7d428f !important;
    }

    &.q-router-link-active, &.menu-item-active {
      background: #3b084b !important;
    }
  }

  .submenu-item {
    color: #e3e4e5 !important;
    font-size: 14px;
    padding-left: 32px;
    min-height: 44px;
    transition: all 0.25s ease;

    &:hover {
      background: #7d428f !important;
    }

    &.q-router-link-active, &.menu-item-active {
      background: #3b084b !important;
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
</style>
