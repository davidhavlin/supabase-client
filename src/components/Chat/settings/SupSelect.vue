<template>
  <Listbox as="div" v-model="innerValue">
    <ListboxLabel class="block text-sm font-medium text-primary-def"> {{ label }} </ListboxLabel>
    <div class="mt-1 relative">
      <ListboxButton
        @click="visibleSelect = !visibleSelect"
        class="relative w-full bg-white border overflow-hidden border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-def focus:border-primarring-primary-def sm:text-sm"
      >
        <span class="flex items-center">
          <!-- <img :src="selected.avatar" alt="" class="flex-shrink-0 h-6 w-6 rounded-full" /> -->
          <slot name="option-icon" :option="innerValue"> </slot>
          <span class="ml-3 text-slate-600 block truncate">{{ innerValue.label }}</span>
        </span>
        <span class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
        <IconSearch
          v-if="searchable"
          @click.stop="visibleSearch = !visibleSearch"
          class="text-primary-def cursor-pointer absolute right-8 top-1/2 -translate-y-1/2"
        />
        <div
          v-if="searchable && visibleSearch"
          class="absolute top-0 left-0 h-full w-full z-10 p-1 bg-slate-200 text-slate-800"
        >
          <input
            id="searchable-input"
            v-model="search"
            class="w-full border font-bold bg-slate-200 focus:bg-white placeholder:text-slate-100 px-4 py-2 rounded-lg focus:shadow-outline outline-none"
            type="text"
            placeholder="@search fontawesome icons"
          />
        </div>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <!-- <ListboxOptions
          :static="visibleSearch"
          class="absolute z-10 mt-1 w-full bg-white shadow-lg h-56 max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-hidden focus:outline-none sm:text-sm"
        >
          <virtual-scroll :items="options">
            <template #item="{ item }">
              <ListboxOption as="template" :value="item" v-slot="{ active, selected }">
                <li
                  :class="[
                    active ? 'text-white bg-primary-def' : 'text-gray-900',
                    'cursor-default select-none relative py-2 pl-3 pr-9',
                  ]"
                >
                  <div class="flex items-center">
                    <slot name="option-icon" :option="item"> </slot>
                    <span
                      :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']"
                    >
                      {{ item.label }}
                    </span>
                  </div>

                  <span
                    v-if="selected"
                    :class="[
                      active ? 'text-white' : 'text-primary-def',
                      'absolute inset-y-0 right-0 flex items-center pr-4',
                    ]"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption> -->
        <div
          v-if="visibleSelect"
          class="absolute z-10 mt-1 w-full bg-white shadow-lg h-56 max-h-56 rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-hidden focus:outline-none sm:text-sm"
          v-click-outside="() => (visibleSelect = false)"
        >
          <div class="absolute w-full h-full pointer-events-none z-10">
            <div class="pointer-events-auto h-5 w-full bg-red-400">nieco</div>
          </div>
          <virtual-scroll :items="options">
            <template #item="{ item }">
              <div>
                <li
                  :class="[
                    // active ? 'text-white bg-primary-def' : 'text-gray-900',
                    'cursor-default select-none relative py-2 pl-3 pr-9',
                  ]"
                >
                  <div class="flex items-center">
                    <slot name="option-icon" :option="item"> </slot>
                    <span :class="[false ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">
                      {{ item.label }}
                    </span>
                  </div>

                  <span
                    v-if="false"
                    :class="[
                      true ? 'text-white' : 'text-primary-def',
                      'absolute inset-y-0 right-0 flex items-center pr-4',
                    ]"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </div>
            </template>
          </virtual-scroll>
        </div>
      </transition>
    </div>
  </Listbox>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'
import VirtualScroll from '../../virtual-scroll/VirtualScroll.vue'
import IconSearch from '../../../assets/icons/IconSearch.vue'

interface IOption {
  value: string
  label: string
}

export default defineComponent({
  name: 'SupSelect',
  components: {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
    CheckIcon,
    SelectorIcon,
    VirtualScroll,
    IconSearch,
  },
  props: {
    label: { type: String, default: 'Label' },
    options: { type: Array as PropType<IOption[]>, default: 'Label' },
    modelValue: { type: Object as PropType<IOption>, required: true },
    searchable: { type: Boolean, default: false },
    static: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const visibleSearch = ref(false)
    const visibleSelect = ref(false)

    const innerValue = computed({
      get: () => props.modelValue,
      set: (option: IOption) => emit('update:modelValue', option),
    })

    const search = ref('')

    return {
      innerValue,
      search,
      visibleSearch,
      visibleSelect,
    }
  },
})
</script>

<style lang="scss" scoped></style>
