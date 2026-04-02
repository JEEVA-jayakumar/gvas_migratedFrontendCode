<template>
  <q-page>
    <!-- content -->
    <div>

      <!--START: page title -->
      <div class="row">
        <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">Statement View</div>
      </div>
      <!--END: page title -->

      <div class="q-px-lg q-py-md gutter-y-sm">

        <div class="row ">
          <div class="col-md-6 text-grey-9">
            <q-input 
              color="grey-9"
              label="TID"
              v-model="formData.statementDetails.tid" 
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 text-grey-9">
            <q-input 
              color="grey-9"
              label="MID"
              v-model="formData.statementDetails.mid" 
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 text-grey-9">
            <q-input
              v-model="formData.statementDetails.fromDate"
              label="From Date"
              color="grey-9"
            >
              <template v-slot:prepend>
                <q-icon name="date_range" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 text-grey-9">
            <q-input
              v-model="formData.statementDetails.toDate"
              label="To Date"
              color="grey-9"
            >
              <template v-slot:prepend>
                <q-icon name="date_range" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 text-grey-9">
            <q-btn
              flat
              label="Retrigger"
              class="common-dark-blue"
            />
          </div>
        </div>

      </div>

    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data() {
    return {
      formData: {
        statementDetails: {
          tid: 122,
          mid: 190,
          fromDate: "22/10/2017",
          toDate: "22/5/2018"
        }
      }
    };
  }
};
</script>

<style>
</style>