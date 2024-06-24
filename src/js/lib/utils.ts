export function isMobileBrowser(): boolean {
  const userAgent = navigator.userAgent || navigator.vendor
  const mobileAgents = [
    /android/i,
    /iphone/i,
    /ipad/i,
    /ipod/i,
    /blackberry/i,
    /windows phone/i,
    /opera mini/i,
    /iemobile/i,
    /mobile/i,
  ]
  return mobileAgents.some((mobileAgent) => mobileAgent.test(userAgent))
}

export function browserHeightLessThan(height: number): boolean {
  const currentHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  return currentHeight < height
}

export function scrollToElement(
  elem: HTMLElement,
  scrollOffset: number = 0
): void {
  const elementPosition = elem.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - scrollOffset

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  })
}
