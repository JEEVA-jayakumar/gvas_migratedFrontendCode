<template>
  <q-list class="menu-list no-border inset-delimiter highlight">
    <template v-for="menu in menus" :key="menu.id">
      <!-- Main Item without Sub-items -->
      <q-item
        v-if="!menu.subItems || menu.subItems.length === 0"
        :to="menu.to"
        clickable
        class="menu-main-item-color-SA"
      >
        <q-item-section class="menu-item-color-SA">
          {{ menu.name }}
        </q-item-section>
      </q-item>

      <!-- Main Item with Sub-items (Expansion) -->
      <q-expansion-item
        v-else
        :label="menu.name"
        class="menu-expansion-item"
        header-class="menu-main-item-color-SA"
        expand-separator
        :default-opened="isSubItemActive(menu)"
      >
        <q-item
          v-for="subItem in menu.subItems"
          :key="subItem.id"
          :to="subItem.to"
          clickable
          class="menu-main-item-color-SA"
        >
          <q-item-section class="menu-item-color-SA" style="padding-left: 15px;">
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
  methods: {
    isSubItemActive(menu) {
      if (!menu.subItems) return false;
      return menu.subItems.some((sub) => this.$route.path.startsWith(sub.to));
    },
  },
};
</script>

<style scoped>
.menu-item-color-SA {
  color: #e3e4e5 !important;
  font-size: 14px;
}
.menu-main-item-color-SA:hover {
  color: #e3e4e5 !important;
  font-size: 14px;
  background: #7d428f !important;
}
.menu-main-item-color-SA:active {
  color: #e3e4e5 !important;
  font-size: 14px;
  background: #7d428f !important;
}

.menu-main-item-color-SA:focus {
  color: #e3e4e5 !important;
  font-size: 14px;
  background: #7d428f !important;
}

.q-item.q-router-link--active,
.q-item--active,
.q-item:focus {
  background: #3b084b !important;
  color: #e3e4e5 !important;
}

/* Customizing expansion item to match Super Admin style */
.menu-expansion-item :deep(.q-item__section--main) {
  color: #e3e4e5 !important;
  font-size: 14px;
}

.menu-expansion-item :deep(.q-expansion-item__toggle-icon) {
  color: #e3e4e5 !important;
}
</style>
