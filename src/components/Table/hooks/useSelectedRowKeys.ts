import { ref, reactive, computed, Ref } from "vue";

export const useSelectedRowKeys = (
  initSelectedRowKeys: number[],
  count: number
) => {
  const selectAll: Ref<boolean> = ref(initSelectedRowKeys.length >= count);
  const selectedRowKeys = reactive([]);
  const selectAllClick = () => {};
  const selectedRowsClick = () => {};

  return {
    selectAll,
  };
};
