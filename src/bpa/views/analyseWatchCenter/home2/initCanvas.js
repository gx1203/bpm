// ellipse 偏移系数
// (410, 268) (384, 226) 0.13  0
// (411, 269) (355, 210) 0.13  0
// (398, 268) (337, 200) 0.13  0
// (399, 270) (225, 112) 0.14  0
// (400, 263) (175, 80)  0.11  0
export default function initCanvas() {
  const PI = Math.PI
  const cos = Math.cos
  const sin = Math.sin
  const deg = arg => PI / 180 * arg
  const aRound = PI * 2
  const biasRatio = deg(7.5)


  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  ctx.translate(-0.5, -0.5)
  const clear = () => {ctx.clearRect(0, 0, canvas.width, canvas.height)}
  let alpha = 0
  let startDeg = 0.01
  animation()
  function animation() {
    window.requestAnimationFrame(animation)
    alpha === 31.4 ? 0 : alpha += 0.1
    startDeg === 3.14 ? 0 : startDeg += 0.01
    ctx.restore()
    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    ctx.strokeStyle = '#3eb2dc'
    ctx.ellipse(410, 268, 384, 226, biasRatio, 0, aRound)
    ctx.save()
    ctx.stroke()
    ctx.beginPath()
    ctx.translate(410, 268)
    ctx.rotate(biasRatio)

    ctx.arc(384 * sin(deg(alpha)), 226 * cos(deg(alpha)), 5, 0, aRound)
    ctx.fillStyle = '#3eb2dc'
    ctx.shadowColor = '#3eb2dc'
    ctx.shadowBlur = 20
    ctx.fill()
    ctx.beginPath()
    ctx.arc(384 * sin(deg(alpha + 80)), 226 * cos(deg(alpha + 80)), 5, 0, aRound)
    ctx.fillStyle = '#3eb2dc'
    ctx.shadowColor = '#3eb2dc'
    ctx.shadowBlur = 20
    ctx.fill()
    ctx.beginPath()
    ctx.arc(384 * sin(deg(alpha + 250)), 226 * cos(deg(alpha + 250)), 5, 0, aRound)
    ctx.fillStyle = '#3eb2dc'
    ctx.shadowColor = '#3eb2dc'
    ctx.shadowBlur = 20
    ctx.fill()

    ctx.beginPath()
    ctx.restore()
    ctx.lineWidth = 5
    ctx.ellipse(411, 269, 355, 210, biasRatio, startDeg, startDeg + 1)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(411, 269, 355, 210, biasRatio, startDeg + 3, startDeg + 5)
    ctx.stroke()

    ctx.beginPath()
    ctx.setLineDash([3, 5])
    ctx.lineWidth = 1
    ctx.strokeStyle = '#3eb2dc'
    ctx.ellipse(398, 268, 337, 200, biasRatio, startDeg, aRound + startDeg)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineWidth = 20
    ctx.setLineDash([1, 8])
    ctx.ellipse(399, 270, 225, 112, biasRatio, startDeg, aRound + startDeg)
    let ellipseLinear = ctx.createRadialGradient(420, 200, 120, 420, 350, 300)
    ellipseLinear.addColorStop(0, 'transparent');
    ellipseLinear.addColorStop(0.4, '#3eb2dc');
    ellipseLinear.addColorStop(1, '#3eb2dc');
    ctx.strokeStyle = ellipseLinear
    ctx.stroke()
  }
}