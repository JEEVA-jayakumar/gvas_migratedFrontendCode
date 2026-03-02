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
          <div class="active-indicator"></div>
          <q-item-section v-if="menu.icon" avatar>
            <q-icon :name="menu.icon" size="20px" />
          </q-item-section>
          <q-item-section>
            {{ menu.name }}
          </q-item-section>
        </q-item>

        <!-- Main Item with Sub-items (Expansion) -->
        <q-expansion-item
          v-else
          :label="menu.name"
          :icon="menu.icon"
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
            <div class="active-indicator"></div>
            <q-item-section v-if="subItem.icon" avatar>
              <q-icon :name="subItem.icon" size="18px" />
            </q-item-section>
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
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
    font-weight: 500;
    min-height: 50px;
    padding: 10px 20px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    border-radius: 0 30px 30px 0;
    margin-right: 15px;
    margin-bottom: 4px;
    letter-spacing: 0.3px;

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
      transform: translateX(4px);
    }

    &.q-router-link-active, &.menu-item-active {
      color: #ffffff;
      background: rgba(97, 17, 106, 0.15);

      .q-item__section--main {
        font-weight: 600;
      }

      .active-indicator {
        opacity: 1;
        transform: scaleY(1);
      }
    }
  }

  .submenu-item {
    color: rgba(255, 255, 255, 0.65);
    font-size: 13.5px;
    padding-left: 52px;
    min-height: 44px;
    border-radius: 0 25px 25px 0;
    margin-right: 15px;
    margin-bottom: 2px;
    transition: all 0.25s ease;

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.06);
      padding-left: 56px;
    }

    &.q-router-link-active, &.menu-item-active {
      color: #ffffff;
      background: rgba(97, 17, 106, 0.12);
      font-weight: 600;

      .active-indicator {
        opacity: 1;
        transform: scaleY(1);
      }
    }
  }

  .active-indicator {
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 4px;
    background: #61116a;
    border-radius: 0 4px 4px 0;
    opacity: 0;
    transform: scaleY(0.3);
    transition: all 0.3s ease;
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
