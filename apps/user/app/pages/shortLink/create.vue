<script setup lang="ts">
// import QrcodeVue from 'qrcode.vue'
import { computed, reactive, ref } from 'vue'

import { useRoute } from 'vue-router'

import { z } from 'zod'
import type { Form, FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: ['protected'],
})

const requestURL = useRequestURL()
const route = useRoute()
const { t } = useI18n()

const fileRef = ref<HTMLInputElement>()

const colorList = [
  '#000000',
  '#DE3121',
  '#EF8000',
  '#198639',
  '#229CE0',
  '#2A5BD7',
  '#6B52D1',
  '#D84280',
]

// Variables
const state = reactive({
  longUrl: '',
  title: '',
  domain: '',
  customSuffix: '',
  generateQrCode: false,
  avatar: '',
  group: '',
  selectedColor: '#000000',
})

const schema = z.object({
  longUrl: z
    .string()
    .url(t('shortLink.create.validUrl'))
    .min(1, t('shortLink.create.requiredField')),
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
const domainOptions = computed(() => [
  { label: t('shortLink.create.domain1'), value: 'domain-1' },
  { label: t('shortLink.create.domain2'), value: 'domain-2' },
  { label: t('shortLink.create.domain3'), value: 'domain-3' },
])
const groupOptions = computed(() => [
  { label: t('shortLink.create.group1'), value: 'group-1' },
  { label: t('shortLink.create.group2'), value: 'group-2' },
  { label: t('shortLink.create.group3'), value: 'group-3' },
])

const qrcodePreviewUrl = computed(() => {
  const baseUrl = `${requestURL.protocol}//${requestURL.host}`
  return `${baseUrl}/qrc/preview/${encodeURIComponent(state.longUrl)}`
})

const imageSettings = computed(() => ({
  src: state.avatar,
  width: 30,
  height: 30,
  // x: 10,
  // y: 10,
  excavate: true,
}))

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

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }

  state.avatar = URL.createObjectURL(input.files[0]!)
}

function onFileClick() {
  fileRef.value?.click()
}
</script>

<template>
  <SubPage :title="isBatchMode ? $t('shortLink.create.batchTitle') : $t('shortLink.create.title')">
    <UForm
      ref="formRef"
      :schema="schema"
      :state="state"
      class="w-full lg:w-4/5 2xl:w-3/5 space-y-6"
      @submit="onSubmit"
    >
      <UFormGroup
        :name="$t('shortLink.create.redirectUrl')"
        :label="$t('shortLink.create.redirectUrl')"
        :help="$t('shortLink.create.remainingLinks', { count: 10 })"
      >
        <UTextarea
          v-if="isBatchMode"
          v-model="state.longUrl"
          autoresize
          :placeholder="$t('shortLink.create.batchUrlPlaceholder')"
        />
        <UInput
          v-else
          v-model="state.longUrl"
          :placeholder="$t('shortLink.create.singleUrlPlaceholder')"
        />
      </UFormGroup>

      <UFormGroup
        :label="$t('shortLink.create.linkTitle')"
        name="title"
        :hint="$t('common.operation.optional')"
      >
        <UTextarea
          v-if="isBatchMode"
          v-model="state.title"
          autoresize
          :placeholder="$t('shortLink.create.batchTitlePlaceholder')"
        />
        <UInput
          v-else
          v-model="state.title"
          :placeholder="$t('shortLink.create.singleTitlePlaceholder')"
        />
      </UFormGroup>

      <UFormGroup
        v-if="!isBatchMode"
        name="generateQrCode"
        label="qrCode"
        :hint="$t('common.operation.optional')"
        :ui="{ label: { wrapper: 'mb-4' } }"
      >
        <UToggle v-model="state.generateQrCode" />
        <span class="ml-2 text-gray-500 dark:text-gray-400 text-sm">
          {{ $t('shortLink.create.generateQrCode') }}
        </span>

        <div
          v-if="state.generateQrCode"
          class="flex flex-col lg:flex-row lg:content-center lg:items-center lg:justify-between gap-6 lg:gap-4 text-sm"
        >
          <div>
            <UFormGroup
              :label="$t('shortLink.create.color')"
              class="flex-1 mt-5"
              :ui="{ label: { wrapper: 'mb-4' } }"
            >
              <div class="mx-auto flex flex-wrap justify-start gap-4">
                <span
                  v-for="color in colorList"
                  :key="color"
                  :style="{ backgroundColor: color }"
                  class="relative w-12 h-12 flex-shrink-0 rounded-full cursor-pointer transition-transform duration-200"
                  :class="[
                    state.selectedColor === color
                      ? 'ring-2 ring-primary ring-offset-2 dark:ring-primary-500 dark:ring-offset-gray-900'
                      : 'hover:scale-110 hover:ring-2 hover:ring-gray-300 hover:ring-offset-2 dark:hover:ring-gray-600',
                  ]"
                  @click="() => (state.selectedColor = color)"
                />
              </div>
            </UFormGroup>

            <UFormGroup
              name="avatar"
              :label="$t('shortLink.create.logo')"
              class="flex-1 mt-5"
              :help="$t('shortLink.create.logoHelpText')"
              :ui="{
                label: { wrapper: 'mb-4' },
                container: 'flex flex-wrap items-center gap-3',
                help: 'mt-0',
              }"
            >
              <UAvatar :src="state.avatar" size="lg" />

              <UButton
                :label="$t('shortLink.create.selectFile')"
                color="white"
                size="md"
                @click="onFileClick"
              />

              <input
                ref="fileRef"
                type="file"
                class="hidden"
                accept=".jpg, .jpeg, .png, .gif"
                @change="onFileChange"
              >
            </UFormGroup>
          </div>

          <div class="flex flex-col items-center ml-4">
            <p class="mb-2 block font-medium text-gray-700 dark:text-gray-200">
              {{ $t('shortLink.create.preview') }}
            </p>

            <Qrcode
              class="wh-100 rounded-md"
              :size="180"
              :margin="2"
              :foreground="state.selectedColor"
              :value="qrcodePreviewUrl"
              :image-settings="imageSettings"
            :gradient="true"
            gradient-type="radial"
            gradient-start-color="#ff0000"
            gradient-end-color="#0000ff"
            />
          </div>
        </div>
      </UFormGroup>

      <UFormGroup
        v-if="isBatchMode"
        name="domain"
        :label="$t('shortLink.create.selectDomain')"
        class="flex-1"
      >
        <USelect
          v-model="state.domain"
          :placeholder="$t('shortLink.create.selectPlaceholder')"
          :options="domainOptions"
        />
      </UFormGroup>

      <UFormGroup v-else :label="$t('shortLink.create.shortLinkDomain')">
        <div class="flex items-center">
          <UFormGroup name="domain" :label="$t('shortLink.create.domain')" class="flex-1">
            <USelect
              v-model="state.domain"
              :placeholder="$t('shortLink.create.selectPlaceholder')"
              :options="domainOptions"
            />
          </UFormGroup>
          <!-- mt-5 -->
          <div class="flex items-center px-4">
            <UDivider label="/" orientation="vertical" />
          </div>
          <UFormGroup
            name="customSuffix"
            :label="$t('shortLink.create.customSuffix')"
            class="flex-1"
          >
            <UInput
              v-model="state.customSuffix"
              :placeholder="$t('shortLink.create.customSuffixPlaceholder')"
            />
          </UFormGroup>
        </div>
      </UFormGroup>

      <UFormGroup name="group" :label="$t('shortLink.create.group')">
        <USelect
          v-model="state.group"
          :placeholder="$t('shortLink.create.selectPlaceholder')"
          :options="groupOptions"
        />
      </UFormGroup>

      <div class="flex space-x-4">
        <UButton variant="outline" @click="formRef && formRef.clear()">
          {{ $t('common.operation.reset') }}
        </UButton>
        <UButton type="submit">
          {{ $t('shortLink.create.create') }}
        </UButton>
      </div>
    </UForm>
  </SubPage>
</template>
