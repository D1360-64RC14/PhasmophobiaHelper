class PhasmoSite {
    constructor(
        ghostListElement,
        evidenceListElement,
        informationListElement
    ) {
        this.ghostListElement = ghostListElement
        this.evidenceListElement = evidenceListElement
        this.informationListElement = informationListElement

        this.renderEvidences()
        this.renderGhostList()
        this.renderInformation(phasmoInfo.ghosts)
    }

    renderEvidences() {
        Object.entries(phasmoInfo.evidences).forEach(([index, evidence]) => {
            let option = document.createElement("evidence")
            option.setAttribute("data-index", index)
            option.setAttribute("data-active", "0")
            option.innerText = evidence

            option.onclick = changed => {
                changed.target.setAttribute("data-active",
                    changed.target.getAttribute("data-active") == "0" ? "1" : "0"
                )

                let checked = this.getCheckedInputs(this.evidenceListElement)

                if(checked.length > 3) {
                    changed.target.setAttribute("data-active", "0")
                } else {
                    this.updateGhostList(checked)
                }
            }
            this.evidenceListElement.appendChild(option)
        })
    }

    renderGhostList() {
        Object.keys(phasmoInfo.ghosts).map(ghost => {
            let ghostName = document.createElement("ghost-name")
            ghostName.setAttribute("data-show", "1")
            ghostName.innerText = ghost

            ghostName.onmouseover = hover => {
                let gName = hover.target.innerText
                let gPattern = phasmoInfo.ghosts[gName].evidencePattern

                gPattern.forEach(ev => {
                    let search = this.evidenceListElement.querySelector(`[data-index="${ev}"]`)
                    search.setAttribute("data-test", "1")
                })
            }
            ghostName.onmouseleave = () => {
                Array.from(this.evidenceListElement.children).forEach(ev => {
                    ev.setAttribute("data-test", "0")
                })
            }
            this.ghostListElement.appendChild(ghostName)
        })
    }

    renderInformation(ghostList) {
        Object.entries(ghostList).forEach(ghost => {
            let ghostElement = document.createElement("ghost")
            ghostElement.setAttribute("name", ghost[0])

            let ghostNameEl = document.createElement("ghost-name")
            ghostNameEl.innerText = ghost[0]

            let ghostDescriptionEl = document.createElement("ghost-description")
            ghostDescriptionEl.innerText = ghost[1].description

            let ghostStrengthEl = document.createElement("ghost-strength")
            ghostStrengthEl.appendChild(
                this.genInformationText("Pontos Fortes", ghost[1].strength)
            )

            let ghostWeaknessEl = document.createElement("ghost-weakness")
            ghostWeaknessEl.appendChild(
                this.genInformationText("Pontos Fracos", ghost[1].weakness)
            )

            let ghostEvidencesEl = document.createElement("ghost-evidences")
            let evidences = Object.values(phasmoInfo.evidences).filter((_, i) => {
                return ghost[1].evidencePattern.includes(i)
            }).join(", ").concat(".").split("").map(
                (v, i, a) => Array.from(a.join("").matchAll(",")).slice(-1)[0].index == i ? " e" : v)
            .join("")
            
            ghostEvidencesEl.appendChild(
                this.genInformationText("Evidências", evidences)
            )
            
            ghostElement.append(
                ghostNameEl,
                ghostDescriptionEl,
                ghostStrengthEl,
                ghostWeaknessEl,
                ghostEvidencesEl
            )

            this.informationListElement.appendChild(ghostElement)
        })
    }

    updateInformation(ghosts) {
        Array.from(this.informationListElement.children).forEach(infoEl => {
            if(ghosts.map(v => v[0]).includes(infoEl.getAttribute("name"))) {
                infoEl.setAttribute("class", "")
            } else {
                infoEl.setAttribute("class", "hiddenInfo")
            }
        })
    }

    updateGhostList(checked) {
        let enabledGhosts = []
        Object.entries(phasmoInfo.ghosts).forEach((ghost, ghostIndex) => {
            let ghostElement = this.ghostListElement.children[ghostIndex]

            if(this.contains(this.getEvidenceIndexFromChecked(checked), ghost[1].evidencePattern)) {
                ghostElement.setAttribute("data-show", "1")
                enabledGhosts.push(ghost)
            } else {
                ghostElement.setAttribute("data-show", "0")
            }
        })
        this.updateInformation(enabledGhosts)
    }

    genInformationText(title, text) {
        let titleEl = document.createElement("title")
        titleEl.innerText = title

        let textEl = document.createElement("text")
        textEl.appendChild(titleEl)
        textEl.appendChild(document.createTextNode(text))

        return textEl
    }

    simplifyString(string) {
        return string
            .toLowerCase()
            .replace(/ /gi, "_")
    }

    getCheckedInputs(element) {
        return Array.from(element.children).filter(act => {
            return act.getAttribute("data-active") == "1" ? true : false
        })
    }

    getEvidenceIndexFromChecked(elementList) {
        return elementList.map(inputEl => {
            return parseInt(inputEl.getAttribute("data-index"))
        })
    }

    contains(target, pattern) { // [0] em [0, 5, 9]
        return target.reduce((prev, curr) => prev && pattern.includes(curr), true)
    }
}

window.phasmoSite = new PhasmoSite(
    document.getElementById("ghost-list"),
    document.getElementById("evidences"),
    document.getElementById("information")
)