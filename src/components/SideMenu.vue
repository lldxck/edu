<template>
  <div>
    <el-submenu :index="item.name" :key="item.name" v-if="item.isHasChild">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{ item.meta.title }}</span>
      </template>
      <template v-for="cItem in item.children">
        <router-link
          :to="`${item.path}/${cItem.path}`"
          :key="cItem.path"
          v-if="!item.hidden"
        >
          <el-menu-item :index="cItem.name" v-if="!cItem.hidden">{{
            cItem.meta.title
          }}</el-menu-item></router-link
        >
      </template>
    </el-submenu>
    <router-link :to="item.path" v-else>
      <el-menu-item :index="item.name">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ item.meta.title }}</span>
      </el-menu-item></router-link
    >
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>
