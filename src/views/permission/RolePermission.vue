<template>
  <div class="role-permission-page">
    <el-tree
      ref="tree"
      :data="data"
      show-checkbox
      node-key="id"
      :default-expanded-keys="defaultExpandKeys"
      :default-checked-keys="defaultCheckedKeys"
      :props="defaultProps"
      @check-change="handleCheckChange"
    >
    </el-tree>
    <div class="operate-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getPermssionByRoleId, setPermissions } from "services/roleManage";
import utils from "utils/utils";
export default {
  name: "rolePermission",
  data() {
    return {
      id: "",
      data: [],
      originData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      defaultExpandKeys: [],
      defaultCheckedKeys: [],
    };
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getPermssionList(this.id);
  },
  methods: {
    getPermssionList(id) {
      getPermssionByRoleId(id).then((res) => {
        if (res.code == this.$statusCode.SUCCESS) {
          const data = res.data.data;
          this.originData = data;
          const list = this.dataTotree(data);
          this.data = list;
          //   筛选出角色已有的权限
          this.defaultCheckedKeys = data
            .filter((item) => item.checked)
            .map((item) => item.id);
          this.defaultExpandKeys = this.defaultCheckedKeys;
        } else {
          utils.showMessage(this.$status.ERROR, res.message);
        }
      });
    },
    dataTotree(data) {
      // 筛选出第一层数据
      const list = data.filter((item) => item.parentId == 0);
      //   为第一层的每个数据寻找children
      list.map((item) => {
        const child = this.findChild(item, data);
        if (child.length > 0) {
          const isChecked = child.filter((item) => !item.checked).length == 0;
          item.checked = isChecked;
        }
        item.children = child;
      });
      return list;
    },
    findChild(item, data) {
      const list = data.filter((dataItem) => dataItem.parentId == item.id);
      list.map((item) => {
        const child = this.findChild(item, data);
        if (child.length > 0) {
          const isChecked = child.filter((item) => !item.checked).length == 0;
          item.checked = isChecked;
        }
        item.children = child;
      });
      return list;
    },
    cancel() {
      this.$router.go(-1);
    },
    save() {
      const params = {};
      params.roleId = this.id;
      params.permissionIds = this.$refs.tree.getCheckedKeys();
      setPermissions(JSON.stringify(params)).then((res) => {
        if (res.code == this.$statusCode.SUCCESS) {
          utils.showMessage(this.$status.SUCCESS, res.message);
          this.$router.go(-1);
        } else {
          utils.showMessage(this.$status.ERROR, res.message);
        }
      });
    },
    handleCheckChange(data, checked, indeterminate) {
      this.defaultExpandKeys = this.$refs.tree.getCheckedKeys();
    },
  },
};
</script>

<style></style>
