<template>
  <q-page class="q-pa-lg">
    <!-- content -->
    <div>
    <!-- START: Total users -->
      <div>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="text-h6 text-grey-9">Dashboard</div>
            <div class="text-caption q-mt-sm text-grey-8">Welcome to Super Admin!</div>
          </div>
        </div>
        <div class="q-py-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-4">
              <q-card flat bordered class="full-height" style="border: 1px solid #3b084b33">
                <q-card-section class="q-pb-none">
                  <div class="ellipsis text-subtitle1 text-purple-9 text-weight-bold">Total Users</div>
                </q-card-section>
                <q-card-section>
                  <div class="row items-center justify-between no-wrap">
                    <div>
                      <span class="text-h4 text-grey-9 q-mr-sm text-weight-medium">{{getAllDashboardCount.totalUserCount}}</span>
                      <span class="text-caption text-grey-7 text-weight-light">Users</span>
                    </div>
                    <q-icon size="32px" color="white" class="bg-purple-9 q-pa-md border-radius-10 shadow-2" name="fas fa-user-plus" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="row q-mt-xl q-col-gutter-lg">
            <div class="col-12" v-for="(item,index) in getAllDashboardCount.userCountResponse" :key="index">
              <div class="text-h6 q-mb-md text-grey-8 border-bottom-soft q-pb-xs">{{item.hierarchy.hierarchy}}</div>

              <div class="row q-col-gutter-md">
                <div v-for="(roleItem,roleIndex) in item.role" :key="roleIndex" class="col-12 col-sm-6 col-md-3">
                  <q-card flat bordered class="full-height hover-shadow transition-all">
                    <q-card-section class="q-pb-none">
                      <div class="ellipsis text-subtitle2 text-grey-8 text-weight-medium text-uppercase ls-1">{{roleItem.role}}</div>
                    </q-card-section>
                    <q-card-section>
                      <div class="row items-center justify-between no-wrap">
                        <div>
                          <span class="text-h5 text-grey-9 q-mr-sm text-weight-medium">{{roleItem.count}}</span>
                          <span class="text-caption text-grey-7 text-weight-light">Users</span>
                        </div>
                        <q-icon size="28px" color="white" :style="{background:roleItem.roleColor}" class="q-pa-md border-radius-10 shadow-1" name="fas fa-user" />
                      </div>
                    </q-card-section>
                  </q-card>
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
      // .then(() => {
      //   let totalUsersCount = 0;
      //   _.map(this.getAllDashboardCount, function(oo) {
      //     totalUsersCount = totalUsersCount + oo.count;
      //   });
      //   this.totalUsers = totalUsersCount;
      // });
    }
  }
};
</script>

<style>
.border-radius-10 {
  border-radius: 10px;
}
.border-bottom-soft {
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
.hover-shadow:hover {
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.transition-all {
  transition: all 0.3s ease;
}
.ls-1 {
  letter-spacing: 1px;
}
</style>
