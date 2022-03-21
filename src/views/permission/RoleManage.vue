<template>
  <div class="role-page">
    <div class="add-btn">
      <el-button type="primary" @click="add">添加</el-button>
    </div>
    <el-table :data="data" border style="width: 100%">
      <el-table-column type="index" label="序号" width="50"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="success"
            icon="el-icon-info"
            circle
            @click="setRolePermission(scope.$index, scope.row)"
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
    <el-dialog :title="title" :visible.sync="dialogRoleVisible">
      <el-form :model="role">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="role.roleName"></el-input>
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
import { list, save, update, del } from "services/roleManage";
import utils from "utils/utils";
export default {
  name: "roleManage",
  data() {
    return {
      data: [],
      role: {
        roleName: "",
      },
      dialogRoleVisible: false,
      formLabelWidth: "80px",
    };
  },
  computed: {
    title() {
      return this.role.id ? "修改角色" : "添加角色";
    },
  },
  mounted() {
    this.list();
  },
  methods: {
    list() {
      list().then((res) => {
        if (res.code == this.$statusCode.SUCCESS) {
          this.data = res.data.data;
        } else {
          utils.showMessage(this.$status.ERROR, res.message);
        }
      });
    },
    add() {
      this.role = {};
      this.dialogRoleVisible = true;
    },
    cancel() {
      this.dialogRoleVisible = false;
    },
    submit() {
      if (this.role.id) {
        update(JSON.stringify(this.role)).then((res) => {
          if (res.code == this.$statusCode.SUCCESS) {
            utils.showMessage(this.$status.SUCCESS, res.message);
            this.dialogRoleVisible = false;
            this.list();
          } else {
            utils.showMessage(this.$status.ERROR, res.message);
          }
        });
      } else {
        save(JSON.stringify(this.role)).then((res) => {
          if (res.code == this.$statusCode.SUCCESS) {
            this.dialogRoleVisible = false;
            this.list();
          } else {
            utils.showMessage(this.$status.ERROR, res.message);
          }
        });
      }
    },
    setRolePermission(index, row) {
      this.$router.push({ path: `/acl/rolePermission/${row.id}` });
    },
    handleEdit(index, row) {
      this.role = { ...row };
      this.dialogRoleVisible = true;
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
  },
};
</script>
