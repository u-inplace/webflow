/* eslint-disable class-methods-use-this */
/* eslint-disable vars-on-top */
/* eslint-disable no-use-before-define */
/* eslint-disable no-var */

import { STEP } from '../controllers/sequence'
import StepController from '../controllers/step'
import dom from '../helpers/dom'

class Step extends StepController {
    constructor() {
        super(STEP.Cleaning)
    }

    /**
     * @returns {boolean}
     */
    get isNextDisabled() {
        const disabled = !(
            dom.getOption('supplies-conf', true) &&
            dom.getRadio('home-bathrooms', true) &&
            dom.getRadio('home-bedrooms', true)
        )
        return disabled
    }
}

var Webflow = Webflow || window.Webflow || []
Webflow.push(() => {
    const step = new Step()
    step.init()
})
