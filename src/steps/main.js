/* eslint-disable no-var */
import DOM from './dom'
import Navigation from './navigation'

/**
 * Add handlers
 */
const sliderController = () => {
    const nav = new Navigation()

    DOM.slider.nextButton.addEventListener('click', nav.onNext.bind(nav))
    DOM.slider.backButton.addEventListener('click', nav.onBack.bind(nav))
}

// eslint-disable-next-line no-use-before-define
var Webflow = Webflow || window.Webflow || []
Webflow.push(sliderController)
