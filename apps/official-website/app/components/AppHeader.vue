<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]))

const links = [
  {
    label: 'Product Features',
    icon: 'i-heroicons-book-open',
    to: '/features',
    description: '探索我们的核心产品功能，助力您的业务增长',
    children: [
      {
        label: '短链接',
        icon: 'i-heroicons-link',
        to: '/features/shortLink',
        description: '将冗长的URL转换为简洁的短链接，提升分享效率和用户体验',
      },
      {
        label: 'QR Code',
        icon: 'i-heroicons-qr-code',
        to: '/features/qrc',
        description: '生成美观且可定制的二维码，连接线上线下场景',
      },
      {
        label: '自定义域名',
        icon: 'i-gridicons:domains',
        to: '/features/domain',
        description: '使用自有品牌域名，提升专业形象与品牌认知',
      },
      {
        label: '营销活动',
        icon: 'i-hugeicons:marketing',
        to: '/features/marketing',
        description: '策划和管理营销活动，提升转化率和客户参与度',
      },
    ],
  },
  {
    label: 'Solutions',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/solutions',
    description: '面向不同场景的专业解决方案',
    children: [
      {
        label: '二维码菜单',
        to: '/solutions/qr-menu',
        icon: 'i-heroicons-squares-2x2',
        description: '创建交互式二维码菜单，优化餐饮服务体验',
      },
      {
        label: '短信营销',
        to: '/solutions/sms-marketing',
        icon: 'i-heroicons-chat-bubble-left-right',
        description: '精准触达目标用户，提供个性化短信营销服务',
      },
      {
        label: '预先生成二维码',
        to: '/solutions/bulk-qr',
        icon: 'i-heroicons-queue-list',
        description: '批量生成和管理二维码，适用于大规模营销活动',
      },
      {
        label: '营销活动数据统计',
        to: '/solutions/analytics',
        icon: 'i-heroicons-chart-bar',
        description: '全方位数据分析，助您做出明智的营销决策',
      },
    ],
  },
  {
    label: 'About US',
    icon: 'i-heroicons-rocket-launch',
    to: '/about',
  },
]
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      TinyLink
    </template>

    <template #right>
      <UButton
        label="Sign in"
        color="gray"
        to="/login"
      />
      <UButton
        label="Sign up"
        icon="i-heroicons-arrow-right-20-solid"
        trailing
        color="black"
        to="/signup"
        class="hidden lg:flex"
      />
    </template>

    <template #panel>
      <UNavigationTree
        :links="mapContentNavigation(navigation)"
        default-open
      />
    </template>
  </UHeader>
</template>
