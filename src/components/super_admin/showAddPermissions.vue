<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      @hide="emitfnshowAddPermissions(false)"
      persistent
      position="right"
      class="customModalOverlay"
    >
      <q-card style="min-width: 50vw; min-height: 100vh">
        <form>
          <div class="q-pa-md border-bottom">
            <div class="row items-center q-col-gutter-sm">
              <div class="col-8">
                <div class="text-h6 text-weight-regular">Add Permissions</div>
              </div>
              <div class="col-2">
                <q-btn
                  flat
                  no-caps
                  class="bg-white text-weight-regular text-grey-8 full-width"
                  @click="emitfnshowAddPermissions(false)"
                  label="Cancel"
                />
              </div>
              <div class="col-2">
                <q-btn no-caps class="full-width" color="purple-9" label="Add" />
              </div>
            </div>
          </div>

          <div class="q-pa-md border-bottom">
            <div class="row items-center q-col-gutter-lg">
              <div class="col-auto">
                <q-avatar size="100px">
                  <img src="https://png.icons8.com/color/260/person-female.png" />
                </q-avatar>
              </div>

              <div class="col-4">
                <div class="text-weight-regular text-grey-8">Arun Kumar</div>
                <div class="text-weight-regular text-body1 text-grey-8">
                  <span class="text-light-blue">Employee ID:</span> 2134453
                </div>
              </div>

              <div class="col-4">
                <div class="text-weight-regular text-grey-8">+91 9921344530</div>
                <div class="text-weight-regular text-body1 text-grey-8">
                  arunkumar@gmail.com
                </div>
              </div>
            </div>
          </div>

          <div class="q-pa-md">
            <div class="text-h6 text-weight-regular q-mb-md">Set Permission</div>
            <div class="row q-col-gutter-sm">
              <div
                v-for="radioPermission in radioPermissions"
                :key="radioPermission.value"
                class="col-auto"
              >
                <q-radio
                  v-model="radioPermissionChecked"
                  :val="radioPermission.value"
                  color="purple-9"
                >
                  <q-chip
                    color="blue-grey-1"
                    class="text-weight-regular text-grey-8"
                  >
                    {{ radioPermission.label }}
                  </q-chip>
                </q-radio>
              </div>
            </div>
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: ["propShowAddPermissions"],
  data() {
    return {
      toggleModal: this.propShowAddPermissions,
      radioPermissionChecked: "",
      radioPermissions: [
        { value: 1, label: "Read" },
        { value: 2, label: "Write" },
        { value: 3, label: "Download" },
        { value: 4, label: "Edit" },
      ],
    };
  },
  methods: {
    emitfnshowAddPermissions(val) {
      this.$emit("emitfnshowAddPermissions", val);
    },
  },
};
</script>
