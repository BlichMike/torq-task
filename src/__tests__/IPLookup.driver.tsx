import { render, screen, waitFor } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { App } from '@/App'
import type { IPData } from '@/types/ipData'
import { server } from '@/test-utils/server'
import { DATA_HOOKS } from '@/dataHooks'

const IP_LOOKUP_URL = 'http://ipwhois.app/json/:ip'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

const elements = {
  lookupButton: () => screen.getByTestId(DATA_HOOKS.LOOKUP_BUTTON),
  dialog: () => screen.queryByTestId(DATA_HOOKS.DIALOG),
  addRowButton: () => screen.getByTestId(DATA_HOOKS.ADD_ROW_BUTTON),
  loadingSpinner: () => screen.queryByTestId(DATA_HOOKS.LOADING_SPINNER),
  countryFlag: (rowIndex: number) => screen.getAllByTestId(DATA_HOOKS.COUNTRY_FLAG)[rowIndex],
  clockTime: (rowIndex: number) => screen.getAllByTestId(DATA_HOOKS.CLOCK_TIME)[rowIndex],
  errorMessage: () => screen.queryByTestId(DATA_HOOKS.ERROR_MESSAGE),
  ipInput: (rowIndex: number) => screen.getAllByTestId(DATA_HOOKS.IP_INPUT)[rowIndex] as HTMLInputElement,
  ipInputs: () => screen.getAllByTestId(DATA_HOOKS.IP_INPUT) as HTMLInputElement[],
}

export class createIPLookupDriver {
  private user: UserEvent

  constructor() {
    this.user = userEvent.setup()

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <App />
      </QueryClientProvider>,
    )
  }

  given = {
    mockIPSuccess: (data: IPData) => {
      server.use(http.get(IP_LOOKUP_URL, () => HttpResponse.json(data)))
    },

    mockIPError: (status: number) => {
      server.use(http.get(IP_LOOKUP_URL, () => new HttpResponse(null, { status })))
    },

    mockNetworkError: () => {
      server.use(http.get(IP_LOOKUP_URL, () => HttpResponse.error()))
    },

    mockIPPending: () => {
      server.use(
        http.get(IP_LOOKUP_URL, async () => {
          await new Promise(() => { })
          return HttpResponse.json({})
        }),
      )
    },
  }

  when = {
    openDialog: async () => {
      await this.user.click(elements.lookupButton())
    },

    typeAndBlurIP: async (rowIndex: number, ip: string) => {
      await this.user.type(elements.ipInput(rowIndex), ip)
      await this.user.tab()
    },

    typeIP: async (rowIndex: number, ip: string) => {
      await this.user.type(elements.ipInput(rowIndex), ip)
    },

    blurInput: async (rowIndex: number) => {
      await this.user.click(elements.ipInput(rowIndex))
      await this.user.tab()
    },

    clickAddRow: async () => {
      await this.user.click(elements.addRowButton())
    },
  }

  get = {
    lookupButton: {
      exists: () => elements.lookupButton() !== null,
      text: () => elements.lookupButton()?.textContent?.trim() ?? '',
      element: () => elements.lookupButton(),
    },

    dialog: {
      exists: () => elements.dialog() !== null,
      element: () => elements.dialog(),
    },

    addRowButton: {
      exists: () => elements.addRowButton() !== null,
      text: () => elements.addRowButton()?.textContent?.trim() ?? '',
      element: () => elements.addRowButton(),
    },

    loadingSpinner: {
      exists: () => elements.loadingSpinner() !== null,
      text: () => elements.loadingSpinner()?.textContent?.trim() ?? '',
      element: () => elements.loadingSpinner(),
    },

    errorMessage: {
      exists: () => elements.errorMessage() !== null,
      text: () => elements.errorMessage()?.textContent?.trim() ?? '',
      element: () => elements.errorMessage(),
    },

    clockTimeByRowIndex: (rowIndex: number) => {
      return {
        exists: () => elements.clockTime(rowIndex) !== null,
        element: () => elements.clockTime(rowIndex),
      }
    },

    countryFlagByRowIndex: (rowIndex: number) => {
      return {
        exists: () => elements.countryFlag(rowIndex) !== null,
        element: () => elements.countryFlag(rowIndex),
      }
    },

    rowCount: () => elements.ipInputs().length,

    input: (rowIndex: number) => {
      return {
        exists: () => elements.ipInput(rowIndex) !== null,
        isDisabled: () => elements.ipInput(rowIndex)?.disabled ?? false,
        element: () => elements.ipInput(rowIndex),
      }
    },

    waitForFlag: async () => {
      await screen.findByTestId(DATA_HOOKS.COUNTRY_FLAG)
    },

    waitForError: async () => {
      await screen.findByTestId(DATA_HOOKS.ERROR_MESSAGE)
    },

    waitForLoadingToFinish: async () => {
      await waitFor(() => {
        expect(elements.loadingSpinner()).toBeNull()
      })
    },
  }
}
