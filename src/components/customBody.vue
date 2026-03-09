<template>
  <router-view />
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CustomBody",
  data() {
    return {
      toggleAjaxLoadFilter: true
    };
  },
  computed: {
    ...mapGetters("commonLoader", ["getToggleCommonLoader"])
  },
  methods: {
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),
    beforeEnter: function(el) {
      this.TOGGLE_COMMON_LOADER(true);
    },
    // the done callback is optional when
    // used in combination with CSS
    enter: function(el, done) {
      done();
    },

    afterEnter: function(el) {
      this.TOGGLE_COMMON_LOADER(false);
    }
  }
};
</script>
