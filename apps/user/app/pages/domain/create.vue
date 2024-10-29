<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: ['protected'],
})

const { t } = useI18n()
const router = useRouter()

const state = reactive({
  longUrl: '',
  radio: 1,
  subDomain: '',
})
const isOpen = ref(false)
const formRef = ref<any>(null)

const options = computed(() => [
  { label: t('domain.create.domainTypes.rootDomain'), value: 1 },
  { label: t('domain.create.domainTypes.subdomain'), value: 2 },
])

function validate(state: any): FormError[] {
  const errors = []
  if (!state.longUrl)
    errors.push({ path: 'longUrl', message: t('common.validation.required') })

  if (!state.radio)
    errors.push({ path: 'radio', message: t('common.validation.required') })

  if (!state.subDomain && state.radio === 2)
    errors.push({ path: 'subDomain', message: t('common.validation.required') })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  try {
    // eslint-disable-next-line no-console
    console.log(event.data)
    // TODO:

    isOpen.value = true
  }
  catch (error) {
    console.error(error)
  }
}

function handleSubmit() {
  router.replace('/domain')
}
</script>

<template>
  <SubPage :title="t('domain.create.title')">
    <UForm
      ref="formRef"
      :validate="validate"
      :state="state"
      class="w-full lg:w-4/5 2xl:w-3/5 space-y-6"
      @submit="onSubmit"
    >
      <UFormGroup
        name="longUrl"
        :label="t('domain.create.domain')"
        :help="t('domain.create.remainingLinks', { count: 10 })"
      >
        <UInput
          v-model="state.longUrl"
          :placeholder="t('domain.create.domainPlaceholder')"
        />
      </UFormGroup>

      <UFormGroup name="radio" label="">
        <URadioGroup v-model="state.radio" :options="options" />
      </UFormGroup>

      <ULandingCard
        v-if="state.radio === 1"
        :title="t('domain.create.rootDomainNote.title')"
        :description="t('domain.create.rootDomainNote.description')"
      />

      <template v-if="state.radio === 2">
        <UFormGroup
          name="subDomain"
          :label="t('domain.create.subdomainField.label')"
        >
          <UInput
            v-model="state.subDomain"
            :placeholder="t('domain.create.subdomainField.placeholder')"
          >
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">.tiny.com</span>
            </template>
          </UInput>
        </UFormGroup>

        <ULandingCard
          :title="t('domain.create.subdomainNote.title')"
          :description="t('domain.create.subdomainNote.description')"
        />
      </template>

      <div class="flex space-x-4">
        <UButton variant="outline" @click="formRef && formRef.clear()">
          {{ t('common.operation.reset') }}
        </UButton>
        <UButton type="submit">
          {{ $t('shortLink.create.create') }}
        </UButton>
      </div>
    </UForm>

    <UModal v-model="isOpen" prevent-close>
      <UCard :ui="{ footer: { base: 'flex justify-end' } }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ t('domain.create.success.title') }}
            </h3>
          </div>
        </template>

        <UAlert
          :title="t('domain.create.success.message')"
          variant="subtle"
        />

        <div class="flex flex-col gap-4 mt-4">
          <UFormGroup :label="t('domain.create.success.recordType')" name="recordType">
            <UInput />
          </UFormGroup>
          <UFormGroup :label="t('domain.create.success.hostRecord')" name="hostRecord">
            <UInput />
          </UFormGroup>
          <UFormGroup :label="t('domain.create.success.recordValue')" name="recordValue" size="lg">
            <UInput :ui="{ icon: { trailing: { pointer: '' } } }">
              <template #trailing>
                <UButton
                  variant="link"
                  :padded="false"
                  icon="i-ic:baseline-content-copy"
                />
              </template>
            </UInput>
          </UFormGroup>
        </div>

        <template #footer>
          <UButton
            type="submit"
            :label="t('common.operation.confirm')"
            @click="handleSubmit"
          />
        </template>
      </UCard>
    </UModal>
  </SubPage>
</template>
