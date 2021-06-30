<template>
  <div class="home">
    <a-spin :spinning="spinning">
      <KTable
        :columns="columns"
        :data-source="dataSource"
        rowKey="id"
        :scroll="{ x: 700, y: 330 }"
        :row-selection="{
          fixed: true,
          onChange: selectChange,
        }"
        @sortChange="handleChange"
      >
        <template v-slot:sn="slotProps">
          <span> 流水号: {{ slotProps.row.sn }} </span>
        </template>
        <template #action>
          <span>
            <a>Invite</a>
          </span>
        </template>
      </KTable>

      <a-pagination
        v-model:current="current"
        v-model:pageSize="pageSize"
        :total="totalCount"
        @change="changePage"
      />
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import KTable from "@/components/Table/index.vue";

const columns = [
  {
    title: "流水号",
    width: 200,
    dataIndex: "sn",
    key: "sn",
    sorter: true,
    slots: { customRender: "sn" },
    fixed: "left",
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
    slots: { customRender: "action" },
    // fixed: "right",
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
    const nowPage = ref(0);

    const current = ref(1);

    const totalCount = ref(0);

    const pageSize = ref(10);

    const spinning = ref(false);

    const search = reactive({});

    const dataSource: any[] = reactive([]);

    const data: any[] = reactive([]);

    for (let i = 0; i < 50; i++) {
      data.push({ ...dataObj, id: i + 1, sn: "sn" + i });
    }

    totalCount.value = data.length;

    onMounted(() => {
      changePage(1);
    });

    const changePage = (page: number) => {
      spinning.value = true;

      nowPage.value = page;

      fetchData({ page });
    };

    const selectChange = (selectedRowKeys: string[] | number[]) => {
      console.log("selectedRowKeys", selectedRowKeys);
    };

    const handleChange = (sorter: any) => {
      console.log("sorter2222222222222", sorter);
      const { key, rule } = sorter;
      spinning.value = true;

      changePage(nowPage.value);
    };

    const fetchData = (param: any) => {
      const { page } = param;
      dataSource.length = 0;

      const filter = data.slice(
        (page - 1) * pageSize.value,
        page * pageSize.value
      );
      dataSource.splice(0, 0, ...filter);

      setTimeout(() => {
        spinning.value = false;
      }, 500);
    };

    return {
      columns,
      current,
      totalCount,
      dataSource,
      pageSize,
      spinning,
      changePage,
      selectChange,
      handleChange,
    };
  },
});
</script>
