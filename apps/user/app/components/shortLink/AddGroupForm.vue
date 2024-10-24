<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const emit = defineEmits(['close'])

const { t } = useI18n()

const loading = ref(false)

const state = reactive({
  groupName: '',
})

const schema = z.object({
  groupName: z.string().min(1, t('shortLink.pleaseEnterGroupName')),
})

type Schema = z.infer<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    // Do something with data
    // eslint-disable-next-line no-console
    console.log(event.data)

    emit('close')
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup
      :label="$t('shortLink.groupName')"
      name="groupName"
    >
      <UInput
        v-model="state.groupName"
        :placeholder="$t('shortLink.pleaseEnterGroupName')"
        autocomplete="off"
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
        <template #trailing>
          <UButton
            v-show="state.groupName !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="state.groupName = ''"
          />
        </template>
      </UInput>
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton
        :label="$t('common.cancel')"
        color="white"
        @click="emit('close')"
      />
      <UButton
        type="submit"
        :label="$t('common.confirm')"
        :loading="loading"
      />
    </div>
  </UForm>
</template>
