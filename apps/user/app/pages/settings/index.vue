<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const fileRef = ref<HTMLInputElement>()
const isDeleteAccountModalOpen = ref(false)

const user = useAuthenticatedUser()

const state = reactive({
  name: user.value.nickname,
  email: user.value.email,
  phone: '',
  password_current: '',
  password_new: '',
})

const toast = useToast()

function validate(state: any): FormError[] {
  const errors = []
  if (!state.name)
    errors.push({ path: 'name', message: 'Please enter your name.' })
  if (!state.email)
    errors.push({ path: 'email', message: 'Please enter your email.' })
  if ((state.password_current && !state.password_new) || (!state.password_current && state.password_new))
    errors.push({ path: 'password', message: 'Please enter a valid password.' })
  return errors
}

function onFileClick() {
  fileRef.value?.click()
}

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  // eslint-disable-next-line no-console
  console.log(event.data)

  toast.add({ title: 'Profile updated', icon: 'i-heroicons-check-circle' })
}
</script>

<template>
  <UDashboardPanelContent class="pb-24">
    <UDashboardSection
      title="Theme"
      description="Customize the look and feel of your dashboard."
    >
      <template #links>
        <UColorModeSelect color="gray" />
      </template>
    </UDashboardSection>

    <UDivider class="mb-4" />

    <UForm
      :state="state"
      :validate="validate"
      :validate-on="['submit']"
      @submit="onSubmit"
    >
      <UDashboardSection
        title="Profile"
        description="This information will be displayed publicly so be careful what you share."
      >
        <template #links>
          <UButton
            type="submit"
            label="Save changes"
            color="black"
          />
        </template>

        <UFormGroup
          name="name"
          label="Name"
          description="Will appear on receipts, invoices, and other communication."
          required
          class="grid grid-cols-2 gap-2 items-center"
          :ui="{ container: '' }"
        >
          <UInput
            v-model="state.name"
            autocomplete="off"
            icon="i-heroicons-user"
            size="md"
          />
        </UFormGroup>

        <UFormGroup
          name="email"
          label="Email"
          description="Used to sign in, for email receipts and product updates."
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput
            v-model="state.email"
            type="email"
            autocomplete="off"
            icon="i-heroicons-envelope"
            size="md"
          />
        </UFormGroup>

        <UFormGroup
          name="phone"
          label="Phone"
          description="Used to sign in"
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput
            v-model="state.phone"
            type="phone"
            autocomplete="off"
            icon="i-heroicons-envelope"
            size="md"
          />
        </UFormGroup>

        <UFormGroup
          name="password"
          label="Password"
          description="Confirm your current password before setting a new one."
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput
            id="password"
            v-model="state.password_current"
            type="password"
            placeholder="Current password"
            size="md"
          />
          <UInput
            id="password_new"
            v-model="state.password_new"
            type="password"
            placeholder="New password"
            size="md"
            class="mt-2"
          />
        </UFormGroup>
      </UDashboardSection>
    </UForm>

    <UDivider class="mb-4" />

    <UDashboardSection
      title="Account"
      description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
    >
      <div>
        <UButton
          color="red"
          label="Delete account"
          size="md"
          @click="isDeleteAccountModalOpen = true"
        />
      </div>
    </UDashboardSection>

    <!-- ~/components/settings/DeleteAccountModal.vue -->
    <SettingsDeleteAccountModal v-model="isDeleteAccountModalOpen" />
  </UDashboardPanelContent>
</template>
