<template>
  <div class="row items-center q-col-gutter-sm">
    <div class="col-3">
      <div class="text-caption text-weight-medium"><strong>{{ label }}</strong></div>
    </div>
    <div class="col">
      <div class="row group bg-green-2">
        <div class="col">
          <q-input
            dense
            color="grey-9"
            type="number"
            v-model.number="modelValue.fixed"
            placeholder="Fixed"
          />
        </div>
        <div class="col">
          <q-input
            dense
            color="grey-9"
            type="number"
            v-model.number="modelValue.percentage"
            placeholder="%"
          />
        </div>
        <div class="col">
          <q-input
            dense
            color="grey-9"
            type="number"
            v-model.number="modelValue.minimum"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    modelValue: Object
  }
}
</script>
