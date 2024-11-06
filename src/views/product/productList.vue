<template>
  <n-card :bordered="false">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </BasicForm>
  </n-card>
  <n-card :bordered="false" class="mt-3">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1090"
      :striped="true"
    >
      <template #tableTitle>
        <n-button type="primary" @click="addTable">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template>

      <template #toolbar> </template>
    </BasicTable>

    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="新建">
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="物资类型" path="equType">
          <n-input placeholder="请输入物资类型" v-model:value="formParams.equType" />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getTableList } from '@/api/table/list';
  import { getProductList, } from '@/api/product/index';
  import { columns, ListData } from './columns';
  import { PlusOutlined } from '@vicons/antd';
  import { useRouter } from 'vue-router';
  import { type FormRules } from 'naive-ui';

  const rules: FormRules = {
    equType: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入物资类型',
    },
    equName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入物资名称',
    },
    brand: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入制造商',
    },
    equModel: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入规格型号',
    },
    mainPara: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入参数',
    },
  };

  const schemas: FormSchema[] = [
    /* {
      field: 'equType',
      component: 'NInput',
      label: '物资类型',
      componentProps: {
        placeholder: '请输入物资类型',
        onInput: (e: any) => {
          console.log(e);
        },
      },
      // rules: [{ required: true, message: '请输入物资类型', trigger: ['blur'] }],
    },
    {
      field: 'equName',
      component: 'NInput',
      label: '物资名称',
      componentProps: {
        placeholder: '请输入物资名称',
      },
    }, */
    {
      field: 'query',
      component: 'NInput',
      label: '关键字',
      componentProps: {
        placeholder: '请输入关键字',
      },
    },
  ]

  const router = useRouter();
  const formRef: any = ref(null);
  const actionRef = ref();

  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    name: '',
    address: '',
    date: null,
  });

  const actionColumn = reactive({
    width: 120,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'text',
        actions: [
          {
            label: '查看',
            onClick: handleView.bind(null, record),
            ifShow: () => {
              return true;
            },
          },
          {
            label: '删除',
            color: '#d03050',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            // auth: ['basic_list'],
          },
        ],
        select: (key) => {
          window['$message'].info(`您点击了，${key} 按钮`);
        },
      });
    },
  });

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  function addTable() {
    showModal.value = true;
  }

  const loadDataTable = async (res) => {
    return await getProductList({ ...getFieldsValue(), ...res });
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }

  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate((errors) => {
      if (!errors) {
        window['$message'].success('新建成功');
        setTimeout(() => {
          showModal.value = false;
          reloadTable();
        });
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  }

  function handleView(record: Recordable) {
    console.log('点击了编辑', record);
    const data = JSON.stringify(record);
    localStorage.setItem('productViewData', data);
    router.push({ path: '/product/productView', query: { id: record.equipmentInfoId } });
  }

  function handleDelete(record: Recordable) {
    console.log('点击了删除', record);
    window['$message'].info('点击了删除');
  }

  function handleSubmit(values: Recordable) {
    console.log(values);
    reloadTable();
  }

  function handleReset(values: Recordable) {
    console.log(values);
  }
</script>

<style lang="less" scoped></style>
