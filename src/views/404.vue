<template>
  <div>
    <div class="noPageBody">
      <div>4</div>
      <div><img src="@/assets/404_images/404.png" alt="404"></div>
      <div>4</div>
    </div>
    <div class="message">{{ message }}<a   @click="goHistory" class="bullshit__return-home">上一页</a><a href="" class="bullshit__return-home">返回首页</a></div>


  </div>
</template>

<script>

export default {
  name: 'Page404',
  methods: {
    goHistory() {
      this.$router.back()
    }
  },
  computed: {
    message() {
      return '您要的页面丢啦！'
    }
  }
}
</script>

<style lang="less" scoped>

.noPageBody {
  padding-top: 10%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  div:nth-child(1) {
    font-size: 5vw;
  }

  div:nth-child(3) {
    font-size: 5vw;
  }

}

.message {
  text-align: center;
  padding: 20px;
  font-size: 3vw;
}

.bullshit__return-home {
  padding: 0px 30px;
  color: white;
  background: #1751fb;
  border-radius: 30px;
}
</style>
