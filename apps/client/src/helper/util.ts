const roundMoney = (amount: number) => {
  return Math.round(amount * 100) / 100
}

function toFixedNoRounding(number: number) {
  const factor = Math.pow(10, 2)
  return Math.floor(number * factor) / factor
}

const countDecimals = (number: number) => {
  if (!number) return 0

  if (Math.floor(number) === number) return 0
  return number.toString().split('.')[1].length || 0
}

const animateMoney = (
  element: any,
  endValue: number,
  duration: number = 200
) => {
  const startValue = +element.innerText

  const startTime = Date.now()
  const endTime = startTime + duration
  const totalChange = endValue - startValue

  const interval = setInterval(() => {
    const currentTime = Date.now()
    const timeElapsed = currentTime - startTime
    const progress = timeElapsed / duration

    const currentValue =
      startValue + totalChange * (1 - Math.pow(1 - progress, 2))

    if (currentTime >= endTime) {
      element.innerText = roundMoney(endValue)
      // io.emit('game:rolling', endValue)
      clearInterval(interval)
    } else {
      element.innerText = roundMoney(currentValue)
      // io.emit('game:rolling', currentValue)
    }
  }, 1)
}

export { roundMoney, animateMoney, countDecimals, toFixedNoRounding }
