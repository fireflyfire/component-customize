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
            :class="[{'checkbox-fix-all': rowSelectionC.fixed}]"
          >
            <span :class="[
                { 'flex': true },
                { 'checkbox-active': selectNum > 0 },
                { 'checkbox-all': selectNum === countC },
                ]">
              <input
                type="checkbox"
                class="checkbox"
                id="checkboxAll"
                v-model="selectAll"
                @change="checkboxAllHandle"
              />
              <label for="checkboxAll"></label>
            </span>
          </th>
          <th
            v-for="(item) in columnsC"
            :key="item.key"
            :class="[{'td-fix':item.fixed}]"
            :style="fixedC[item.key]"
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
                <CaretUpOutlined :class="[{'sorter-asc': sorterRules[item.key] === 'asc'}]" />
                <CaretDownOutlined :class="[{'sorter-desc': sorterRules[item.key] === 'desc'}]" />
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item,index) in dataSourceC"
          :key="item[rowKeyC]"
        >
          <td
            v-if="rowSelectionC"
            :class="[{'checkbox-fix': rowSelectionC.fixed}]"
          >
            <span>
              <input
                type="checkbox"
                class="checkbox"
                :checked="checkboxArr[index]"
                :data-index="index"
                :data-row-key="item[rowKeyC]"
                :id="'checkbox'+item[rowKeyC]"
                @change="checkboxHandle"
              />
            </span>
          </td>
          <td
            v-for="it in columnsC"
            :key="it.key"
            :class="[{'td-fix':it.fixed}]"
            :style="fixedC[it.key]"
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
        <tr v-if="!dataSourceC">
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
      default: undefined,
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

    const selectAll = ref(false);

    const checkboxAll = ref("");

    const dataSourceC: any[] = reactive([]);

    const checkboxArr: boolean[] = reactive([]);

    const selectedRowKeys: any[] = reactive([]);

    const sorterRules: Record<string, string> = reactive({});

    const countC = computed(() => {
      return props.dataSource?.length;
    });

    const columnsC = computed(() => {
      const sort =
        props.columns && props.columns.filter((item: any) => item.sorter);

      sort?.forEach((item: any) => {
        sorterRules[item.key] = "";
      });

      return props.columns;
    });

    const rowKeyC = computed(() => {
      return props.rowKey;
    });

    const rowSelectionC: ComputedRef<RowSelectionI> = computed(() => {
      return props.rowSelection;
    });

    const tableBoxC = computed(() => {
      const { x, y } = props.scroll;
      let res = "";
      x && (res += `max-width: ${props.scroll.x}px;overflow-x:scroll;`);
      y && (res += `max-height: ${props.scroll.y}px;overflow-y:scroll;`);

      return res;
    });

    const fixedC = computed(() => {
      const vpx = window.innerWidth / 1024;
      const columns = props.columns;
      let leftWidth = rowSelectionC.value.fixed ? 50 * vpx : 0;
      let rightWidth = 0;
      const zIndex = 5;
      const result: any = {};
      columns.forEach((item: any) => {
        result[item.key] = "";

        if (item.fixed === "left") {
          const left = leftWidth;
          leftWidth += item.width ? item.width : 120 * vpx;
          result[
            item.key
          ] = `width:${item.width}px;left:${left}px;z-index:${zIndex}`;
        }

        if (item.fixed === "right") {
          const right = rightWidth;
          rightWidth += item.width ? item.width : 120 * vpx;
          result[
            item.key
          ] = `width:${item.width}px;right:${right}px;z-index:${zIndex}`;
        }
      });
      return result;
    });

    watch(props, (newVal, oldVal) => {
      const { dataSource } = newVal;

      selectNum.value = 0;

      selectedRowKeys.length = 0;

      checkboxArr.length = 0;

      dataSourceC.length = 0;

      dataSource?.forEach((item) => {
        checkboxArr.push(false);

        dataSourceC.push(item);
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
      selectAll.value = selectNum.value === countC.value;
      if (index) {
        checkboxArr[Number(index)] = checked;

        const item: any = dataSourceC && dataSourceC[Number(index)];

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

        dataSourceC?.forEach((item: any) => {
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

      const index = sort.indexOf(sorterRules[key]);

      for (const key in sorterRules) {
        sorterRules[key] = "";
      }

      sorterRules[key] = sort[(index + 1) % 3];

      ctx.emit("sortChange", { sorter: { key, rule: sorterRules[key] } });
    };

    return {
      selectNum,
      selectAll,
      countC,
      dataSourceC,
      columnsC,
      rowKeyC,
      rowSelectionC,
      tableBoxC,
      fixedC,
      checkboxArr,
      sorterRules,
      checkboxAll,
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
  margin: 20 * @onepxTovw auto;
}

.table {
  width: 100%;
  height: 100%;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14 * @onepxTovw;
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
        padding: 12 * @onepxTovw 8 * @onepxTovw;
        overflow-wrap: break-word;
        font-weight: bold;
        line-height: 1.5715;
        position: sticky;
        top: 0;
        z-index: 2;
        width: 120 * @onepxTovw;
      }
    }
  }

  tbody {
    tr {
      height: 50 * @onepxTovw;
      td {
        padding: 12 * @onepxTovw 8 * @onepxTovw;
        border-bottom: 1px solid #f0f0f0;
        line-height: 1.5715;
        min-height: 50 * @onepxTovw;
        overflow-wrap: break-word;
        box-sizing: border-box;
        width: 120 * @onepxTovw;
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
    height: 200 * @onepxTovw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #999;
  }

  .checkbox {
    width: 20 * @onepxTovw;
    height: 20 * @onepxTovw;
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
      width: 10 * @onepxTovw;
      height: 10 * @onepxTovw;
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
    width: 50 * @onepxTovw;
  }
  .checkbox-fix-all {
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    z-index: 10;
    width: 50 * @onepxTovw;
  }
  .td-fix {
    position: -webkit-sticky;
    position: sticky;
  }

  .checkbox-fix,
  .checkbox-fix-all,
  .td-fix {
    &::after {
      content: "";
      display: inline-block;
      width: 1px;
      height: 100%;
      background: #f0f0f0;
      position: absolute;
      top: 0;
      right: 0;
    }

    &:first-child,
    &:last-child {
      &::before {
        content: "";
        display: inline-block;
        width: 1px;
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
    font-size: 14 * @onepxTovw;
    margin-left: 10 * @onepxTovw;
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
