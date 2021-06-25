<template>
  <div
    class="table-box"
    :style="{...widthC,...heightC}"
  >
    <table class="table">
      <thead>
        <tr>
          <th
            v-for="item in columnsC"
            :key="item.key"
          >
            <slot
              :name="item.slots.title"
              v-if="item.slots && item.slots.title"
            ></slot>
            <span v-else>{{ item.title }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item) in dataSourceC"
          :key="item[rowKeyC]"
        >
          <td
            v-for="(it) in columnsC"
            :key="it.key"
            :width="it.width"
          >
            <slot
              v-if="it.slots && it.slots.customRender"
              :name="it.slots.customRender"
              :row="item"
            >
            </slot>
            <span v-else>{{item[it.dataIndex]}}</span>
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
import { computed, defineComponent } from "vue";
import {} from "@/type/index";

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
      default: undefined,
    },
    scroll: {
      type: Object,
      default: () => {
        return { x: undefined, y: undefined };
      },
    },
  },
  setup(props) {
    const dataSourceC = computed(() => {
      return props.dataSource;
    });
    const columnsC = computed(() => {
      console.log("columns>>>", props.columns);
      return props.columns;
    });
    const rowKeyC = computed(() => {
      return props.rowKey;
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

    return {
      dataSourceC,
      columnsC,
      rowKeyC,
      widthC,
      heightC,
    };
  },
});
</script>

<style lang="less" scoped>
// @onepxTovw: 100vw/1024;
.table-box {
  width: 100%;
  margin: 0 auto;
}
.table {
  width: 100%;
  height: 100%;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  margin: 20px auto;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  word-wrap: break-word;
  word-break: break-all;
  border-collapse: collapse;
  border-spacing: 0;

  thead {
    tr {
      th {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        text-align: center;
        background: #fafafa;
        border-bottom: 1px solid #f0f0f0;
        padding: 16px 16px;
        overflow-wrap: break-word;
        font-weight: bold;
      }
    }
  }

  tbody {
    tr {
      td {
        padding: 12px 8px;
        overflow-wrap: break-word;
        border-bottom: 1px solid #f0f0f0;
        line-height: 1.5715;
        width: 50px;
        max-width: 180px;
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
}
</style>
