<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <el-dropdown class="avatar-container">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>

          <el-dropdown-item @click.native="updateUserInfo('avatar','修改头像')">
            <span style="display:block;">修改头像</span>
          </el-dropdown-item>

          <el-dropdown-item @click.native="updateUserInfo('password','修改密码')">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>

          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="mainDrawer">
        <el-drawer
          :visible.sync="drawerVisbile"
          :with-header="true"
          :title="drawerTitle"
          :before-close="()=>{
          drawerVisbile = false
        }"
        >
          <update-password v-show="drawerType === 'password'"></update-password>
          <ImageUpload v-if="drawerType === 'avatar'" ref="fileUpload"
                       upload-folder-name="avatar"
                       uploadDisplayType="other"
                       buttonName="上传头像"
                       @uploadSuccess="uploadSuccess" style="margin: 50px;"
          />

        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script>
import ImageUpload from '@/components/UploadFile/ImageUpload'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import store from './index'
import UpdatePassword from '@/views/user/updatePassword'
import { setUserAvator } from '@/api/user'

export default {
  provide() {
    return {
      logout: this.logout
    }
  },
  components: {
    UpdatePassword,
    ImageUpload,
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])

  },
  data() {
    return {
      drawerTitle: '标题',
      drawerVisbile: false,
      drawerType: ''
    }
  },
  methods: {
    uploadSuccess(param) {
      if (param.length !== 0) {
        setUserAvator({ 'avatar': param[0]['url'] })
        this.$message.success(`头像上传成功`)
        setTimeout(() => {
          this.drawerVisbile = false
        })
        this.$store.dispatch('user/getInfo')
      }
    },
    updateUserInfo(type, name) {
      this.drawerTitle = name
      this.drawerType = type
      this.drawerVisbile = true
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      window.localStorage.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.mainDrawer ::v-deep .el-drawer__header{
  margin-bottom: 0px;
}
</style>
