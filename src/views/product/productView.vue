<template>
  <div>
    <n-page-header subtitle="" @back="handleBack">
      <template #title>
        <span>设备详情</span>
      </template>
      <template #extra>
        <n-space>
          <!-- <n-button>催更</n-button> -->
        </n-space>
      </template>
    </n-page-header>

    <n-card
      :bordered="false"
      title=""
      class="mt-4 proCard"
      size="small"
      :segmented="{ content: true }"
    >
      <div class="main-item">
        <div class="main-item-label">设备名称</div>
        <div class="main-item-content">{{nowItem && nowItem.equipmentInfoName}}</div>
      </div>
      <div class="main-item">
        <div class="main-item-label">设备参数</div>
        <div class="main-item-content">
          <n-descriptions label-placement="left" class="py-2" 
            bordered size="small" columns="2"
            label-class="parm-label" content-class="parm-content">
            <n-descriptions-item label="设备种类">{{nowItem && nowItem.equipmentKind}}</n-descriptions-item>
            <n-descriptions-item label="设备型号">{{nowItem && nowItem.equipmentInfoModel}}</n-descriptions-item>
            <n-descriptions-item label="主要参数">{{nowItem && nowItem.mainParameter}}</n-descriptions-item>
            <n-descriptions-item label="材质">{{nowItem && nowItem.equMaterial}}</n-descriptions-item>
            <n-descriptions-item label="图号">{{nowItem && nowItem.drawingNo}}</n-descriptions-item>
            <n-descriptions-item label="单位">{{nowItem && nowItem.unitName}}</n-descriptions-item>
            <n-descriptions-item label="制造商">{{nowItem && nowItem.manufacturerName}}</n-descriptions-item>
          </n-descriptions>
        </div>
      </div>
    </n-card>
    <!-- 图文描述 -->
    <n-card :bordered="false" title="" class="mt-4 proCard" size="small" :segmented="{ content: true }">
      <div class="main-item">
        <div class="main-item-label">设备图片</div>
        <div class="main-item-content">
          <n-image-group>
            <n-space inline>
              <div v-for="(item,idx) in eiPictures" :key="item.photoId" class="image-wrap">
                <n-image
                  width="142"
                  height="142"
                  class="ei-image"
                  object-fit="contain"
                  :src="item.url"
                />
                <div class="image-footer">
                  <n-icon
                    size="18"
                    class="cursor-pointer"
                    :class="[idx > 0 ?'is-active': '']"
                    @click="movePicture(item,idx, 'left')"
                  >
                    <SwapLeftOutlined />
                  </n-icon>
                  <n-popconfirm
                    @positive-click="delPicture(item)"
                  >
                    <template #trigger>
                  <n-icon
                    size="14"
                    class="cursor-pointer"
                    color="#d03050"
                  >
                    <CloseOutlined />
                  </n-icon>
                      
                    </template>
                    确认删除该设材图片
                  </n-popconfirm>
                  <n-icon
                    size="18"
                    class="cursor-pointer"
                    :class="[idx < eiPictures.length-1 ?'is-active': '']"
                    @click="movePicture(item, idx,'right')"
                  >
                    <SwapRightOutlined />
                  </n-icon>
                </div>
              </div>
            </n-space>
          </n-image-group>
          <n-upload
            ref="eiPicUpload"
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            :default-file-list="previewFileList"
            :multiple="true"
            list-type="image-card"
            class="upload-box hide"
            trigger-class="upload-trigger-box"
            :custom-request="customUploadPicture"
            @preview="handlePreview"
          /> <!-- :default-upload="false" -->
        </div>
      </div>
    </n-card>
    <n-card
      :bordered="false"
      title=""
      class="mt-4 proCard"
      size="small"
      :segmented="{ content: true }"
    >
      <div class="main-item">
        <div class="main-item-label">库存表</div>
        <div class="main-item-content">
          <n-data-table
            class="batch-item-table"
            :columns="batchColumns"
            :data="batchItems"
            :pagination="pagination"
            :bordered="false"
            :max-height="250"
            :scroll-x="1090"
          />
        </div>
      </div>
    </n-card>

    <n-modal
      v-model:show="showModal"
      preset="card"
      style="width: 600px"
      title="一张很酷的图片"
    >
      <img :src="previewImageUrl" style="width: 100%">
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, onMounted, reactive, } from 'vue'
  import { useRoute } from 'vue-router';
  import type { UploadFileInfo, UploadInst, } from 'naive-ui'
  import { useRequest, } from 'alova/client';
  import moment from 'moment';
  import {
    SwapLeftOutlined,
    SwapRightOutlined,
    CloseOutlined,
  } from '@vicons/antd';
  import { uploadEIPicture, 
    getProductPictures,
    getPictureData,
    rmProductPic,
    modifyProductPic,
    getProductInfo,
  } from '@/api/product/index'
  import type { EiPicItem, } from '@/api/product/index';

  import { columns, ListData } from './columns';
import { dir } from 'console';

  const route = useRoute();
  // const viewData = reactive<{nowItem: ListData | null}>({
  //   nowItem: null,
  // })
  const queryEiId = ref<string>('');
  const eiPictures = ref<EiPicItem[]>([]);
  const nowItem = ref<ListData|null>(null);
  const batchItems = ref<ListData[]>();
  const showModal = ref(false)
  const previewImageUrl = ref('')
  const fileList = ref<UploadFileInfo>();
  const previewFileList = ref<UploadFileInfo[]>();
  const eiPicUpload = ref<UploadInst | null>(null);
  function handlePreview(file: UploadFileInfo) {
    const { url } = file
    previewImageUrl.value = url as string
    showModal.value = true
  }

  function movePicture(item:EiPicItem, idx:number, dire) {
    let next = null;
    let index = -1;
    if (dire == 'left') {
      index = idx - 1;
    } else if (dire == 'right') {
      index = idx + 1;
    }
    if (index >= 0 && index < eiPictures.value.length) {
      next = eiPictures.value[index];
      const calls = [modifyProductPic(item.photoId, index),
        modifyProductPic(next.photoId, idx)
      ]
      Promise.all(calls).then(data => { 
        if (data.every(one => one)) {
          loadPictures();
        }
      })
    }
  }

  function delPicture(item:EiPicItem) {
    rmProductPic(item.photoId).then(data => {
      if (data == true) {
        loadPictures();
      }
    })
  }


  /* 没效果，一次选多个图片，也是一个图片一个图片的触发 */
  function handlePicChange(files) {
    fileList.value = files;
    
  }

  const customUploadPicture = ({
    file,
    data,
    headers,
    withCredentials,
    action,
    onFinish,
    onError,
    onProgress
  }: UploadCustomRequestOptions) => {
    const eiId = queryEiId.value;
    if (!eiId) {
      return;
    }
    const fileArr = [file.file];
    // .send()，手动强制请求
    uploadEIPicture(eiId, fileArr).then(res => {
      if (res == true) {
        loadPictures();
        onFinish();
      }
    }).catch(err => {
      console.log('err ', err)
      onError();
    }).finally(() => {
    })
  }
  async function loadEInfo() {
    const eiId = queryEiId.value;
    const data = await getProductInfo(eiId);
    if (data.length) {
      nowItem.value = data[0];
    }
    batchItems.value = data;
  }

  async function loadPictures() {
    
    const eiId = queryEiId.value;
    const pIds =  await getProductPictures(eiId)
    const calls = pIds.map(id => {
      return getPictureData(id);
    })
    const resArr = await Promise.all(calls);
    eiPictures.value = resArr;
  }

  onMounted(() => {
    const recordId = route.query.id;
    queryEiId.value = recordId;
    loadEInfo().then(() => {
      loadPictures();
    })
  })

  const batchColumns = [
    {
      title: '批次号',
      key: 'batchId',
      width: 156,
      fixed: 'left',
    },
    {
      title: '仓库',
      key: 'storeName',
      width: 132,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '货位',
      key: 'cargoName',
      minWidth: 120,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '单位',
      key: 'unitName',
      minWidth: 120,
    },
    {
      title: '数量',
      key: 'number',
      minWidth: 120,
    },

    /* {
      title: '单重',
      key: 'pieceWeight',
      minWidth: 120,
    },
    {
      title: '总重',
      key: 'weight',
      minWidth: 120,
    }, */
    {
      title: '入库价格',
      key: 'inPrice',
      minWidth: 120,
    },
    {
      title: '出库价格',
      key: 'outPrice',
      minWidth: 120,
    },
    {
      title: '除税单价',
      key: 'noTaxPrice',
      minWidth: 120,
    },
    {
      title: '含税总价',
      key: 'totalPrice',
      minWidth: 120,
    },
    {
      title: '除税总价',
      key: 'noTaxTotalPrice',
      minWidth: 120,
    },
    {
      title: '入库类型',
      key: 'docType',
      width: 120,
    },
    {
      title: '入库时间',
      key: 'storeTime',
      width: 120,
      render(row) {
        let val = row.storeTime;
        if (!val) {
          return val;
        }
        const showTime = moment(val).format('yyyy-MM-DD');
        return showTime;
      }
    },
    {
      title: '备注',
      key: 'remark',
      ellipsis: true,
      ellipsisComponent: 'ellipsis',
    },
  ]
</script>

<style lang="less" scoped>
  .item-name {
    font-size: 16px;
    font-weight: 700;
  }
  .main-item {
    display: flex;
    padding: 8px 0;
    &-label {
      width: 120px;
      flex-grow: 0;
      color: var(--n-td-text-color);
    }
    &-content {
      flex: 1;
      color: var(--n-td-text-color);
    }

  }
  .image-wrap {
    display: flex;
    flex-direction: column;
    .image-footer {
      display: flex;
      justify-content: space-between;
      background: #fff;
      height: 20px;
      align-items: center;
      border: 1px solid var(--n-border-color);
      padding: 0 4px;
      // border-top-width: 0;
    }
  }

  .upload-box {
    display: inline-block;
    width: 120px;
    vertical-align: top;
    padding-left: 12px;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  ::v-deep {
    .parm-label {
      width: 20%;
    }
    .parm-content {
      width: 30%;
    }
    .hide.hide .n-upload-file-list .n-upload-file {
      display: none;
    }
    .ei-image {
      width: 120px;
      height: 160px;
      border: 1px solid var(--n-border-color);
      border-bottom-width: 0px;
    }
    .batch-item-table {
      width: calc(100vw - 400px);
    }
    .n-icon.is-active {
      color: #2080f0;
    }
  }
</style>

