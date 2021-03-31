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
              <a href="static/主观标准文件.xlsx" download>标准数据样式下载</a>
            </i>
          </el-button>
          <div slot="tip" class="el-upload__tip">只能上传.xlsx文件，且只能上传1个文件</div>
        </el-upload>
      </div>
    </el-card>
    <hr>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-table
          	v-loading="loading"
          	element-loading-text="拼命加载中"
          	element-loading-spinner="el-icon-loading"
          	element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="is_search(tableData)"
          	style="width: 100%"
          	height="450"
          	max-height="450"
          	class = "text-center"
          	>
              <el-table-column
          	    type = "index"
                label="序号"
          	    align="center"
                >
              </el-table-column>
              <el-table-column
                label="被评人"
                prop="teachers"
                width="100"
                >
              </el-table-column>
              <el-table-column
                label="内容"
                prop="con"
          	  >
              </el-table-column>
              <el-table-column
                align="right"
                width="250"
                >
                <template slot="header" slot-scope="scope">
                  <el-input
                    v-model="search"
                    size="mini"
                    placeholder="输入关键字搜索"/>
                </template>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
          <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currpage"
                :page-sizes="page_sizes"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="get_tablen(tableData)">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
	</div>
</template>

<script>
  import bus from '../bus.js'
	export default{
		name:'subfile',
		data() {
		    return {
		        fileList: [],
            tableData:[],
            search: '',
            pagesize:100,
            currpage:1,
            page_sizes:[100, 200, 300, 400],
            loading: false
		    };
		},
    created() {
      this.tableData = JSON.parse(sessionStorage.getItem('text'))
    },
		methods: {
      submitUpload() {
        let file = this.$refs.upload.$children[0].fileList[0]
        if (file){
          console.log(file)
          let fd = new FormData();
          fd.append("file", file.raw);
          // console.log(fd)
          this.$http.post('subfile/', fd, {showLoading:true}).then(res => {
            if(res.data.status == 200){
              this.$message.success('解析成功！')
              console.log('所有数据打印',res.data)
              this.tableData = res.data.text
              bus.$emit('rante',res.data.text)
              bus.$emit('class',res.data.class)
              sessionStorage.setItem('subfile',JSON.stringify(file.name))
              sessionStorage.setItem('text',JSON.stringify(res.data.text))
              sessionStorage.setItem('class',JSON.stringify(res.data.class))
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
      get_tablen(tableData){
        if(tableData == null){
          return 0
        }
        else{
          return tableData.length
        }
      },
      is_search(tableData){
        if(tableData == null){
          return tableData
        }
        else{
          return tableData.slice((this.currpage-1)*this.pagesize,this.currpage*this.pagesize)
                .filter(data => !this.search || data.con.toLowerCase()
                .includes(this.search.toLowerCase()))
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file, fileList) {
        console.log(file,fileList);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagesize = val
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currpage = val
      }
		},
    mounted() {
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
