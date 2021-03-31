<template>
	<div class="main_content">
    <el-card class="box-card">
      <div class="text item">
        <el-upload
          class="upload-demo"
          ref="upload"
          action=""
          methods='post'
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :limit="1"
          :file-list="fileList"
          :auto-upload="false"
          id="objfile"
          >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <el-button type="primary" size="small">
            <i class="el-icon-download">
              <a href="static/stand.xlsx" download>标准数据样式下载</a>
            </i>
          </el-button>
          <div slot="tip" class="el-upload__tip">只能上传.xlsx文件，且只能上传1个文件</div>
        </el-upload>
      </div>

      <hr>
      <el-row>
        <el-col :span="24">
          <el-card :body-style="{ padding: '0px' }" class="text">
           <div style="padding: 14px;">
             <span>标准数据格式参考</span>
           </div>
            <img src="../../assets/img/客观标准数据.png" class="image">
            <div style="padding: 14px;">
              <span>说明</span>
              <div class="bottom">
                <time class="time">{{ currentDate }}</time>
                <el-button type="text" class="button">操作按钮</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
	</div>
</template>

<script>
  import bus from '../bus.js'
	export default{
		name:'objfile',
		data() {
		    return {
		        fileList: [],
            currentDate: new Date()
		    };
		},
    created() {
    },
		methods: {
      submitUpload() {
        // this.$refs.upload.submit();
        // console.log(this.$refs.upload.$children[0].fileList[0])
        let file = this.$refs.upload.$children[0].fileList[0]
        if (file){
          console.log(file)
          let fd = new FormData();
          fd.append("file", file.raw);
          // console.log(fd)
          this.$http.post('objfile/', fd, {showLoading:true}).then(res => {
            console.log(res.data)
            if(res.data.status == 200){
              this.$message.success('解析成功！')
              console.log('所有数据打印',res.data)
              bus.$emit('change',res.data.Change)
              bus.$emit('average',res.data.Average)
              bus.$emit('entropy',res.data.Entropy)
              bus.$emit('leida',res.data.Info)
              sessionStorage.setItem('file',JSON.stringify(file.name))
              sessionStorage.setItem('change',JSON.stringify(res.data.Change))
              sessionStorage.setItem('average',JSON.stringify(res.data.Average))
              sessionStorage.setItem('entropy',JSON.stringify(res.data.Entropy))
              sessionStorage.setItem('leida',JSON.stringify(res.data.Info))
            }else{
              this.$message.error('解析失败,请检查文件内容格式!')
            }
          })
          .catch(error=>{
            this.$message.error('解析失败,请检查格式或提交方法是否正确!')
          })
        }else{
          this.$message.warning('请选择文件！')
        }

      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file, fileList) {
        console.log(file,fileList);
      }
		}
	}
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.image {
	    width: 100%;
	    display: block;
	}

.box-card {
  width: 100%;
}

</style>
