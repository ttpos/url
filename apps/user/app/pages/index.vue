<script setup lang="ts">
definePageMeta({
  middleware: ['protected'],
})

const { t } = useI18n()

const peopleOptions = computed(() =>
  [
    {
      value: 'add',
      label: t('shortLink.addGroup'),
      icon: 'i-ep:circle-plus',
    },
  ],
)

const typeOptions = computed(() =>
  [
    {
      value: '',
      label: t('shortLink.all'),
    },
    {
      value: '2',
      label: t('shortLink.randomSuffix'),
    },
    {
      value: '3',
      label: t('shortLink.customSuffix'),
    },
    {
      value: '4',
      label: t('shortLink.batchShortLink'),
    },
  ],
)

const dropdownItems = computed(() =>
  [
    [
      {
        label: t('shortLink.details'),
        icon: 'i-heroicons:document-magnifying-glass',
      },
      {
        label: t('shortLink.delete'),
        icon: 'i-heroicons:trash',
      },
    ],
  ],
)

const peopleSelected = ref('')
const typeSelected = ref()
const isOpen = ref(false)
const groupName = ref('')
const loading = ref(false)
const page = ref(1)
const items = ref(Array.from({ length: 55 }))

function handleGroupsChange(val: string) {
  // eslint-disable-next-line no-console
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
          {{ t('shortLink.title') }}
        </p>

        <div class="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          {{ t('shortLink.description') }}
        </div>

        <div class="grid lg:grid-cols-2 lg:items-start gap-4 mt-8">
          <div class="flex items-start gap-4">
            <UButton
              :label="t('shortLink.createShortLink')"
              icon="i-heroicons-plus"
            />
            <UButton
              :label="t('shortLink.batchCreateShortLink')"
              icon="i-heroicons-plus"
            />
          </div>
          <div class="flex lg:justify-end gap-4">
            <div class="flex items-center gap-2">
              <span class="text-gray-500 dark:text-gray-400 text-sm hidden lg:inline">
                {{ t('shortLink.group') }}
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
                {{ t('shortLink.type') }}
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
        <div class="grid gap-8">
          <UCard
            v-for="(item) in 4"
            :key="item"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-start justify-between gap-4 font-medium text-gray-700 dark:text-gray-200">
                  <UCheckbox :model-value="false" />

                  <UIcon name="i-heroicons-light-bulb" class="w-5 h-5" />
                  <p>
                    OpenAI 任命政治老将莱恩为全球政策主管
                  </p>
                </div>

                <div class="flex items-start gap-4">
                  <UTooltip :text="t('shortLink.copy')">
  <UButton
    icon="i-ic:baseline-content-copy"
    variant="ghost"
  />
</UTooltip>

<UTooltip :text="t('shortLink.share')">
  <UButton
    icon="i-heroicons:arrow-top-right-on-square-solid"
    variant="ghost"
  />
</UTooltip>

<UTooltip :text="t('shortLink.edit')">
  <UButton
    icon="i-heroicons:pencil-square"
    variant="ghost"
  />
</UTooltip>

                  <UDropdown :items="dropdownItems" mode="hover">
                    <UButton
                      icon="i-heroicons-ellipsis-vertical"
                      variant="ghost"
                    />
                  </UDropdown>
                </div>
              </div>
            </template>

            <div class="flex items-start flex-col gap-4">
              <UButton
                to="tiny.com/4g4eaaa"
                :padded="false"
                variant="link"
                target="_blank"
              >
                tiny.com/4g4eaaa
              </UButton>
              <UButton
                to="https://volta.net"
                :padded="false"
                variant="link"
                target="_blank"
                color="black"
              >
                https://readhub.cn/topic/8cUL78YJZ5P
              </UButton>
            </div>

            <template #footer>
              <div class="flex items-start gap-4">
                <UBadge label="2024-10-22 16:49:46" variant="subtle" />
                <UBadge label="Default Group" variant="subtle" />
              </div>
            </template>
          </UCard>
          <!-- <HomeSales />
          <HomeCountries /> -->
        </div>

        <div class="flex justify-end mt-8">
          <UPagination v-model="page" :page-count="5" :total="items.length" />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>

    <UModal v-model="isOpen" prevent-close>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ t('shortLink.addGroup') }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <UFormGroup :label="t('shortLink.groupName')" required :error="!groupName && t('shortLink.pleaseEnterGroupName')">
          <UInput
            v-model="groupName"
            name="groupName"
            :placeholder="t('shortLink.pleaseEnterGroupName')"
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
            <UButton color="white" :label="t('shortLink.cancel')" @click="isOpen = false" />
            <UButton :label="t('shortLink.confirm')" :loading="loading" @click="handleSumbit" />
          </div>
        </template>
      </UCard>
    </UModal>
  </UDashboardPage>
</template>
