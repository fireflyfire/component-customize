<template>
  <div class="home">
    <a-spin :spinning="spinning">
      <KTable
        :columns="columns"
        :data-source="dataSource"
        rowKey="id"
        :scroll="{ x: 900, y: 330 }"
        :row-selection="{
          fixed: true,
          onChange: selectChange,
          selectedRowKeys: selectedRowKeysC,
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
        :pageSize="10"
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
    width: 100,
  },
  {
    title: "完成时间",
    dataIndex: "endTime",
    key: "endTime",
    width: 180,
    sorter: true,
    fixed: "right",
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
    fixed: "right",
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

    const pageSize = ref(10);

    const spinning = ref(false);

    const search = reactive({});

    const dataSource: any[] = reactive([]);

    const data: any[] = reactive([]);

    const selectedRowKeysC: any[] = reactive([]);

    const selectedRowKeysAllC = reactive(new Map());

    for (let i = 0; i < 50; i++) {
      data.push({ ...dataObj, id: i + 1, sn: "sn" + i });
    }

    totalCount.value = data.length;

    onMounted(() => {
      changePage(1);
    });

    const changePage = (page: number) => {
      spinning.value = true;
      fetchData({ page });
    };

    const selectChange = (selectedRowKeys: string[] | number[]) => {
      console.log("selectedRowKeys>>>>>", selectedRowKeys);
      selectedRowKeysAllC.set(current.value, [...selectedRowKeys]);
    };

    const handleChange = (sorter: any) => {
      const { key, rule } = sorter;
      spinning.value = true;
      changePage(current.value);
    };

    const fetchData = (param: any) => {
      const { page } = param;

      dataSource.length = 0;

      const filter = data.slice(
        (page - 1) * pageSize.value,
        page * pageSize.value
      );

      dataSource.splice(0, 0, ...filter);

      const selectedRowKeys = selectedRowKeysAllC.get(page);

      selectedRowKeysC.length = 0;

      if (selectedRowKeys) {
        selectedRowKeysC.splice(0, 0, ...selectedRowKeysAllC.get(page));
      }

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
      selectedRowKeysC,
      changePage,
      selectChange,
      handleChange,
    };
  },
});
</script>
