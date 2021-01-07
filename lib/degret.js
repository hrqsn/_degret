import FileSaver from 'file-saver'

export default class Degret {
  constructor (props) {
    this.gridval = props.gridSize
    this.canvasMagnification = 25
    this.canvasWidth = props.gridSize
    this.canvasHeight = props.gridSize
    this.startPoint = { x: 0, y: 0 }
    this.x2 = 0
    this.y2 = 0
    this.gridInput = props.gridSize
    this.gridOutput = props.gridSize
    this.number = props.degree
    this.distance = props.distance
    this.isCenterChecked = props.centerChecked
    this.isNonOverrideChecked = props.nonOverrideChecked
    this.canvas = props.canvas
    this.ctx = props.context

    this.canvas.width = this.canvasWidth * this.canvasMagnification
    this.canvas.height = this.canvasHeight * this.canvasMagnification
    this.ctx.fillStyle = '#111827'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.startPoint = { x: 0, y: 0 }

    this.drawRule()
    this.numChange()
  }

  /**
   * 内部関数
   */

  update (props) {
    if (this.gridval !== props.gridSize) {
      this.canvas.width = this.canvasWidth * this.canvasMagnification
      this.canvas.height = this.canvasHeight * this.canvasMagnification
      this.ctx.fillStyle = '#111827'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      this.drawRule()
    }

    this.gridval = props.gridSize
    this.canvasWidth = props.gridSize
    this.canvasHeight = props.gridSize
    this.gridInput = props.gridSize
    this.gridOutput = props.gridSize
    this.number = props.degree
    this.distance = props.distance
    this.isCenterChecked = props.centerChecked
    this.isNonOverrideChecked = props.nonOverrideChecked

    this.numChange()
  }

  updateGridSize () {
    this.canvas.width = this.canvasWidth * this.canvasMagnification
    this.canvas.height = this.canvasHeight * this.canvasMagnification
    this.ctx.fillStyle = '#111827'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.drawRule()
  }

  // グリッドの升目を描画
  drawRule () {
    this.ctx.strokeStyle = '#1F2937'
    this.ctx.lineWidth = 2
    this.ctx.beginPath()

    // 縦線
    for (let i = 0; i < this.canvasWidth + 1; i++) {
      this.ctx.moveTo(this.canvasMagnification * i, 0)
      this.ctx.lineTo(this.canvasMagnification * i, this.canvas.height)
    }

    // 横線
    for (let i = 0; i < this.canvasHeight + 1; i++) {
      this.ctx.moveTo(0, this.canvasMagnification * i)
      this.ctx.lineTo(this.canvas.width, this.canvasMagnification * i)
    }

    this.ctx.stroke()
  }

  // 更新ボタンが押されたら呼ばれる関数
  numChange () {
    const number = this.number
    const distanceNumber = this.distance

    if (!this.isNonOverrideChecked) {
      this.lineRemove()
    }
    if (this.isCenterChecked) {
      this.startPoint.x = Math.floor(this.canvasWidth / 2)
      this.startPoint.y = Math.floor(this.canvasHeight / 2)
    } else {
      this.startPoint.x = 0
      this.startPoint.y = 0
    }

    this.getPointByDistanceAndDegree(distanceNumber, number)
  }

  // 引数で渡された距離と角度で第二地点の座標を計算する関数
  getPointByDistanceAndDegree (distance, degree) {
    this.count = 0

    this.x2 = this.startPoint.x + distance * Math.cos(degree * (Math.PI / 180))
    this.y2 = this.startPoint.y + distance * Math.sin(degree * (Math.PI / 180))

    this.drawline(this.startPoint.x, this.startPoint.y, this.x2, this.y2)
  }

  /**
   * イベント
   */

  // グリッド状の線を全て消す関数
  lineRemove () {
    this.ctx.fillStyle = '#111827'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  // 引数で渡された第一座標と第二座標で直線を描画する関数
  drawline (x0, y0, x1, y1) {
    let tmp
    const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0)
    if (steep) {
      // swap x0,y0
      tmp = x0; x0 = y0; y0 = tmp
      // swap x1,y1
      tmp = x1; x1 = y1; y1 = tmp
    }

    let sign = 1
    if (x0 > x1) {
      sign = -1
      x0 *= -1
      x1 *= -1
    }
    const dx = x1 - x0
    const dy = Math.abs(y1 - y0)
    let err = ((dx / 2))
    const ystep = y0 < y1 ? 1 : -1
    let y = y0

    for (let x = x0; x <= x1; x++) {
      if (!(steep ? this.plot(y, sign * x) : this.plot(sign * x, y))) return
      err = (err - dy)
      if (err < 0) {
        y += ystep
        err += dx
      }
    }

    this.drawRule()
  }

  // ここで直線を描画
  plot (x, y) {
    const col = Math.floor(x)
    const row = Math.floor(y)

    this.ctx.fillStyle = '#DC2626'
    this.ctx.fillRect(col * this.canvasMagnification, row * this.canvasMagnification,
      this.canvasMagnification, this.canvasMagnification)

    return true
  }

  // グリッドを画像に変換してダウンロードする関数
  download () {
    const type = 'image/png'
    const canvas = this.canvas
    const data = canvas.toDataURL(type)

    FileSaver.saveAs(data, 'degret.png')
  }
}
