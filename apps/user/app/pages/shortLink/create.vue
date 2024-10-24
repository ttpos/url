<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import type { Form, FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: ['protected'],
})

const route = useRoute()
const router = useRouter()
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

// Computed
const isBatchMode = computed(() => route.query.mode === 'batch')
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
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    // eslint-disable-next-line no-console
    console.log(event.data)
    // TODO: Implement API call to create short link
  }
  catch (error) {
    console.error(error)
  }
}

function goBack() {
  router.back()
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <div class="flex flex-col border-b border-gray-200 dark:border-gray-800 p-4 gap-x-4 min-w-0">
        <UDashboardNavbarToggle class="pb-4 pl-0" />
        <UButton
          :padded="false"
          color="gray"
          variant="link"
          icon="i-gravity-ui:arrow-shape-turn-up-left"
          :label="t('shortLink.create.back')"
          @click="goBack"
        />
      </div>

      <UDashboardPanelContent>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight pt-3 pb-5">
          {{ t('shortLink.create.title') }}
        </h1>

        <UForm ref="formRef" :schema="schema" :state="state" class="w-full lg:w-3/5 2xl:w-2/5 space-y-6" @submit="onSubmit">
          <UFormGroup :name="t('shortLink.create.longUrl')" :label="t('shortLink.create.longUrl')" :help="t('shortLink.create.remainingLinks', { count: 10 })">
            <UTextarea v-if="isBatchMode" v-model="state.longUrl" autoresize :placeholder="t('shortLink.create.batchUrlPlaceholder')" />
            <UInput v-else v-model="state.longUrl" :placeholder="t('shortLink.create.singleUrlPlaceholder')" />
          </UFormGroup>

          <UFormGroup :label="t('shortLink.create.linkTitle')" name="title" :hint="t('common.optional')">
            <UTextarea v-if="isBatchMode" v-model="state.title" autoresize :placeholder="t('shortLink.create.batchTitlePlaceholder')" />
            <UInput v-else v-model="state.title" :placeholder="t('shortLink.create.singleTitlePlaceholder')" />
          </UFormGroup>

          <UFormGroup name="generateQrCode" :label="t('shortLink.create.qrCode')" :hint="t('common.optional')">
            <UToggle v-model="state.generateQrCode" />
            <span class="ml-2 text-gray-500 dark:text-gray-400 text-sm">{{ t('shortLink.create.generateQrCode') }}</span>
          </UFormGroup>

          <UFormGroup v-if="isBatchMode" name="domain" :label="t('shortLink.create.selectDomain')" class="flex-1">
            <USelect v-model="state.domain" :placeholder="t('shortLink.create.selectPlaceholder')" :options="domainOptions" />
          </UFormGroup>

          <UFormGroup v-else :label="t('shortLink.create.shortLinkDomain')">
            <div class="flex items-center">
              <UFormGroup name="domain" :label="t('shortLink.create.domain')" class="flex-1">
                <USelect v-model="state.domain" :placeholder="t('shortLink.create.selectPlaceholder')" :options="domainOptions" />
              </UFormGroup>
              <!-- mt-5 -->
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
              {{ t('common.cancel') }}
            </UButton>
            <UButton type="submit">
              {{ t('shortLink.create.create') }}
            </UButton>
          </div>
        </UForm>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
