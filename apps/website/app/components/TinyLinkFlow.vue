<template>
  <div class="bg-gray-900/5 dark:bg-white/5 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10 rounded-xl lg:-m-4 p-4 relative">
    <ULandingSection
      title="How tinylink Works?"
      description="Visitors are redirected to the original URL while the system records their visit data."
    />

    <div class="w-full max-w-5xl mx-auto">
      <div class="flex items-center justify-between gap-4">
        <div class="bg-white rounded-lg shadow-md w-72 p-6">
          <div class="bg-gray-100 rounded p-3 mb-4">
            <p class="text-xs text-gray-600 break-all">
              https://music.apple.com/cn/music-video/mojito/172690771
            </p>
          </div>
          <div class="bg-gray-200 rounded py-2 px-4 text-center">
            <span class="text-sm">缩短原始长链接</span>
          </div>
        </div>

        <UIcon name="i-heroicons:arrow-right" class="w-5 h-5" />

        <div class="bg-white rounded-lg shadow-md w-72 p-6">
          <div class="bg-gray-100 rounded p-3 mb-4">
            <p class="text-xs text-gray-600">
              https://tiny.com/xxdfghk
            </p>
          </div>
          <div class="text-center">
            <span class="text-sm">用户访问短链接</span>
          </div>
        </div>

        <UIcon name="i-heroicons:arrow-right" class="w-5 h-5" />

        <div class="bg-white rounded-lg shadow-md w-72 p-6">
          <div class="bg-gray-100 rounded p-3 mb-4">
            <p class="text-xs text-gray-600 break-all">
              https://music.apple.com/cn/music-video/mojito/172690771
            </p>
          </div>
          <div class="text-center mb-4">
            <span class="text-sm">自动跳转到原始长链接</span>
          </div>
          <div class="bg-gray-100 rounded p-3">
            <div class="h-16 bg-gray-200 rounded" />
            <p class="text-sm text-center mt-2">
              系统记录访问数据
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="flex items-center justify-between px-4 relative">
      <div class="w-72 bg-[#1E2433] rounded-lg p-4">
        <div class="bg-[#242937] rounded p-3 mb-3">
          <p class="text-xs text-gray-400 break-all">
            https://music.apple.com/music-video/mojito/172690771
          </p>
        </div>
        <div class="bg-[#242937] rounded p-2 mb-2">
          <p class="text-sm text-center text-gray-400">
            生成短链接
          </p>
        </div>
        <p class="text-sm text-gray-500 text-center">
          缩短原始长链接
        </p>
      </div>

      <div class="flex items-center">
        <div class="h-[1px] w-32 bg-white" />
        <div class="w-2 h-2 bg-white rounded-full" />
      </div>

      <div class="w-72 bg-[#1E2433] rounded-lg p-4">
        <div class="bg-[#242937] rounded p-3 mb-3">
          <p class="text-xs text-gray-400">
            https://tiny.com/xxdfghk
          </p>
        </div>
        <p class="text-sm text-gray-500 text-center">
          用户访问短链接
        </p>
      </div>

      <div class="flex items-center">
        <div class="h-[1px] w-32 bg-white" />
        <div class="w-2 h-2 bg-white rounded-full" />
        <div class="relative w-32 h-48">
          <div class="absolute left-0 top-0 w-full h-full">
            <div class="h-[1px] w-32 bg-white origin-left rotate-45 translate-y-24" />
          </div>
          <div class="absolute left-0 bottom-[-180px] w-full h-full">
            <div class="h-[1px] w-32 bg-white origin-left -rotate-45 -translate-y-24" />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-32">
        <div class="w-72 bg-[#1E2433] rounded-lg p-4">
          <div class="bg-[#242937] rounded p-3 mb-3">
            <p class="text-xs text-gray-400 break-all">
              https://music.apple.com/music-video/mojito/172690771
            </p>
          </div>
          <p class="text-sm text-gray-500 text-center">
            自动跳转到原始长链接
          </p>
        </div>

        <div class="w-72 bg-[#1E2433] rounded-lg p-4">
          <div class="bg-[#242937] h-16 rounded mb-3" />
          <p class="text-sm text-gray-500 text-center">
            系统记录访问数据
          </p>
        </div>
      </div>
    </div> -->
  </div>
</template>
