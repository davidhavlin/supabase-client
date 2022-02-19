<template>
  <Listbox as="div" v-model="selected">
    <ListboxLabel class="block text-sm font-medium text-primary-def"> {{ label }} </ListboxLabel>
    <div class="mt-1 relative">
      <ListboxButton
        class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-def focus:border-primarring-primary-def sm:text-sm"
      >
        <span class="flex items-center">
          <img :src="selected.avatar" alt="" class="flex-shrink-0 h-6 w-6 rounded-full" />
          <span class="ml-3 text-slate-600 block truncate">{{ selected.name }}</span>
        </span>
        <span class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        >
          <ListboxOption
            as="template"
            v-for="person in people"
            :key="person.id"
            :value="person"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                active ? 'text-white bg-primary-def' : 'text-gray-900',
                'cursor-default select-none relative py-2 pl-3 pr-9',
              ]"
            >
              <div class="flex items-center">
                <img :src="person.avatar" alt="" class="flex-shrink-0 h-6 w-6 rounded-full" />
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">
                  {{ person.name }}
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
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'

const people = [
  {
    id: 1,
    name: 'Wade Cooper',
    avatar:
      'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    name: 'Arlene Mccoy',
    avatar:
      'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 3,
    name: 'Devon Webb',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
  },
]
interface IOption {
  value: string
  label: string
}

export default defineComponent({
  name: 'SettingsColors',
  components: {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
    CheckIcon,
    SelectorIcon,
  },
  props: {
    label: { type: String, default: 'Label' },
    options: { type: Array as PropType<IOption[]>, default: 'Label' },
  },
  setup() {
    const selected = ref(people[1])

    return {
      people,
      selected,
    }
  },
})
</script>

<style lang="scss" scoped></style>
