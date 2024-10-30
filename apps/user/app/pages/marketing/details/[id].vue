<script setup lang="ts">
definePageMeta({
  middleware: ['protected'],
})

const marketingItem = ref(
  {
    id: 1,
    title: 'Prototype_Insights2024',
    createdAt: '2024-10-22 16:49:46',
  },
)

const items = [
  {
    slot: 'links',
    label: '短链接',
  },
  {
    slot: 'data',
    label: '数据统计',
  },
]

// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
function handleClick(_item) {}

function handleEdit(item: any) {
  console.warn('edit', item)
}
</script>

<template>
  <SubPage>
    <MarketingCard
      :item="marketingItem"
      :dropdown-items="[
        [
          {
            label: '添加链接',
            click: (item) => {
              console.log('详情被点击', item)
              handleClick(item)
            },
          },
          {
            label: '编辑',
            click: (item) => handleEdit(item),
          },
        ],
      ]"
    />
    <UTabs :items="items" class="pt-4">
      <template #links>
        123
      </template>
      <template #data>
        456
      </template>
    </UTabs>
  </SubPage>
</template>
