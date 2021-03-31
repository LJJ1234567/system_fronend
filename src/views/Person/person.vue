<template>
  <div>
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <i class="el-icon-user"><span>&nbsp;个人信息</span></i>
        <el-button style="float: right; padding: 3px 0"
                   type="text" @click='edit'>编辑</el-button>
      </div>
      <div>
        <el-form :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          :disabled ="is_edit"
          >
          <el-form-item label="用户头像" prop="vatar">
            <div class="block"><el-avatar :size="80" :src="avatar_url+avatar"></el-avatar></div>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :limit=1
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">更改头像</el-button>
          </el-upload>
          </el-form-item>
          <el-form-item label="用户名" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="region">
            <el-select v-model="ruleForm.sex" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="ruleForm.mail" type="email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name:'person',
    data () {
      return {
          is_edit:true,
          avatar_url:'http://127.0.0.1:8000/media/',
          circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
          fileList:[],
          ruleForm: {
            name: '',
            sex: '',
            password:'',
            mail:''
          },
          rules: {
            name: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            sex: [
              { required: true, message: '请选择性别', trigger: 'change' }
            ],
            password:[
              { required: true, message: '请选择添加密码', trigger: 'change' }
            ],
            mail:[
              { required: false, message: '请选择添加密码', trigger: 'change' }
            ]
          }
      }
    },
    created() {
      this.ruleForm.name = this.$store.getters.name,
      this.ruleForm.password = this.$store.getters.pass,
      this.ruleForm.sex = this.$store.getters.sex
      
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'name'
      ]),

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message.success('提交成功!')
            this.edit()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
         this.$refs[formName].resetFields();
      },
      edit(){
        this.is_edit = ! this.is_edit
      },

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
    }
  }
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

// .box-card {
//   width: 480px;
// }
</style>
