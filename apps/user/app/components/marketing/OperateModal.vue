<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String as PropType<'create' | 'edit'>,
    required: false,
    default: 'create',
    validator: (t: string) => ['create', 'edit'].includes(t),
  },
  title: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const { t } = useI18n()

const loading = ref(false)

const state = reactive({
  title: props.title,
})

watch(
  () => props.title,
  (newTitle) => {
    state.title = newTitle
  },
)

const schema = z.object({
  title: z.string().min(1, t('marketing.modal.titleRequired')),
})

type Schema = z.infer<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true
    // Do something with data
    // eslint-disable-next-line no-console
    console.log(event.data)
    emit('close')
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

function clearTitle() {
  state.title = ''
  // emit('update:title', '')
}

const modalTitle = computed(() => {
  return props.type === 'create'
    ? t('marketing.modal.create')
    : t('marketing.modal.edit')
})
</script>

<template>
  <UDashboardModal
    :model-value="modelValue"
    :title="modalTitle"
    :ui="{ width: 'sm:max-w-md' }"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup
        :label="$t('marketing.modal.title')"
        name="title"
      >
        <UInput
          v-model="state.title"
          :placeholder="$t('marketing.modal.titlePlaceholder')"
          autocomplete="off"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              v-show="state.title !== ''"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="clearTitle"
            />
          </template>
        </UInput>
      </UFormGroup>

      <div class="flex justify-end gap-3">
        <UButton
          :label="$t('common.operation.cancel')"
          color="white"
          @click="emit('close')"
        />
        <UButton
          type="submit"
          :label="$t('common.operation.save')"
          :loading="loading"
        />
      </div>
    </UForm>
  </UDashboardModal>
</template>
