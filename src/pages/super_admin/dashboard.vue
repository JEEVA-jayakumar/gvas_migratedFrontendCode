<template>
  <q-page class="q-pa-lg">
    <!-- content -->
    <div>
    <!-- START: Total users -->
      <div>
        <div class="row">
          <div class="col-md-8">
            <div class="text-h6 text-grey-9">Dashboard</div>
            <div class="text-caption q-mt-md text-grey-8">Welcome to Super Admin!</div>
          </div>
        </div>
        <div class="q-pa-lg">
          <div class="row">
            <div class="col-md-4">
              <q-card class="q-ma-sm full-width" style="border: 1px solid #3b084b33">
                <q-card-section class="relative-position">
                  <div class="ellipsis text-subtitle1 text-purple-9">Total Users</div>
                </q-card-section>
                <q-card-section>
                  <div class="row">
                    <div class="col-8">
                      <span class="text-h4 text-grey-9 q-mr-md">{{getAllDashboardCount.totalUserCount}}</span>
                      <span class="text-caption text-grey-9 text-weight-light">Users</span>
                    </div>
                    <div class="col-4" align="right">
                      <q-icon style="height:60px;width:60px" size="24px" color="white" class="bg-purple-9 q-pa-md border-radius-10" name="fas fa-user-plus" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="col-md-12" v-for="(item,index) in getAllDashboardCount.userCountResponse" :key="index">
              <q-card flat class="no-padding">
                <q-card-section>
                  <div class="text-h6">{{item.hierarchy.hierarchy}}</div>
                </q-card-section>
                <q-card-section class="no-padding">
                  <div class="row">
                    <div v-for="(roleItem,roleIndex) in item.role" :key="roleIndex" class="col-md-3 col-sm-6 col-xs-9">
                      <q-card class="q-ma-xs full-width">
                        <q-card-section class="relative-position">
                          <div class="ellipsis text-subtitle1 text-grey-9">{{roleItem.role}}</div>
                        </q-card-section>
                        <q-card-section>
                          <div class="row">
                            <div class="col-8">
                              <span class="text-h4 text-grey-9 q-mr-md">{{roleItem.count}}</span>
                              <span class="text-caption text-grey-9 text-weight-light">Users</span>
                            </div>
                            <div class="col-4" align="right">
                              <q-icon style="height:60px;width:60px" size="24px" color="white" :style="{background:roleItem.roleColor}" class="q-pa-md border-radius-10" name="fas fa-user" />
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Total users -->

    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
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
