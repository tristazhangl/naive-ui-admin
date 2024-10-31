<template>
  <div>
    <div class="frame-body">
      <router-view />
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="cart-o">采购车</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script lang="ts">
  import { h, reactive, ref } from 'vue';
  export default {
    emits: [],
    props: {},
    setup(props, ctx) {
      const active = ref(0);
      return { active };
    },
  }
</script>

<style lang="less" scoped></style>