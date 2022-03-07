<template>
  <Listbox as="div" v-model="innerValue">
    <ListboxLabel class="block text-sm font-medium text-primary-def">{{ label }}</ListboxLabel>
    <div class="mt-1 relative">
      <ListboxButton
        @click.stop="onClickButton"
        class="relative w-full bg-white border overflow-hidden border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-def focus:border-primarring-primary-def sm:text-sm"
      >
        <span class="flex items-center">
          <slot v-if="'header-icon' in $slots" name="header-icon" :values="innerValue"></slot>
          <slot v-else name="option-icon" :option="innerValue"></slot>

          <span class="ml-3 text-slate-500 block truncate">{{ selectedValueLabel }}</span>
        </span>
        <span class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
        <IconSearch
          v-if="searchable"
          @click.stop="onClickSearchIcon"
          class="text-slate-400 cursor-pointer absolute right-8 top-1/2 -translate-y-1/2"
        />
        <div
          v-if="searchable && visibleSearch"
          class="absolute flex flex-row flex-nowrap items-center justify-between top-0 left-0 h-full w-full z-10 bg-slate-200 text-slate-800"
          @click.stop
        >
          <input
            ref="searchRef"
            id="searchable-input"
            v-model="search"
            class="w-full border font-bold bg-white placeholder:text-slate-300 px-4 py-2 rounded-lg focus:shadow-outline outline-none"
            type="text"
            @click.stop
            placeholder="@search fontawesome icons"
          />
          <XCircleIcon
            @click.stop="onResetSearch"
            class="h-6 w-6 mx-2 text-slate-500 cursor-pointer"
          />
        </div>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="visibleSelect"
          class="absolute z-10 mt-1 w-full bg-white shadow-lg h-56 max-h-56 rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-hidden focus:outline-none sm:text-sm"
          v-click-outside="
            () => {
              visibleSelect = false
            }
          "
        >
          <virtual-scroll :items="filteredOptions">
            <template #item="{ item }">
              <div
                @click="selectOption(item)"
                :class="[isOptionSelected(item.value) ? 'bg-slate-200' : '']"
                class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-green-300 text-slate-400 hover:text-white"
              >
                <div class="flex items-center">
                  <slot name="option-icon" :option="item"></slot>
                  <span
                    :class="[
                      isOptionSelected(item.value) ? 'font-semibold' : 'font-normal',
                      ' ml-3 block truncate',
                    ]"
                    >{{ item.label }}</span
                  >
                </div>

                <span
                  v-if="isOptionSelected(item.value)"
                  class="absolute inset-y-0 right-0 flex items-center pr-4"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </template>
          </virtual-scroll>
        </div>
      </transition>
    </div>
  </Listbox>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, watch } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { CheckIcon, SelectorIcon, XCircleIcon } from '@heroicons/vue/solid'
import VirtualScroll from '../../virtual-scroll/VirtualScroll.vue'
import IconSearch from '../../../assets/icons/IconSearch.vue'
import IconClose from '../../../assets/icons/IconClose.vue'

export interface IOption {
  value: string
  label: string
}
interface Props {
  label?: string
  options: IOption[]
  modelValue: IOption | string[]
  searchable?: boolean
  static?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Label',
  searchable: false,
  static: false,
})

const emit = defineEmits(['update:modelValue'])

const visibleSearch = ref(false)
const visibleSelect = ref(false)
const searchRef = ref<HTMLInputElement | null>(null)

const innerValue = computed({
  get: () => props.modelValue,
  set: (option: IOption | string[]) => emit('update:modelValue', option),
})

const selectedValueLabel = computed(() => {
  if (Array.isArray(innerValue.value)) {
    return ''
  }
  return innerValue.value.label
})

const isOptionSelected = (option: string) => {
  if (Array.isArray(innerValue.value)) {
    return innerValue.value.includes(option)
  }
  return option === innerValue.value.value
}

const selectOption = (option: IOption) => {
  if (Array.isArray(innerValue.value)) {
    if (innerValue.value.length < 2) {
      innerValue.value = [...innerValue.value, option.value]
    } else {
      if (innerValue.value.includes(option.value)) {
        innerValue.value = innerValue.value.filter((opt) => opt !== option.value)
      } else {
        innerValue.value = [innerValue.value[1], option.value]
      }
    }

    return
  }
  innerValue.value = option
}

const search = ref('')

const onResetSearch = () => {
  search.value = ''
  visibleSearch.value = !visibleSearch.value
}

const onClickSearchIcon = () => {
  visibleSearch.value = !visibleSearch.value
  visibleSelect.value = true
  nextTick(() => {
    searchRef.value?.focus()
  })
}

const filteredOptions = computed(() => {
  if (!search.value || search.value.length < 2) return props.options

  const newOptions = []
  for (let i = 0; i < props.options.length; i++) {
    const option = props.options[i]
    if (option.value.includes(search.value)) {
      newOptions.push(option)
    }
  }
  return newOptions
})

const onClickButton = () => {
  visibleSelect.value = !visibleSelect.value
}

watch(visibleSelect, (visible) => {
  if (!visible) visibleSearch.value = false
})
</script>
