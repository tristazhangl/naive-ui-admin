<template>
  <div>
    <n-page-header subtitle="" @back="handleBack">
      <template #title>
        <span>设备详情</span>
      </template>
      <template #extra>
        <n-space>
          <n-button>催更</n-button>
          <n-dropdown :options="options" placement="bottom-start">
            <n-button :bordered="false" style="padding: 0 4px">
              ···
            </n-button>
          </n-dropdown>
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
              <div v-for="item in eiPictures" :key="item.photoId" class="image-wrap">
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
                    @click="movePicture(item, 'left')"
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
                    @click="movePicture(item, 'right')"
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
          />
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

          <n-table :bordered="false" :single-line="false">
            <thead>
              <tr>
                <th>姓名</th>
                <th>性别</th>
                <th>城市</th>
                <th>生日</th>
                <th width="150">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ah jung</td>
                <td>男</td>
                <td>深圳</td>
                <td>1993-11-09</td>
                <td>
                  <n-space>
                    <n-button size="small" type="error">删除</n-button>
                    <n-button size="small" type="info">查看</n-button>
                  </n-space>
                </td>
              </tr>
              <tr>
                <td>西门飞雪</td>
                <td>男</td>
                <td>广州</td>
                <td>1991-09-11</td>
                <td>
                  <n-space>
                    <n-button size="small" type="error">删除</n-button>
                    <n-button size="small" type="info">查看</n-button>
                  </n-space>
                </td>
              </tr>
              <tr>
                <td>泰坦巨人</td>
                <td>男</td>
                <td>北京</td>
                <td>1990-11-03</td>
                <td>
                  <n-space>
                    <n-button size="small" type="error">删除</n-button>
                    <n-button size="small" type="info">查看</n-button>
                  </n-space>
                </td>
              </tr>
              <tr>
                <td>猎魔人</td>
                <td>女</td>
                <td>上海</td>
                <td>1992-03-11</td>
                <td>
                  <n-space>
                    <n-button size="small" type="error">删除</n-button>
                    <n-button size="small" type="info">查看</n-button>
                  </n-space>
                </td>
              </tr>
            </tbody>
          </n-table>
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
  import { useRequest } from 'alova/client';

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
  } from '@/api/product/index'
  import type { EiPicItem, } from '@/api/product/index';

  import { columns, ListData } from './columns';

  const route = useRoute();
  // const viewData = reactive<{nowItem: ListData | null}>({
  //   nowItem: null,
  // })
  const queryEiId = ref<string>('');
  const eiPictures = ref<EiPicItem[]>([]);
  const nowItem = ref<ListData|null>(null);
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

  function movePicture(item, dire) {

  }

  function delPicture(item:EiPicItem) {
    rmProductPic(item.photoId).then(data => {
      console.log(data)
      if (data == true) {
        loadPictures();
      }
    })
  }

  /* 没效果，一次选多个图片，也是一个图片一个图片的触发 */
  function handlePicChange(files) {
    fileList.value = files;
    const eiId = queryEiId.value;
    if (!eiId) {
      return;
    }
    const fileArr = files.map(one => one.file);
    uploadEIPicture(eiId, fileArr).then(res => {
      if (res == true) {
        loadPictures();
      }
    }).catch(err => {
    }).finally(() => {
      fileList.value = [];
      eiPicUpload.value && eiPicUpload.value.clear();
    })
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
    console.log('upload.. ')
    const eiId = queryEiId.value;
    if (!eiId) {
      return;
    }
    const fileArr = [file.file];
    const { send, onSuccess: uploadSuccess} = useRequest((eiId, fileArr) => {
      return uploadEIPicture(eiId, fileArr);
    })
    send(eiId, fileArr).then(res => {
      console.log('res ', res)
      if (res == true) {
        loadPictures();
        onFinish();
      }
    }).catch(err => {
      console.log('err ', err)
      onError();
    }).finally(() => {
    })
    uploadSuccess(data => {
      console.log('up sucess ', data)
    })
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
    const data = localStorage.getItem('productViewData');
    if (data) {
      let item: ListData = JSON.parse(data);
      console.log('item ', item)
      const recordId = route.query.id;
      queryEiId.value = recordId;
      if (item.equipmentInfoId == recordId) {
        nowItem.value = item;
        loadPictures();
      } 
    }
  })
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
  }
</style>

