<template>
  <div class="home">
    <KTable
      :columns="columns"
      :dataSource="dataSource"
      rowKey="id"
			:scroll="{ x: 500, y: 330 }"
    >
      <template v-slot:sn="slotProps">
        <span>
          流水号: {{slotProps.row.sn}}
        </span>
      </template>
    </KTable>

    <a-pagination
      v-model:current="current"
      :total="total"
      show-less-items
      @change="changePage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import KTable from "@/components/Table/index.vue";

const columns = [
  {
    title: "流水号",
    width: 200,
    dataIndex: "sn",
    key: "sn",
    sorter: true,
    slots: { customRender: "sn" },
  },
  {
    title: "样本号",
    width: 120,
    dataIndex: "sampleNo",
    key: "sampleNo",
    sorter: true,
  },
  {
    title: "项目简称",
    dataIndex: "projectShortName",
    key: "projectName",
    width: 150,
  },
  { title: "批号", dataIndex: "batchNo", key: "batchNo", width: 150 },
  {
    title: "上传状态",
    dataIndex: "uploadStatus",
    key: "uploadStatus",
    width: 120,
  },
  {
    title: "结果",
    dataIndex: "summaryOfResults",
    key: "summaryOfResults",
    width: 400,
  },
  {
    title: "完成时间",
    dataIndex: "endTime",
    key: "endTime",
    width: 280,
    sorter: true,
  },
  {
    title: "操作",
    key: "action",
  },
];

const dataObj = {
  id: "1",
  sn: "00001",
  sampleNo: "ksm-001",
  projectShortName: "项目1",
  batchNo: "1001",
  uploadStatus: "完成",
  summaryOfResults: "成功",
  endTime: "2021-06-25 15:48",
};
export default defineComponent({
  name: "Home",
  components: {
    KTable,
  },
  setup() {
    const current = ref(1);
    const totalCount = ref(0);

    const changePage = (page: number, pageSize: number) => {};

    const dataSource: any[] = reactive([]);

    for (let i = 0; i < 1000; i++) {
      dataSource.push(dataObj);
    }

    const handle = (slot: any) => {
      console.log("slot", slot);
      console.log(slot.row.id);
    };

    return {
      columns,
      current,
      totalCount,
      dataSource,
      changePage,
      handle,
    };
  },
});
</script>
