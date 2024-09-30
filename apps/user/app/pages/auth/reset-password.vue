<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Reset Password',
})

const { $csrfFetch } = useNuxtApp()
const toast = useToast()
const isResetPassword = ref(false)
const loading = ref(false)

const fields = computed(() => {
  return isResetPassword.value
    ? [
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
        },
        {
          name: 'code',
          type: 'text',
          label: 'Verification Code',
          placeholder: 'Enter your email Verification Code',
        },
      ]
    : [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
        },
      ]
})

function validate(state: any): FormError[] {
  const errors: FormError[] = []

  if (isResetPassword.value) {
    if (!state.password) {
      errors.push({ path: 'password', message: 'Password is required' })
    }
    else if (state.password.length < 8) {
      errors.push({ path: 'password', message: 'Password must be at least 8 characters long' })
    }

    if (!state.code) {
      errors.push({ path: 'code', message: 'Verification Code is required' })
    }
  }
  else {
    if (!state.email) {
      errors.push({ path: 'email', message: 'Email is required' })
    }
  }

  return errors
}

async function onSubmit(data: FormSubmitEvent<any>) {
  try {
    loading.value = true

    const url = isResetPassword.value
      ? '/api/auth/reset-password'
      : '/api/auth/send-reset-password-code'

    const { message } = await $csrfFetch(url, {
      method: 'POST',
      body: data,
    })

    toast.add({ title: message ?? '' })
    if (!isResetPassword.value) {
      isResetPassword.value = true
    }
    else {
      await navigateTo('/')
    }
  }
  catch (error) {
    toast.add({ title: error.data?.message ?? null })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      align="top"
      icon="i-solar:lock-password-broken"
      :title="isResetPassword ? 'Reset password?' : 'Forgot Password?'"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ label: isResetPassword ? 'Reset Password' : 'Send Code' }"
      :loading="loading"
      @submit="onSubmit"
    >
      <template #description>
        {{
          isResetPassword
            ? 'Enter your new password and the code sent to your email to reset your password.'
            : 'Password reset code will be sent to your email.'
        }}
      </template>
      <template #footer>
        Already have an account?
        <NuxtLink
          to="/auth/signin"
          class="text-primary font-medium"
        >
          Signin
        </NuxtLink>
      </template>
    </UAuthForm>
  </UCard>
</template>
