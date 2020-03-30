/**
 * Enum for locations.
 * @readonly
 * @enum {{name: string, season: function(int): string}
 */
export const Location = Object.freeze({
  NORTHERN_HEMISPHERE: { name: 'north', season: meteorologicalSeason(['winter', 'spring', 'summer', 'autumn']) },
  SOUTHERN_HEMISPHERE: { name: 'south', season: meteorologicalSeason(['summer', 'autumn', 'winter', 'spring']) },
  INDIA: { name: 'india', season: meteorologicalSeasonIndia }
})

/**
 * Class representing a QuattroStagioni instance.
 */
export class QuattroStagioni {
  /**
   * Creates a new instance.
   * `el` is always lazy evaluated.
   *
   * @param {Location} location An indication in which location of the world the user is.
   * @param {string} classNamePrefix Define a prefix, which is added to all the class names.
   * Use this, to avoid collisions with your existing class names
   */
  constructor(location = Location.NORTHERN_HEMISPHERE, classNamePrefix = '') {
    this._location = location
    this.lastAppliedSeason = null
  }

  /**
   * Gets the currently defined location.
   * @returns {Location}
   */
  get location() {
    return this._location
  }

  /**
   * Sets the target element.
   * @param {HTMLElement | function(): HTMLElement} el
   * May be an HTML element or a function that is evaluated lazily when the el is actually needed.
   */
  set el(el) {
    this._el = el
  }

  /**
   * Gets the target element.
   * @returns {HTMLElement | undefined} Returns an HTMLElement. May be undefined.
   */
  get el() {
    if (this._el === undefined) {
      this._el = getBody()
      return this._el
    }

    if (typeof this._el === "function") {
      this._el = this._el()
      return this._el
    }

    return this._el
  }

  /**
   *
   * @param {*} date
   */
  update(date = new Date()) {
    let meteorologicalSeason = this.meteorologicalSeason(date)

    console.log(this.el)
    let classList = this.el.classList

    if (this.lastAppliedSeason !== null) {
      classList.remove(this.lastAppliedSeason)
    }

    classList.add(meteorologicalSeason)
    this.lastAppliedSeason = meteorologicalSeason
  }

  /**
   * Determines the meteorological season for the given location and the given date.
   *
   * @param {Date} date The date for which to season should be determined.
   * Defaults to `new Date()`.
   * @returns {string} The name of the current season.
   */
  meteorologicalSeason(date = new Date()) {
    let month = date.getMonth() + 1 // Date months start at 0, so adding 1
    return this.location.season(month)
  }
}

/**
 * Returns a mapping function that maps the given seasons to a given date.
 * Based on https://en.wikipedia.org/w/index.php?title=Season&oldid=947807995#Meteorological
 *
 * @param {[string]} seasons
 * @returns {function(int): string} A function that gets the specific season for a give month.
 */
function meteorologicalSeason(seasons) {
  return (month) => {
    switch (month) {
      case 12: // December
      case 1: // January
      case 2: // February
        return seasons[0]

      case 3: // March
      case 4: // April
      case 5: // May
        return seasons[1]

      case 6: // June
      case 7: // July
      case 8: // August
        return seasons[2]

      case 9: // September
      case 10: // October
      case 11: // November
        return seasons[3]
    }
  }
}

/**
 * Determines the current season.
 * Based on https://en.wikipedia.org/w/index.php?title=Season&oldid=947807995#Meteorological
 *
 * @param {[string]} seasons
 * @returns {function(int): string} A function that maps the month to the given seasons.
 */
function meteorologicalSeasonIndia(month) {
  switch (month) {
    case 12: // Dec
    case 1: // Jan
    case 2: // Feb
      return 'winter'

    case 3: // March
    case 4: // April
    case 5: // May
      return 'summer'

    case 6: // June
    case 7: // July
    case 8: // August
    case 9: // September
      return 'monsoon'

    case 10: // October
    case 11: // November
      return 'autumn'
  }
}

/**
 * Finds the (first) body element in the current document.
 *
 * @returns {HTMLElement | undefined} Returns the (first) body HTMLElement or undefined if there's no body.
 */
function getBody() {
  let bodies = document.getElementsByTagName('body')
  let firstBody = bodies.length >= 1 ? bodies[0] : undefined
  return firstBody
}
