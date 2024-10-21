<script setup lang="ts">
definePageMeta({
  middleware: ['protected'],
})

const peopleOptions = ref([
  {
    value: 'add',
    label: 'Add Group',
    icon: 'i-ep:circle-plus',
  },
])
const typeOptions = ref([
  {
    value: '',
    label: '全部',
  },
  {
    value: '2',
    label: '随机后缀短链接',
  },
  {
    value: '3',
    label: '自定义后缀链接',
  },
  {
    value: '4',
    label: '批量短链接',
  },
])

const peopleSelected = ref('')
const typeSelected = ref()
const isOpen = ref(false)
const groupName = ref('')
const loading = ref(false)

function handleGroupsChange(val: string) {
  console.log('groups changed', val)

  if (val === 'add') {
    isOpen.value = true
  }
}

function handleSumbit() {}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <div class="flex flex-col border-b border-gray-200 dark:border-gray-800 p-4 gap-x-4 min-w-0">
        <UDashboardNavbarToggle class="pb-4 pl-0" />

        <p class="text-gray-900 dark:text-white font-semibold">
          TinyLink 短链接
        </p>

        <div class="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          TinyLink 短链接用于将长网址简化为更短、更易于分享的链接，同时保持对原始内容的访问。
        </div>

        <div class="grid lg:grid-cols-2 lg:items-start gap-4 mt-8">
          <div class="flex items-start gap-4">
            <UButton
              label="创建短链接"
              icon="i-heroicons-plus"
            />
            <UButton
              label="批量创建短链接"
              icon="i-heroicons-plus"
            />
          </div>
          <div class="flex lg:justify-end gap-4">
            <div class="flex items-center gap-2">
              <span class="text-gray-500 dark:text-gray-400 text-sm hidden lg:inline">
                分组
              </span>
              <USelectMenu
                v-model="peopleSelected"
                class="w-[9rem]"
                :clear-search-on-close="true"
                searchable
                :options="peopleOptions"
                placeholder="please Select groups"
                value-attribute="value"
                option-attribute="label"
                @change="handleGroupsChange"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-500 dark:text-gray-400 text-sm hidden lg:inline">
                类型
              </span>
              <USelectMenu
                v-model="typeSelected"
                class="w-[9rem]"
                :options="typeOptions"
                placeholder="please Select type"
                value-attribute="value"
                option-attribute="label"
              />
            </div>
          </div>
        </div>
      </div>

      <UDashboardPanelContent>
        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
          <!-- <HomeSales />
          <HomeCountries /> -->
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>

    <UModal v-model="isOpen" prevent-close>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              添加分组
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <UFormGroup label="分组名称" required :error="!groupName && '请输入分组名称'">
          <!-- <UInput v-model="groupName" placeholder="请输入分组名称" /> -->
          <UInput
            v-model="groupName"
            name="groupName"
            placeholder="请输入分组名称"
            autocomplete="off"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template #trailing>
              <UButton
                v-show="groupName !== ''"
                color="gray"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click="groupName = ''"
              />
            </template>
          </UInput>
        </UFormGroup>

        <template #footer>
          <div class="flex items-center justify-end gap-2">
            <UButton color="white" label="取消" @click="isOpen = false" />
            <UButton label="确认" :loading="loading" @click="handleSumbit" />
          </div>
        </template>
      </UCard>
    </UModal>
  </UDashboardPage>
</template>
