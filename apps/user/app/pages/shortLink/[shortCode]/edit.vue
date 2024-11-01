<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { z } from 'zod'
import type { Form, FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: ['protected'],
})

const route = useRoute()
const shortCode = route.params.shortCode as string

const shortLinkDetails = ref({})
const isLoading = ref(true)
const error = ref(null)

if (!shortCode) {
  navigateTo('/shortLink', {
    replace: true,
  })
}

// eslint-disable-next-line no-console
console.log('Short Code:', shortCode)

const { t } = useI18n()

// Variables
const state = reactive({
  longUrl: '',
  title: '',
  domain: '',
  customSuffix: '',
  generateQrCode: false,
  group: '',
})

const schema = z.object({
  longUrl: z.string().url(t('shortLink.create.validUrl')).min(1, t('shortLink.create.requiredField')),
  title: z.string().optional(),
  domain: z.string().min(1, t('shortLink.create.requiredField')),
  customSuffix: z.string().optional(),
  generateQrCode: z.boolean(),
  group: z.string().optional(),
})

type Schema = z.infer<typeof schema>

const formRef = ref<Form<Schema> | null>(null)

const domainOptions = computed(() =>
  [
    { label: t('shortLink.create.domain1'), value: 'domain-1' },
    { label: t('shortLink.create.domain2'), value: 'domain-2' },
    { label: t('shortLink.create.domain3'), value: 'domain-3' },
  ],
)
const groupOptions = computed(() =>
  [
    { label: t('shortLink.create.group1'), value: 'group-1' },
    { label: t('shortLink.create.group2'), value: 'group-2' },
    { label: t('shortLink.create.group3'), value: 'group-3' },
  ],
)

// Functions

// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
async function _fetchShortLinkDetails() {
  isLoading.value = true
  error.value = null
  try {
    // TODO:
    const response = await fetch(`/api/shortlinks/${shortCode}`)
    if (!response.ok) {
      throw new Error('Failed to fetch short link details')
    }
    const data = await response.json() || {}
    shortLinkDetails.value = data
    // 用获取到的数据更新状态
    Object.assign(state, data)
  }
  catch (e: any) {
    console.error('Error fetching short link details:', e)
    error.value = e.message
  }
  finally {
    isLoading.value = false
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    // eslint-disable-next-line no-console
    console.log(event.data)
    // TODO: Implement API call to create short link

    // navigateTo('/shortLink', {
    //   replace: true,
    // })
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <SubPage :title="$t('shortLink.editPage.title')">
    <UForm ref="formRef" :schema="schema" :state="state" class="w-full lg:w-3/5 2xl:w-2/5 space-y-6" @submit="onSubmit">
      <UFormGroup :name="t('shortLink.create.redirectUrl')" :label="t('shortLink.create.redirectUrl')" :help="t('shortLink.create.remainingLinks', { count: 10 })">
        <UInput v-model="state.longUrl" :placeholder="t('shortLink.create.singleUrlPlaceholder')" />
      </UFormGroup>

      <UFormGroup :label="t('shortLink.create.linkTitle')" name="title" :hint="t('common.operation.optional')">
        <UInput v-model="state.title" :placeholder="t('shortLink.create.singleTitlePlaceholder')" />
      </UFormGroup>

      <UFormGroup :label="t('shortLink.create.shortLinkDomain')">
        <div class="flex items-center">
          <UFormGroup name="domain" :label="t('shortLink.create.domain')" class="flex-1">
            <USelect v-model="state.domain" :placeholder="t('shortLink.create.selectPlaceholder')" :options="domainOptions" />
          </UFormGroup>
          <div class="flex items-center px-4">
            <UDivider label="/" orientation="vertical" />
          </div>
          <UFormGroup name="customSuffix" :label="t('shortLink.create.customSuffix')" class="flex-1">
            <UInput v-model="state.customSuffix" :placeholder="t('shortLink.create.customSuffixPlaceholder')" />
          </UFormGroup>
        </div>
      </UFormGroup>

      <UFormGroup name="group" :label="t('shortLink.create.group')">
        <USelect v-model="state.group" :placeholder="t('shortLink.create.selectPlaceholder')" :options="groupOptions" />
      </UFormGroup>

      <div class="flex space-x-4">
        <UButton variant="outline" @click="formRef && formRef.clear()">
          {{ t('common.operation.reset') }}
        </UButton>
        <UButton type="submit">
          {{ t('common.operation.save') }}
        </UButton>
      </div>
    </UForm>
  </SubPage>
</template>
