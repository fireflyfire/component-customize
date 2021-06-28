<template>
  <div
    class="table-box"
    :style="{ ...widthC,...heightC}"
  >
    <!-- <div class="table-head">
      <table class="table">
        <colgroup :span=" columnsC.length+1" style="width:120px"></colgroup>
        <thead>
          <tr>
            <th v-if="rowSelectionC">
              <span :class="[
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
              v-for="item in columnsC"
              :key="item.key"
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
      </table>
    </div>
    <div
      class="table-body"
      :style="{...heightC }"
    >
      <table class="table">
        <colgroup :span=" columnsC.length+1" style="width:120px"></colgroup>
        <tbody>
          <tr
            v-for="(item,index) in dataSourceC"
            :key="item[rowKeyC]"
          >
            <td v-if="rowSelectionC">
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
                <label :for="'checkbox'+item[rowKeyC]"></label>
              </span>
            </td>
            <td
              v-for="it in columnsC"
              :key="it.key"
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
    </div> -->
   
    <table class="table">
      <thead>
        <tr>
          <th v-if="rowSelectionC">
            <span :class="[
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
            v-for="item in columnsC"
            :key="item.key"
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
      <tbody :style="{...heightC}">
        <tr
          v-for="(item,index) in dataSourceC"
          :key="item[rowKeyC]"
        >
          <td v-if="rowSelectionC">
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
              <label :for="'checkbox'+item[rowKeyC]"></label>
            </span>
          </td>
          <td
            v-for="it in columnsC"
            :key="it.key"
            :width="it.width"
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
import { RowSelectionI } from "@/type/index";

export default defineComponent({
  props: {
    dataSource: {
      type: Array,
      default: undefined,
    },
    columns: {
      type: Array,
      default: undefined,
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
      default: () => {},
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

    const widthC = computed(() => {
      const res = props.scroll.x
        ? {
            width: props.scroll.x + "px",
            overflowX: "scroll",
          }
        : {};
      return res;
    });

    const heightC = computed(() => {
      const res = props.scroll.y
        ? {
            height: props.scroll.y + "px",
            overflowY: "scroll",
          }
        : {};
      return res;
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
      widthC,
      heightC,
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
// @onepxTovw: 100vw/1024;
@primary-color: #005bac;

.table-box {
  width: 100%;
  margin: 20px auto;
}
.table-head {
  width: 100%;
  padding-right: 17px;
}
.table-body {
  width: 100%;
}
.table {
  width: 100%;
  height: 100%;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  word-wrap: break-word;
  word-break: break-all;
  border-collapse: collapse;
  border-spacing: 0;
  // thead tr,
  // tbody tr,
  // tfoot tr {
  //   box-sizing: border-box;
  //   table-layout: fixed;
  //   display: table;
  //   width: 100%;
  // }

  thead {
    tr {
      th {
        color: rgba(0, 0, 0, 0.85);
        text-align: center;
        background: #fafafa;
        border-bottom: 1px solid #f0f0f0;
        padding: 16px 16px;
        overflow-wrap: break-word;
        font-weight: bold;
        line-height: 1.5715;
      }
    }
  }

  tbody {
    tr {
      td {
        padding: 12px 8px;
        border-bottom: 1px solid #f0f0f0;
        line-height: 1.5715;
        width: 50px;
        // max-width: 180px;
        height: 50px;
        overflow-wrap: break-word;
        box-sizing: border-box;
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
    display: none;
  }
  .checkbox + label {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #999;
    background: #fff;
    position: relative;
    cursor: pointer;
    &::before {
      display: inline-block;
      content: " ";
      width: 12px;
      border: 2px solid #fff;
      height: 4px;
      border-top: none;
      border-right: none;
      transform: rotate(-45deg);
      top: 5px;
      left: 3px;
      position: absolute;
      opacity: 0;
    }
  }

  .checkbox:checked + label {
    background-color: @primary-color;
  }
  .checkbox:checked + label::before {
    opacity: 1;
    transform: all 0.5s;
  }

  .checkbox-active {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
    label::after {
      content: "";
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
    label::after {
      display: none;
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
  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
