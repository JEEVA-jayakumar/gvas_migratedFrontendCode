<template>
  <q-list no-border highlight>
    <template v-for="menu in filteredMenus" :key="menu.id">
      <!-- Main Item without Sub-items -->
      <q-item
        v-if="!menu.subItems || menu.subItems.length === 0"
        :to="menu.to"
        clickable
        class="menu-main-item-color-SA"
      >
        <q-item-section v-if="menu.icon" avatar>
          <q-icon :name="menu.icon" color="grey-3" size="20px" />
        </q-item-section>
        <q-item-section class="menu-item-color-SA">
          {{ menu.name }}
        </q-item-section>
      </q-item>

      <!-- Main Item with Sub-items (Expansion) -->
      <q-expansion-item
        v-else
        :label="menu.name"
        :icon="menu.icon"
        class="menu-main-item-color-SA-expansion"
        header-class="menu-item-color-SA"
        expand-separator
        :default-opened="isSubItemActive(menu)"
      >
        <q-item
          v-for="subItem in menu.subItems"
          :key="subItem.id"
          :to="subItem.to"
          clickable
          class="menu-main-item-color-SA"
          style="padding-left: 32px;"
        >
          <q-item-section v-if="subItem.icon" avatar>
            <q-icon :name="subItem.icon" color="grey-3" size="18px" />
          </q-item-section>
          <q-item-section class="menu-item-color-SA" style="font-size: 13px;">
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
  computed: {
    filteredMenus() {
      return this.menus;
    },
  },
  methods: {
    isSubItemActive(menu) {
      if (!menu.subItems) return false;
      return menu.subItems.some((sub) => {
        if (!sub.to) return false;
        return this.$route.path.startsWith(sub.to);
      });
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

::v-deep .q-item.q-router-link--active,
::v-deep .q-item--active,
::v-deep .q-item:focus {
  background: #3b084b !important;
  color: #e3e4e5 !important;
}

.menu-main-item-color-SA-expansion {
  background: transparent;
}
</style>
