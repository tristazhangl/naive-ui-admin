<template>
  <div>
    <van-button plain type="primary" @click="addToCart">加入采购车</van-button>
    <van-grid :column-num="3">
      <van-grid-item v-for="value in 6" :key="value" icon="photo-o" text="Text" />
    </van-grid>
    <van-dialog v-model:show="show" title="Title" show-cancel-button>
      <img src="https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg" />
    </van-dialog>
    <van-popup v-model:show="showDia" closeable round :style="{ height: '30%' }" >
      <div style="width: 95vw;">
        <van-cell-group inset>
          <van-field v-model="cartForm.quantity" type="number" label="Number" />
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>
<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';

  
  const showDia = ref(true);
  const cartForm = reactive({
    quantity: '',
  })
  function addToCart() {

  }
</script>

<style lang="less" scoped></style>