<template>
  <ULandingSection>
    <ULandingCTA
      :headline="$t('common.cta.headline')"
      :description="$t('common.cta.description')"
      :links="[{
        label: $t('common.cta.get_started'),
        trailingIcon: 'i-heroicons-arrow-right-20-solid',
        size: 'xl',
        to: '/signup',
      }]"
    >
      <template #title>
        {{ $t('common.cta.title') }}
        <span class="text-primary">{{$t('common.cta.subheading')}}</span>
      </template>
    </ULandingCTA>
  </ULandingSection>
</template>
