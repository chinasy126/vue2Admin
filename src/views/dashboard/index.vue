<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <el-button @click="getMockJsData"> mockjs</el-button>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList } from '@/api/table1'

export default {
  name: 'Dashboard',
  components: { },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {
    // this.$refs.imgpath.setEditImg('202212/3b01a8c6-aaf1-4bc3-8133-9d98c3f56974.jpg')
  },
  methods: {
    uploadSuccess(param) {
      console.log(param)
    },

    getMockJsData() {
      getList().then(response => {
        console.log(response)
      })
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
