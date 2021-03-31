<template>
  <div>
    <el-card>
      <el-table v-loading="loading" :data="tableData.slice((currpage-1)*pagesize,currpage*pagesize).
		  filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;" height="500" :row-class-name="tableRowClassName">
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column prop="name" label="文件名称" width="250">
        </el-table-column>
        <el-table-column prop="size" label="文件大小" width="150">
        </el-table-column>
        <el-table-column prop="date" label="上传日期">
          <template #default="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="class" label="文件类别" :filters="[{ text: '客观数据类型', value: '客观数据类型' }, { text: '主观数据类型', value: '主观数据类型' }]"
          :filter-method="filterTag" width="150">
          <template #default="scope">
            <el-tag :type="scope.row.class === '客观数据类型' ? 'primary' : 'success'" disable-transitions>{{scope.row.class}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="res_time" label="解析耗时" width="150">
        </el-table-column>
        <el-table-column  align="right">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
          </template>
          <template slot-scope="scope">
            <el-button size="small " @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currpage"
        :page-sizes="page_sizes" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'record',
    data() {
      return {
        loading: false,
        tableData: [],
        pagesize: 10,
        currpage: 1,
        page_sizes: [10, 20, 30, 40, 50, 100],
        search: ''
      }
    },
    methods: {
      tableRowClassName({
        row,
        rowIndex
      }) {
        // if (this.tableData[rowIndex].class == '客观数据类型') {
        //   return 'warning-row';
        // } else{
        //   return 'success-row';
        // }
        // return '';
      },
      load_record() {
        this.loading = true
        this.$http.post('file_record/').then(res => {
          // console.log(res.data.files)
          var data = JSON.parse(res.data.files)
          // console.log(data)
          this.pages = data.length

          function transform(data) {
            let new_data = []
            for (let i = 0; i < data.length; i++) {
              let item = {}
              item['name'] = data[i].fields.F_name
              item['size'] = data[i].fields.F_size
              item['res_time'] = data[i].fields.F_time+' s'
              if (data[i].fields.F_class) {
                item['class'] = '客观数据类型'
              } else {
                item['class'] = '主观数据类型'
              }
              item['date'] = data[i].fields.F_data
              new_data.push(item)
            }
            return new_data
          }
          let table_data = transform(data)
          // console.log(table_data)
          this.loading = false
          this.tableData = table_data
        }).catch(Error => {
          this.loading = false
        })
      },

      filterTag(value, row) {
        return row.class === value;
      },

      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pagesize = val
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.currpage = val
      },

      handleEdit(index, row) {
        // console.log(index, row);
      },
      handleDelete(index, row) {
        // console.log(index, row);
      }

    },
    created() {
      this.load_record()

    }

  }
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
