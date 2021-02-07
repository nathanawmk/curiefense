import SerializedInput from '@/components/SerializedInput.vue'
import {beforeEach, describe, expect, test} from '@jest/globals'
import {mount, shallowMount, Wrapper} from '@vue/test-utils'
import Vue from 'vue'

describe('SerializedInput.vue', () => {
  let wrapper: Wrapper<Vue>
  let value: any
  let placeholder: string
  let getFunction: Function
  let setFunction: Function
  beforeEach(() => {
    value = '4'
    placeholder = 'half the written value'
    getFunction = (value: any) => {
      return (value * 2).toString()
    }
    setFunction = (value: any) => {
      return (value / 2).toString()
    }
    wrapper = mount(SerializedInput, {
      propsData: {
        value: value,
        placeholder: placeholder,
        getFunction: getFunction,
        setFunction: setFunction,
      },
    })
  })

  test('should have correct provided placeholder for the input', () => {
    const input = wrapper.find('.serialized-input')
    expect((input.element as any).placeholder).toEqual(placeholder)
  })

  test('should format value correctly from model to view', () => {
    const wantedValue = getFunction(value)
    const input = wrapper.find('.serialized-input')
    expect((input.element as any).value).toEqual(wantedValue)
  })

  test('should format value correctly from model to view when value changes', async () => {
    const newValue = '8'
    const wantedValue = getFunction(newValue)
    wrapper.setProps({value: newValue})
    await Vue.nextTick()
    const input = wrapper.find('.serialized-input')
    expect((input.element as any).value).toEqual(wantedValue)
  })

  test('should format and emit value correctly from view to model', async () => {
    const wantedValue = value
    const input = wrapper.find('.serialized-input')
    input.trigger('blur')
    await Vue.nextTick()
    expect(wrapper.emitted('blur')).toBeTruthy()
    expect(wrapper.emitted('blur')[0]).toEqual([wantedValue])
  })

  test('should log message when trying to process data and getFunction is not a function', (done) => {
    const originalLog = console.log
    let consoleOutput: string[] = []
    const mockedLog = (output: string) => consoleOutput.push(output)
    consoleOutput = []
    console.log = mockedLog
    wrapper = shallowMount(SerializedInput, {
      propsData: {
        value: value,
        setFunction: setFunction,
      },
    })
    // allow all requests to finish
    setImmediate(() => {
      expect(consoleOutput).toContain(`SerializedInput getFunction prop provided is not a function!`)
      console.log = originalLog
      done()
    })
  })

  test('should log message when trying to process data and setFunction is not a function', async (done) => {
    const originalLog = console.log
    let consoleOutput: string[] = []
    const mockedLog = (output: string) => consoleOutput.push(output)
    consoleOutput = []
    console.log = mockedLog
    wrapper = shallowMount(SerializedInput, {
      propsData: {
        value: value,
        getFunction: getFunction,
      },
    })
    await Vue.nextTick()
    const input = wrapper.find('.serialized-input')
    input.trigger('blur')
    await Vue.nextTick()
    // allow all requests to finish
    setImmediate(() => {
      expect(consoleOutput).toContain(`SerializedInput setFunction prop provided is not a function!`)
      console.log = originalLog
      done()
    })
  })
})
