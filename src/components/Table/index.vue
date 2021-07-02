<template>
  <div
    class="table-box"
    :style="tableBoxC"
  >
    <table class="table">
      <thead>
        <tr>
          <th
            v-if="rowSelectionC"
            :class="[{ 'checkbox-fix-all': rowSelectionC.fixed }]"
          >
            <span :class="[
                { flex: true },
                { 'checkbox-active': selectNum > 0 },
                { 'checkbox-all': selectNum === countC },
              ]">
              <input
                type="checkbox"
                class="checkbox"
                id="checkboxAll"
                :checked="selectNum === countC"
                @click="checkboxAllHandle"
              />
              <label for="checkboxAll"></label>
            </span>
          </th>
          <th
            v-for="item in columnsC"
            :key="item.key"
            :class="[{ 'td-fix': item.fixed }]"
            :style="{ ...fixedC[item.key], width: item.width + 'px' }"
          >
            <div
              class="flex"
              @click="sorterHandle(item)"
            >
              <slot
                :name="item.slots.title"
                v-if="item.slots && item.slots.title"
              ></slot>

              <span v-else>{{ item.title }}</span>

              <span
                class="sorter"
                v-if="item.sorter"
              >
                <CaretUpOutlined :class="[
                    {
                      'sorter-asc':
                        sorterActive.key === item.key &&
                        sorterActive.rule === 'asc',
                    },
                  ]" />
                <CaretDownOutlined :class="[
                    {
                      'sorter-desc':
                        sorterActive.key === item.key &&
                        sorterActive.rule === 'desc',
                    },
                  ]" />
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in dataSourceC"
          :key="item[rowKeyC]"
        >
          <td
            v-if="rowSelectionC"
            :class="[{ 'checkbox-fix': rowSelectionC.fixed }]"
          >
            <span>
              <input
                type="checkbox"
                class="checkbox"
                :checked="checkboxArr[index]"
                :data-index="index"
                @click="checkboxHandle"
              />
            </span>
          </td>
          <td
            v-for="it in columnsC"
            :key="it.key"
            :class="[{ 'td-fix': it.fixed }]"
            :style="{ ...fixedC[it.key], width: item.width + 'px' }"
          >
            <slot
              v-if="it.slots && it.slots.customRender"
              :name="it.slots.customRender"
              :row="item"
            >
            </slot>
            <span v-else>{{ item[it.dataIndex] }}</span>
          </td>
        </tr>
        <tr v-if="!dataSourceC || dataSourceC.length === 0">
          <td :colspan="columnsC.length">
            <div class="empty">
              <span>No Data</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  ref,
  PropType,
  reactive,
  watch,
} from "vue";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons-vue";
import { RowSelectionI, ColumnPropsI } from "./type/index";

export default defineComponent({
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array as PropType<ColumnPropsI[]>,
      default: () => [],
    },
    rowKey: {
      type: String,
      default: "",
    },
    scroll: {
      type: Object,
      default: () => {
        return { x: undefined, y: undefined };
      },
    },
    rowSelection: {
      type: Object as PropType<RowSelectionI>,
      default: () => {
        return {};
      },
    },
  },
  components: {
    CaretUpOutlined,
    CaretDownOutlined,
  },
  setup(props, ctx) {
    const selectNum = ref(0);

    const checkboxArr: boolean[] = reactive([]);

    const selectedRowKeys: any[] = reactive([]);

    const sorterActive: { key: string; rule: string } | Record<string, string> =
      reactive({});

    const dataSourceC = computed(() => {
      return props.dataSource;
    });

    const countC = computed(() => {
      return props.dataSource?.length;
    });

    const columnsC = computed(() => {
      return props.columns;
    });

    const rowKeyC = computed(() => {
      return props.rowKey;
    });

    const rowSelectionC: ComputedRef<RowSelectionI> = computed(() => {
      const rowSelection = props.rowSelection;

      return rowSelection;
    });

    const tableBoxC = computed(() => {
      const { x, y } = props.scroll;
      let res = "";
      x && (res += `max-width: ${props.scroll.x}px;overflow-x:scroll;`);
      y && (res += `max-height: ${props.scroll.y}px;overflow-y:scroll;`);

      return res;
    });

    const fixedC = computed(() => {
      const columns = props.columns;
      let leftWidth = rowSelectionC.value.fixed ? 50 : 0;
      let rightWidth = 0;
      const zIndex = 5;
      const result: any = {};

      for (let i = 0; i < columns.length; i++) {
        const length = columns.length;
        const leftItem = columns[i];
        const rightItem = columns[length - 1 - i];

        if (leftItem.fixed === "left") {
          const left = leftWidth;
          leftWidth += leftItem.width ? leftItem.width : 120;
          result[leftItem.key] = {
            width: `${leftItem.width}px`,
            left: `${left}px`,
            "z-index": `${zIndex}`,
          };
        }

        if (rightItem.fixed === "right") {
          const right = rightWidth;
          rightWidth += rightItem.width ? rightItem.width : 120;
          result[rightItem.key] = {
            width: `${rightItem.width}px`,
            right: `${right}px`,
            "z-index": `${zIndex}`,
          };
        }
      }
      return result;
    });

    watch(props.dataSource, (newVal, oldVal) => {
      selectNum.value = 0;

      selectedRowKeys.length = 0;

      checkboxArr.length = 0;

      const rowSelection = props.rowSelection;

      if (rowSelection.selectedRowKeys) {
        selectedRowKeys.splice(0, 0, ...rowSelection.selectedRowKeys);
      }

      newVal?.forEach((item: any) => {
        const index = rowSelection.selectedRowKeys?.indexOf(
          item[rowKeyC.value]
        );
        const checked = index !== undefined && index !== -1;

        if (checked) {
          selectNum.value++;
        }
        checkboxArr.push(checked);
      });
    });

    const checkboxHandle = (e: any) => {
      const { checked } = e.target as HTMLInputElement;

      const { index } = e.target.dataset as DOMStringMap;

      if (checked) {
        selectNum.value++;
      } else {
        selectNum.value--;
      }

      if (index) {
        checkboxArr[Number(index)] = checked;

        const item: any = dataSourceC.value && dataSourceC.value[Number(index)];

        const rowKeyIndex = selectedRowKeys.indexOf(item[rowKeyC.value]);

        if (checked) {
          if (rowKeyIndex === -1) selectedRowKeys.push(item[rowKeyC.value]);
        } else {
          selectedRowKeys.splice(rowKeyIndex, 1);
        }
      }

      if (rowSelectionC.value.onChange) {
        rowSelectionC.value.onChange(selectedRowKeys);
      }
    };

    const checkboxAllHandle = (e: any) => {
      const { checked } = e.target as HTMLInputElement;

      for (const i in checkboxArr) {
        checkboxArr[i] = checked;
      }
      if (checked) {
        selectNum.value = checkboxArr.length;

        selectedRowKeys.length = 0;

        dataSourceC.value?.forEach((item: any) => {
          selectedRowKeys.push(item[rowKeyC.value]);
        });
      } else {
        selectNum.value = 0;

        selectedRowKeys.length = 0;
      }

      if (rowSelectionC.value.onChange) {
        rowSelectionC.value.onChange(selectedRowKeys);
      }
    };

    const sorterHandle = (item: any) => {
      if (!item.sorter) return;
      const { key } = item;

      const sort = ["", "asc", "desc"];

      let index = sort.indexOf(sorterActive.rule);

      index = index === -1 ? 0 : index;

      index = sorterActive.key === key ? index : 0;

      sorterActive.key = key;

      sorterActive.rule = sort[(index + 1) % 3];

      ctx.emit("sortChange", { sorter: sorterActive });
    };

    return {
      selectNum,
      countC,
      dataSourceC,
      columnsC,
      rowKeyC,
      rowSelectionC,
      tableBoxC,
      fixedC,
      checkboxArr,
      sorterActive,
      checkboxHandle,
      checkboxAllHandle,
      sorterHandle,
    };
  },
});
</script>

<style lang="less" scoped>
@onepxTovw: 100vw/1024;

@primary-color: #005bac;

.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-box {
  width: 100%;
  margin: 20px auto;
}

.table {
  width: 100%;
  height: 100%;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  text-align: center;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;

  thead {
    position: relative;
    z-index: 10;
    tr {
      th {
        color: rgba(0, 0, 0, 0.85);
        text-align: center;
        background: #fafafa;
        border-bottom: 1px solid #f0f0f0;
        padding: 12px 8px;
        overflow-wrap: break-word;
        font-weight: bold;
        line-height: 1.5715;
        position: sticky;
        top: 0;
        z-index: 2;
        width: 120px;
      }
    }
  }

  tbody {
    tr {
      height: 50px;
      td {
        padding: 12px 8px;
        border-bottom: 1px solid #f0f0f0;
        line-height: 1.5715;
        min-height: 50px;
        overflow-wrap: break-word;
        box-sizing: border-box;
        width: 120px;
        background: #fff;
      }
      &:hover {
        td {
          background: #e6f7ff;
        }
      }
    }
  }

  .empty {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #999;
  }

  .checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .checkbox-active {
    position: relative;
    display: flex;
    label {
      position: absolute;
      top: 50%;
      left: 50%;
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 1px;
      transform: translateX(-50%) translateY(-50%);
      background-color: @primary-color;
      z-index: 0;
    }
  }

  .checkbox-all {
    label {
      display: none;
    }
  }

  .checkbox-fix {
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    background: #fff;
    width: 50px;
  }
  .checkbox-fix-all {
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    z-index: 10;
    width: 50px;
  }
  .td-fix {
    position: -webkit-sticky;
    position: sticky;
  }

  .checkbox-fix,
  .checkbox-fix-all,
  .td-fix {
    &::before {
      content: "";
      display: inline-block;
      width: 1px;
      height: 100%;
      background: #f0f0f0;
      position: absolute;
      top: 0;
      left: 0;
      transform: scaleX(0.5);
    }
    &::after {
      content: "";
      display: inline-block;
      width: 1px;
      height: 100%;
      background: #f0f0f0;
      position: absolute;
      top: 0;
      right: -1px;
      transform: scaleX(0.5);
    }

    &:first-child,
    &:last-child {
      &::before {
        content: "";
        display: inline-block;
        width: 2px;
        height: 100%;
        background: #f0f0f0;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .sorter {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #999;
    font-size: 14px;
    margin-left: 10px;
    transform: translateY(-10%);
    & > span:first-of-type {
      transform: translateY(30%);
    }
    &-asc,
    &-desc {
      color: @primary-color;
    }
  }
}
</style>
