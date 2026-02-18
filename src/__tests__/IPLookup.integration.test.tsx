import { describe, it, expect } from 'vitest'
import { createIPLookupDriver } from './IPLookup.driver'
import { ERROR_MESSAGES } from '@/consts'
import type { IPData } from '@/types/ipData'

const MOCK_IP_DATA: IPData = {
  country: 'United States',
  country_flag: 'https://cdn.ipwhois.io/flags/us.svg',
  timezone: 'America/New_York',
  timezone_gmt: 'UTC-5',
  city: 'New York',
  latitude: 40.7128,
  longitude: -74.006,
}

describe('IP Lookup — App Shell', () => {
  it('renders the Lookup IP button', () => {
    const driver = new createIPLookupDriver()
    expect(driver.get.lookupButton.exists()).toBe(true)
  })

  it('opens the dialog when the button is clicked', async () => {
    const driver = new createIPLookupDriver()
    await driver.when.openDialog()
    expect(driver.get.dialog.exists()).toBe(true)
  })
})

describe('IP Lookup — Row Management', () => {
  let driver: createIPLookupDriver

  beforeEach(async () => {
    driver = new createIPLookupDriver()
    await driver.when.openDialog()
  })

  it('shows one input row when the dialog first opens', async () => {
    expect(driver.get.rowCount()).toBe(1)
  })

  it('adds a second row when the Add button is clicked', async () => {
    await driver.when.clickAddRow()
    expect(driver.get.rowCount()).toBe(2)
  })

  it('adds multiple rows independently', async () => {
    await driver.when.clickAddRow()
    await driver.when.clickAddRow()
    expect(driver.get.rowCount()).toBe(3)
  })
})

describe('IP Lookup — Input Validation', () => {
  let driver: createIPLookupDriver

  beforeEach(async () => {
    driver = new createIPLookupDriver()
    await driver.when.openDialog()
  })

  it('shows a validation error when an invalid IP is blurred', async () => {
    await driver.when.typeAndBlurIP(0, 'not-an-ip')
    expect(driver.get.errorMessage.exists()).toBe(true)
    expect(driver.get.errorMessage.text()).toBe(ERROR_MESSAGES.INVALID_IP_FORMAT)
  })

  it('does nothing when an empty input is blurred', async () => {
    await driver.when.blurInput(0)
    expect(driver.get.errorMessage.exists()).toBe(false)
    expect(driver.get.loadingSpinner.exists()).toBe(false)
  })

  it('clears the validation error when the user starts typing again', async () => {
    await driver.when.typeAndBlurIP(0, 'bad-ip')
    expect(driver.get.errorMessage.exists()).toBe(true)
    await driver.when.typeIP(0, '1')
    expect(driver.get.errorMessage.exists()).toBe(false)
  })
})

describe('IP Lookup — Search Flow', () => {
  let driver: createIPLookupDriver

  beforeEach(async () => {
    driver = new createIPLookupDriver()
    await driver.when.openDialog()
  })

  it('shows a loading spinner immediately after a valid IP is blurred', async () => {
    driver.given.mockIPPending()
    await driver.when.typeAndBlurIP(0, '8.8.8.8')
    expect(driver.get.loadingSpinner.exists()).toBe(true)
  })

  it('disables the input while loading', async () => {
    driver.given.mockIPPending()
    await driver.when.typeAndBlurIP(0, '8.8.8.8')
    expect(driver.get.input(0).isDisabled()).toBe(true)
  })

  it('displays the country flag after a successful lookup', async () => {
    driver.given.mockIPSuccess(MOCK_IP_DATA)
    await driver.when.typeAndBlurIP(0, '8.8.8.8')
    await driver.get.waitForFlag()
    expect(driver.get.countryFlagByRowIndex(0).exists()).toBe(true)
  })

  it('displays the local clock time after a successful lookup', async () => {
    driver.given.mockIPSuccess(MOCK_IP_DATA)
    await driver.when.typeAndBlurIP(0, '8.8.8.8')
    await driver.get.waitForFlag()
    expect(driver.get.clockTimeByRowIndex(0).exists()).toBe(true)
  })

  it('hides the loading spinner once the result is ready', async () => {
    driver.given.mockIPSuccess(MOCK_IP_DATA)
    await driver.when.typeAndBlurIP(0, '8.8.8.8')
    await driver.get.waitForLoadingToFinish()
    expect(driver.get.loadingSpinner.exists()).toBe(false)
  })
})

describe('IP Lookup — Error Handling', () => {
  it('shows a not-found error message on a 404 response', async () => {
    const driver = new createIPLookupDriver()
    driver.given.mockIPError(404)
    await driver.when.openDialog()
    await driver.when.typeAndBlurIP(0, '8.8.8.8')
    await driver.get.waitForError()
    expect(driver.get.errorMessage.exists()).toBe(true)
    expect(driver.get.errorMessage.text()).toBe(ERROR_MESSAGES.NOT_FOUND)
  })

  it('shows a generic error message on a 500 response', async () => {
    const driver = new createIPLookupDriver()
    driver.given.mockIPError(500)
    await driver.when.openDialog()
    await driver.when.typeAndBlurIP(0, '8.8.8.8')
    await driver.get.waitForError()
    expect(driver.get.errorMessage.exists()).toBe(true)
    expect(driver.get.errorMessage.text()).toBe(ERROR_MESSAGES.UNKNOWN_ERROR)
  })

  it('shows a network error message when fetch rejects', async () => {
    const driver = new createIPLookupDriver()
    driver.given.mockNetworkError()
    await driver.when.openDialog()
    await driver.when.typeAndBlurIP(0, '8.8.8.8')
    await driver.get.waitForError()
    expect(driver.get.errorMessage.exists()).toBe(true)
    expect(driver.get.errorMessage.text()).toBe(ERROR_MESSAGES.NETWORK_ERROR)
  })
})

describe('IP Lookup — Multiple Rows', () => {
  it('runs independent searches in separate rows', async () => {
    const driver = new createIPLookupDriver()
    driver.given.mockIPSuccess(MOCK_IP_DATA)
    await driver.when.openDialog()
    await driver.when.clickAddRow()
    await driver.when.typeAndBlurIP(0, '8.8.8.8')
    await driver.when.typeAndBlurIP(1, '1.1.1.1')
    await driver.get.waitForLoadingToFinish()
    expect(driver.get.rowCount()).toBe(2)
    expect(driver.get.countryFlagByRowIndex(0).exists()).toBe(true)
    expect(driver.get.countryFlagByRowIndex(1).exists()).toBe(true)
    expect(driver.get.clockTimeByRowIndex(0).exists()).toBe(true)
    expect(driver.get.clockTimeByRowIndex(1).exists()).toBe(true)
  })

  it('shows a validation error only in the row with the bad IP', async () => {
    const driver = new createIPLookupDriver()
    driver.given.mockIPPending()
    await driver.when.openDialog()
    await driver.when.clickAddRow()
    await driver.when.typeAndBlurIP(0, 'bad-ip')
    await driver.when.typeAndBlurIP(1, '8.8.8.8')
    expect(driver.get.errorMessage.exists()).toBe(true)
    expect(driver.get.loadingSpinner.exists()).toBe(true)
  })
})
