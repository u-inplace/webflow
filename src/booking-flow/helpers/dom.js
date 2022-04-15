class Dom {
    /**
     * Get Element by Id
     *
     * @param {string} id element id
     * @returns {Element}
     */
    static id(id) {
        return document.getElementById(id)
    }

    /**
     * Query selector
     *
     * @param {string} query Dom query string
     * @returns {Element}
     */
    static q(query) {
        return document.querySelector(query)
    }

    /**
     * Query selector all
     *
     * @param {string} query Dom query string
     * @returns {NodeList}
     */
    static qall(query) {
        return document.querySelectorAll(query)
    }

    /**
     * Message popup
     * @param {string} id
     * @returns {Promise}
     */
    static toast(id) {
        const toastBlock = document.getElementById(id)
        toastBlock.classList.add('active')

        return setTimeout(() => {
            toastBlock.classList.remove('active')
        }, 1000 * 4)
    }

    static set nextButtonDisabled(isDisabled) {
        const nextButton = document.querySelector('.next-button-flow')
        nextButton.disabled = isDisabled
        if (isDisabled) nextButton.classList.add('disabled')
        else nextButton.classList.remove('disabled')
    }
}

const dom = Dom

export default dom
