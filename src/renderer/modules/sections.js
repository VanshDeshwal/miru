import { alRequest } from '@/modules/anilist.js'
import { writable } from 'simple-store-svelte'

export const hasNextPage = writable(true)

export default class Sections {
  constructor (data = []) {
    this.sections = []
    this.add(data)
  }

  add (data) {
    for (const { title, variables = {}, type, load = Sections.createFallbackLoad(variables, type), preview = writable() } of data) {
      this.sections.push({ load, title, preview, variables })
    }
  }

  static createFallbackLoad (variables, type) {
    return (page = 1, perPage = 50, search = variables) => {
      const options = { method: 'Search', page, perPage, ...Sections.sanitiseObject(search) }
      const res = alRequest(options)
      return Sections.wrapResponse(res, perPage, type)
    }
  }

  static wrapResponse (res, length, type) {
    res.then(res => {
      hasNextPage.value = res?.data?.Page.pageInfo.hasNextPage
    })
    return Array.from({ length }, (_, i) => ({ type, data: Sections.fromPending(res, i) }))
  }

  static sanitiseObject (object = {}) {
    const safe = {}
    for (const [key, value] of Object.entries(object)) {
      if (value) safe[key] = value
    }
    return safe
  }

  static async fromPending (arr, i) {
    const { data } = await arr
    return data.Page.media[i]
  }
}
