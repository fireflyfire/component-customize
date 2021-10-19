<template>
  <tr @click="onClick">
    <slot :style="additionalProps.style"></slot>
  </tr>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "RowComponent",
  props: {
    record: {
      type: Object,
      default: () => {
        return {};
      },
    },
    index: Number,
    customRow: {
      type: Function,
      default: () => () => {
        return {};
      },
    },
  },
  setup(props, ctx) {
    const additionalProps = computed(() =>
      props.customRow(props.record, props.index)
    );

    const onClick = (event: Event, ...args: any[]) => {
      if (additionalProps.value.onClick) {
        additionalProps.value.onClick(event, ...args);
      }
    };
    return {
      additionalProps,
      onClick,
    };
  },
});
</script>

<style scoped></style>
