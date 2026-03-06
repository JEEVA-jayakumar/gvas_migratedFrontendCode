<template>
  <q-page class="q-pa-lg">
    <!-- content -->
    <div>
    <!-- START: Total users -->
      <div>
        <div class="row">
          <div class="col-md-8">
            <div class="q-title text-grey-9">Dashboard</div>
            <div class="q-caption q-mt-md text-grey-8">Welcome to Super Admin!</div>
          </div>
        </div>
        <div class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <div class="col-md-4 col-sm-6 col-xs-12">
              <q-card class="bigger full-width" style="border: 1px solid #3b084b33">
                <q-card-section class="relative-position">
                  <div class="ellipsis q-subheading text-purple-9">Total Users</div>
                </q-card-section>
                <q-card-section>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <span class="q-display-1 text-grey-9 q-mr-sm">{{getAllDashboardCount.totalUserCount}}</span>
                      <span class="q-caption text-grey-9 text-weight-light">Users</span>
                    </div>
                    <div class="col-auto" align="right">
                      <q-icon style="height:60px;width:60px" size="24px" color="white" class="bg-purple-9 q-pa-md border-radius-10" name="fas fa-user-plus" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row q-mt-md q-col-gutter-md">
            <div class="col-12" v-for="(item,index) in getAllDashboardCount.userCountResponse" :key="index">
              <div class="q-pa-sm">
                <div class="q-title q-mb-md">{{item.hierarchy.hierarchy}}</div>
                <div class="row group q-col-gutter-md">
                  <div v-for="(roleItem,roleIndex) in item.role" :key="roleIndex" class="col-md-3 col-sm-6 col-xs-12">
                    <q-card class="bigger full-width shadow-2 overflow-hidden">
                      <q-card-section class="relative-position q-pb-none">
                        <div class="ellipsis q-subheading text-grey-9">{{roleItem.role}}</div>
                      </q-card-section>
                      <q-card-section>
                        <div class="row items-center no-wrap">
                          <div class="col">
                            <span class="q-display-1 text-grey-9 q-mr-xs">{{roleItem.count}}</span>
                            <span class="q-caption text-grey-9 text-weight-light">Users</span>
                          </div>
                          <div class="col-auto" align="right">
                            <q-icon
                              size="24px"
                              color="white"
                              :style="{background: roleItem.roleColor, height:'60px', width:'60px'}"
                              class="q-pa-md border-radius-10 shadow-1"
                              name="fas fa-user"
                            />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Total users -->

    </div>
  </q-page>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";

export default {
  setup() { return { v$: useVuelidate() } },
  name: "superAdminDashboard",
  data() {
    return {
      dateFilter: "",
      totalUsers: 0
    };
  },

  created() {
    /* START: Load user table data */
    this.ajaxLoadDataForDashboardCount();
    /* END: Load user table data */
  },

  computed: {
    ...mapGetters("SuperAdminUsers", ["getAllDashboardCount"])
  },

  methods: {
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_DASHBOARD_COUNTS"]),
    ajaxLoadDataForDashboardCount() {
      this.FETCH_ALL_DASHBOARD_COUNTS();
    }
  }
};
</script>

<style>
.border-radius-10 {
  border-radius: 10px;
}
</style>
