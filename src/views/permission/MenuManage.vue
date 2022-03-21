<template>
  <div>
    <el-table
      :data="data"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :expand-row-keys="extendRowKeys"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="name" label="名称" width="280"> </el-table-column>
      <el-table-column prop="permissionValue" label="权限值"> </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type != 2"
            type="info"
            icon="el-icon-plus"
            circle
            @click="handleAdd(scope, scope.$index, scope.row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="handleEdit(scope.$index, scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="dialogPermissionVisible">
      <el-form :model="permission">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="permission.name"></el-input>
        </el-form-item>
        <el-form-item label="权限值" :label-width="formLabelWidth">
          <el-input v-model="permission.permissionValue"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, save, update, del } from "services/menuManage";
import utils from "utils/utils";
export default {
  name: "menuManage",
  data() {
    return {
      data: [],
      originData: [],
      dialogPermissionVisible: false,
      permission: {
        id: "",
        name: "",
        permissionValue: "",
      },
      formLabelWidth: "80px",
      isAdd: false,
      currentPermission: {},
      extendRowKeys: [],
    };
  },
  computed: {
    title() {
      return this.isAdd ? "添加菜单" : "修改菜单";
    },
  },
  mounted() {
    this.list();
  },
  methods: {
    list() {
      list().then((res) => {
        if (res.code == this.$statusCode.SUCCESS) {
          const data = res.data.data;
          this.originData = data;
          // 处理树形数据结构
          // 筛选出第一层数据结构数据
          const list = data.filter((item) => item.parentId == 0);
          list.map((item) => {
            item.level = 1;
            // 寻找每一项的children
            const childList = this.findChild(item, data, 2);
            item.children = childList;
          });
          this.data = list;
          // 设置默认展开项
          this.extendRowKeys.push(list.length > 0 && list[0].id);
        } else {
          utils.showMessage(this.$status.ERROR, res.message);
        }
      });
    },
    findChild(item, data, level) {
      const lv = level;
      const list = data.filter((dataItem) => item.id == dataItem.parentId);
      list.map((item) => {
        item.level = lv;
        const list = this.findChild(item, data, lv + 1);
        item.children = list;
      });
      return list;
    },
    handleAdd(scope, index, row) {
      this.isAdd = true;
      this.permission = {};
      this.currentPermission = row;
      this.dialogPermissionVisible = true;
      console.log("row", row);
    },
    handleEdit(index, row) {
      this.isAdd = false;
      this.permission = { ...row };
      this.dialogPermissionVisible = true;
    },
    handleDelete(index, row) {
      del(row.id).then((res) => {
        if (res.code == this.$statusCode.SUCCESS) {
          utils.showMessage(this.$status.SUCCESS, res.message);
          this.list();
        } else {
          utils.showMessage(this.$status.ERROR, res.message);
        }
      });
    },
    cancel() {
      this.dialogPermissionVisible = false;
    },
    submit() {
      if (this.isAdd) {
        this.permission.parentId = this.currentPermission.id;
        this.permission.type = this.setTypeByfindChild(this.currentPermission);
        console.log(this.permission);
        save(JSON.stringify(this.permission)).then((res) => {
          if (res.code == this.$statusCode.SUCCESS) {
            utils.showMessage(this.$status.SUCCESS, res.message);
            this.dialogPermissionVisible = false;
            this.list();
          } else {
            utils.showMessage(this.$status.ERROR, res.message);
          }
        });
      } else {
        update(JSON.stringify(this.permission)).then((res) => {
          if (res.code == this.$statusCode.SUCCESS) {
            utils.showMessage(this.$status.SUCCESS, res.message);
            this.dialogPermissionVisible = false;
            this.list();
          } else {
            utils.showMessage(this.$status.ERROR, res.message);
          }
        });
      }
    },
    setTypeByfindChild(item) {
      if (item.level == 3) {
        return 2;
      } else {
        return 1;
      }
      // if (item.parentId == 0 || item.parentId == 1) {
      //   return 1;
      // } else {
      //   return 2;
      // }
    },
  },
};
</script>
