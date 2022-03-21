<template>
  <div class="user-page">
    <div class="add-btn">
      <el-button type="primary" @click="add">添加</el-button>
    </div>
    <el-table :data="data" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="50"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="120">
      </el-table-column>
      <el-table-column prop="nickName" label="用户昵称" width="120">
      </el-table-column>
      <el-table-column prop="roleNames" label="权限列表"> </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="180">
      </el-table-column>
      <el-table-column prop="gmtModified" label="更新时间" width="180">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="success"
            icon="el-icon-user-solid"
            circle
            @click="setRole(scope.$index, scope.row)"
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
    <el-dialog
      :title="title"
      :visible.sync="dialogUserVisible"
      @close="dialogUserRoleVisibleClose"
    >
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input
            v-model="user.username"
            :disabled="Boolean(user.id)"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户昵称"
          :label-width="formLabelWidth"
          prop="nickName"
        >
          <el-input v-model="user.nickName"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input v-model="user.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置角色" :visible.sync="dialogUserRoleVisible">
      <el-form :model="userRole">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="userRole.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色列表" :label-width="formLabelWidth">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="checkedRole"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox v-for="role in roleList" :label="role" :key="role">{{
              getRoleNameByid(role)
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSetUserRole">取 消</el-button>
        <el-button type="primary" @click="setUserRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  list,
  save,
  update,
  del,
  findRolesByUid,
  setRoles,
} from "services/userManage";
import utils from "utils/utils";
export default {
  name: "userManage",
  data() {
    return {
      data: [],
      dialogUserVisible: false,
      dialogUserRoleVisible: false,
      user: {
        username: "",
        nickName: "",
        password: "",
      },
      formLabelWidth: "80px",
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "submit" },
        ],
        nickName: [
          { required: true, message: "请输入用户昵称", trigger: "submit" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "submit" },
        ],
      },
      userRole: {
        username: "",
        roles: [],
      },
      checkAll: false,
      checkedRole: [],
      roleList: [],
      originRoles: [],
      isIndeterminate: false,
    };
  },
  computed: {
    title() {
      return this.user.id ? "修改用户" : "添加用户";
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
      this.user = {};
      this.dialogUserVisible = true;
    },
    cancel() {
      this.dialogUserVisible = false;
    },
    dialogUserRoleVisibleClose() {
      this.$refs["userForm"].resetFields();
    },
    submit() {
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          if (this.user.id) {
            update(JSON.stringify(this.user)).then((res) => {
              if (res.code == this.$statusCode.SUCCESS) {
                this.dialogUserVisible = false;
                utils.showMessage(this.$status.SUCCESS, res.message);
                this.list();
              } else {
                utils.showMessage(this.$status.ERROR, res.message);
              }
            });
          } else {
            save(JSON.stringify(this.user)).then((res) => {
              if (res.code == this.$statusCode.SUCCESS) {
                this.dialogUserVisible = false;
                utils.showMessage(this.$status.SUCCESS, res.message);
                this.list();
              } else {
                utils.showMessage(this.$status.ERROR, res.message);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    handleEdit(index, row) {
      this.user = { ...row };
      this.dialogUserVisible = true;
    },
    handleDelete(index, row) {
      del(row.id).then((res) => {
        if (res.code == this.$statusCode.SUCCESS) {
          utils.showMessage(this.$status.SUCCESS, res.message);
          this.list();
        } else {
          utils.showMessage(this.$status.ERROR, res.maessage);
        }
      });
    },
    setRole(index, row) {
      //  查询角色列表
      findRolesByUid(row.id).then((res) => {
        if (res.code == this.$statusCode.SUCCESS) {
          const data = res.data.data;
          this.originRoles = data;
          this.userRole = row;
          // 获取选中的角色
          this.checkedRole = data
            .filter((item) => item.checked)
            .map((item) => item.id);
          this.roleList = res.data.data.map((item) => item.id);
          this.dialogUserRoleVisible = true;
          this.isIndeterminate =
            this.checkedRole.length > 0 &&
            this.checkedRole.length < this.roleList.length;
          this.checkAll = this.checkedRole.length == this.roleList.length;
        } else {
          utils.showMessage(this.$status.ERROR, res.message);
        }
      });
    },
    getRoleNameByid(id) {
      const role = this.originRoles.filter((item) => item.id == id);
      return role[0].roleName;
    },
    handleCheckAllChange(val) {
      this.checkedRole = val ? this.roleList : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.roleList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.roleList.length;
    },
    setUserRole() {
      const params = {};
      params.uid = this.userRole.id;
      params.roleIds = this.checkedRole;
      setRoles(JSON.stringify(params)).then((res) => {
        if (res.code == this.$statusCode.SUCCESS) {
          utils.showMessage(this.$status.SUCCESS, res.message);
          this.dialogUserRoleVisible = false;
          this.list();
        } else {
          utils.showMessage(this.$status.ERROR, res.message);
        }
      });
    },
    cancelSetUserRole() {
      this.dialogUserRoleVisible = false;
      this.isIndeterminate = false;
      this.checkedRole = [];
    },
  },
};
</script>
