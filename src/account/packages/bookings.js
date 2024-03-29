/* eslint-disable vars-on-top */
/* eslint-disable no-var */

import dataBind from '@gogocat/data-bind'
import { addMonths } from 'date-fns'
import { toISOStringShort } from '../../helpers/dates'
import MemberStack from '../../helpers/memberstack'

class BookingsController {
    /** @type {MemberStack} */
    ms

    /** @type {import('../../types/memberstack').Member} */
    member

    /** @type {Binder} */
    component

    /** @type {string} */
    actionBookingId

    /**
     * @typedef {Object} ViewModel
     * @property {boolean} isLoading
     * @property {boolean} isEmpty
     * @property {Bookings} bookings
     */

    /**
     * Initialize controller
     */
    async init() {
        this.ms = new MemberStack()
        this.member = await this.ms.getMember()
        this.setupEventHandlers()

        /** @type {ViewModel} */
        this._viewModel = {
            isLoading: true,
            isEmpty: false,
            bookings: []
        }

        this.component = dataBind.init(
            document.querySelector('[data-bind-comp="dashboardComp"]'),
            this._viewModel
        )

        await this.component.render()
        this.load()
    }

    setupEventHandlers() {
        document
            .getElementById('cancel-confirm')
            .addEventListener('click', this.onCancelConfirm.bind(this))
    }

    /**
     * Fetch and load bookings
     */
    async load() {
        // Fetch bookings for the upcoming 3 months
        const dateFrom = new Date()
        const dateTo = addMonths(dateFrom, 6)
        const bookings = await this.fetch(dateFrom, dateTo)
        this.bookings = bookings
    }

    /**
     * @param {ViewModel} model
     */
    set viewModel(model) {
        this._viewModel = model
        this.component.render()
    }

    get viewModel() {
        return this._viewModel
    }

    /**
     * Bind bookings to UI Component
     * @param {Bookings} bookings
     */
    set bookings(bookings) {
        const model = this.viewModel
        model.bookings = bookings
        model.isEmpty = bookings.length === 0
        this.viewModel = model
    }

    /**
     * @param {boolean} isLoading
     */
    set isLoading(isLoading) {
        const model = this.viewModel
        model.isLoading = isLoading
        this.viewModel = model
    }

    /**
     * Fetch bookings for user within date range
     * @param {Date} dateFrom
     * @param {Date} dateTo
     * @returns {Bookings}
     */
    async fetch(dateFrom, dateTo) {
        const fromStr = toISOStringShort(dateFrom)
        const toStr = toISOStringShort(dateTo)
        const customer = Number(this.member['pootsy-id'])

        /** @type {Bookings} */
        let bookings = []

        try {
            const url = new URL('https://blue.inplace.be/api/bookings')
            const params = new URLSearchParams({
                code: 'X0XQCODICDXlLbCRdgVHLlN7C-lNWRZ_DOZmJJkxyAj5AzFu3r05kw==',
                customer,
                from_date: fromStr,
                to_date: toStr
            })

            url.search = params
            const res = await fetch(url)
            const resJson = await res.json()
            bookings = this.remodel(resJson)
        } catch (err) {
            console.error(err)
        }

        this.isLoading = false
        return bookings
    }

    /**
     * @typedef {Object} BookingType
     * @property {string} id
     * @property {number} teamMemberId
     * @property {number} customerId
     * @property {string} teamMember
     * @property {string} serviceDate
     * @property {string} startTime
     * @property {string} endTime
     * @property {string} startEndTime
     * @property {string} day
     * @property {string} weekday
     * @property {string} month
     * @property {boolean} recurrence
     * @property {string} status
     * @property {string} canceled
     * @property {number} duration
     * @property {Function} onCancel
     *
     * @typedef {BookingType[]} Bookings
     */
    /**
     * Remodel booking data to fit interface needs
     * @param {import('../../types/bookings').BookingsReadResponse} incoming
     * @returns {Bookings}
     */
    remodel(incoming) {
        const { lang } = this

        return incoming?.data?.map(orig => {
            const dateStrToTime = dateStr =>
                new Date(dateStr).toLocaleTimeString('fr', { timeStyle: 'short' })
            const startEndTime = attrs =>
                `${dateStrToTime(attrs.start_time)} - ${dateStrToTime(attrs.end_time)}`

            const attrs = orig.attributes
            const date = new Date(attrs.start_time)

            // Can only cancel if up to 3 days before delivery date & service is not canceled
            const isCancelVisible = attrs.service_delivery_status === 'assigned'
            const isCancelEnabled =
                date.getTime() - Date.now() > 3 * 24 * 60 * 60 * 1000 && !attrs.canceled
            const isCancelVisibleAndEnabled = isCancelVisible && isCancelEnabled
            const isCancelVisibleAndDisabled = isCancelVisible && !isCancelEnabled

            /** @type {BookingType} */
            const booking = {
                id: orig.id,
                teamMemberId: attrs.worker_contract_id,
                customerId: attrs.customer_contract_id,
                teamMember: attrs.worker_display_name,
                serviceDate: attrs.delivery_date,
                startTime: dateStrToTime(attrs.start_time),
                endTime: dateStrToTime(attrs.end_time),
                startEndTime: startEndTime(attrs),
                day: date.getDate(),
                weekday: date.toLocaleDateString(lang, { weekday: 'short' }),
                month: date.toLocaleDateString(lang, { month: 'short' }),
                recurrence: attrs.recurrence,
                status: attrs.service_delivery_status,
                canceled: attrs.service_delivery_status === 'cancelled',
                duration: `${attrs.billable_hours}h`,
                isCancelVisibleAndEnabled,
                isCancelVisibleAndDisabled,
                onCancel: this.onCancel.bind(this),
                getCancelAttrs: { id: orig.id }
            }

            return booking
        })
    }

    onCancel(_event, elem) {
        // Store booking id to be retrieved later
        this.actionBookingId = elem.id

        //  Workaround to trigger popup animation
        document.getElementById('popup-btn').click()
    }

    /**
     * Send cancelation request
     * @param {SubmitEvent} event
     */
    async onCancelConfirm(event) {
        event.preventDefault()

        const model = {
            wait: true
        }

        const comp = dataBind.init(document.querySelector('[data-bind-comp="popupComp"]'), model)
        await comp.render()

        try {
            const id = this.actionBookingId
            const url = new URL(`https://blue.inplace.be/api/booking/${id}`)
            const params = new URLSearchParams({
                code: 'rvzrvPgH8mUra2ayJcLDvIQhn6k6NEUFivB1ULquVcTJwbqlh7R4Wg=='
            })
            url.search = params

            const res = await fetch(url, { method: 'DELETE' })
            const bookingInfo = await res.json()
            this.raiseWebhook(bookingInfo)
        } catch (e) {
            console.log(e)
        }

        //  Workaround to trigger popup closed animation
        document.getElementById('popup-close').click()

        // Remove loading thing
        model.wait = false
        comp.render()

        // Refresh bookings
        this.load()
    }

    /**
     * Raise cancelled booking event to send notifications
     * @param {Object} booking
     */
    async raiseWebhook(booking) {
        const payload = {
            member: this.member,
            booking
        }
        fetch('https://hooks.zapier.com/hooks/catch/10465457/blrmn58/', {
            method: 'POST',
            body: JSON.stringify(payload)
        })
    }

    /**
     * Get the user language from Weglot
     */
    get lang() {
        // eslint-disable-next-line no-undef
        return Weglot?.getCurrentLang() || 'FR'
    }
}

// eslint-disable-next-line no-use-before-define
const controller = new BookingsController()
controller.init()
