<template>
  <el-menu :default-active="Index"
           :uniqueOpened="true"
           :style=" { width: '200px' } "
           background-color="#324054"
           text-color="#F3F3F4" router>
    <el-submenu :index="menu.name" v-for="menu in menuList" :key="menu.title">
      <template #title>
        <i :class="menu.icon" class="menu-icon"></i>
        <span>{{menu.title}}</span>
      </template>
      <div class="menu-item-back">
        <el-menu-item :index="item.name" v-for="item in menu.children" :key="item.name" @click="selectMenu(item)">
            <i :class="item.icon" class="menu-icon"></i>
            <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </div>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      menuList: [
        // {
        //   name: '2',
        //   icon: 'el-icon-s-goods',
        //   title: '商品',
        //   children: [
        //     {
        //       name: '/product/list',
        //       icon: 'el-icon-goods',
        //       title: '商品列表',
        //     },
        //     {
        //       name: '/product/add',
        //       icon: 'el-icon-circle-plus-outline',
        //       title: '添加商品',
        //     },
        //     {
        //       name: '/product/category',
        //       icon: 'el-icon-price-tag',
        //       title: '类目管理',
        //     },
        //     {
        //       name: '/product/brand',
        //       icon: 'el-icon-price-tag',
        //       title: '品牌管理',
        //     }
        //   ]
        // },
        {
          name: '2',
          icon: 'el-icon-s-goods',
          title: '大盘回溯',
          children: [
            {
              name: '/backtrack/uploadPrice',
              icon: 'el-icon-tickets',
              title: '大盘行情',
            },
            {
              name: '/backtrack/getOrder',
              icon: 'el-icon-tickets',
              title: '预测回溯',
            },
            {
              name: '/backtrack/historyExpectation',
              icon: 'el-icon-tickets',
              title: '历史预测',
            }
          ]
        },
        {
          name: '3',
          icon: 'el-icon-s-order',
          title: '报价预测',
          children: [
            // {
            //   name: '/quotation/semimonth',
            //   icon: 'el-icon-tickets',
            //   title: '半月报',
            // },
            {
              name: '/quotation/ceamonth',
              icon: 'el-icon-tickets',
              title: 'CEA月度',
            },
            {
              name: '/quotation/ccermonth',
              icon: 'el-icon-tickets',
              title: 'CCER月度',
            },
            {
              name: '/quotation/year',
              icon: 'el-icon-tickets',
              title: 'CEA年度',
            },
            {
              name: '/quotation/gecmonth',
              icon: 'el-icon-tickets',
              title: 'GEC月度',
            },
          ]
        },
        {
          name: '4',
          icon: 'el-icon-s-order',
          title: '场外撮合交易',
          children: [
            {
              name: '/transaction/notition',
              icon: 'el-icon-coin',
              title: '交易通知',
            },
            {
              name: '/transaction/buyerTransaction',
              icon: 'el-icon-coin',
              title: '买方交易',
            },
            {
              name: '/transaction/sellerTransaction',
              icon: 'el-icon-coin',
              title: '卖方交易',
            },
          ]
        },
        {
          name: '5',
          icon: 'el-icon-user-solid',
          title: '用户',
          children: [
            {
              name: '/user/manage',
              icon: 'el-icon-coin',
              title: '用户列表',
            },
            {
              name: '/change/password',
              icon: 'el-icon-lock',
              title: '修改密码',
            }
          ]
        }
      ]
    }
  },
  computed: {
    Index: {
      get() {
        return this.$store.state.editableTabsValue
      },
      // set(val) {
      //   this.$store.state.editableTabsValue = val
      // }
    },
    editableTabsValue: {
      get() {
        return this.$store.state.editableTabsValue
      },
      set(val) {
        this.$store.state.editableTabsValue = val
      }
    }
  },
  methods: {
    selectMenu(item) {
      this.$store.commit("addTab", item)
    }
  }
}
</script>

<style scoped>
.menu-icon {
  margin-bottom: 3px;
  color: #fff;
}
.menu-item-back{
  background-color: #3e4b5e;
}
</style>
<style>
.el-menu-item {
  background: none !important;
  color: #ecebeb;
}
.el-menu-item.is-active {
  background-color: #409eff !important;
  color: #fff;
  border-radius: 3px;
}
.el-submenu__title:hover {
  background: none !important;
}
</style>