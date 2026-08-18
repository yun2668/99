document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // 手機版選單
  // ==============================

  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");

  if (menuBtn && nav) {

    menuBtn.addEventListener("click", () => {

      const open = nav.classList.toggle("open");

      menuBtn.setAttribute(
        "aria-expanded",
        String(open)
      );

    });


    nav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        nav.classList.remove("open");

        menuBtn.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  // ==============================
  // Canvas 畫布設定
  // ==============================

  function prepareCanvas(canvas, heightFunction) {

    const ratio =
      window.devicePixelRatio || 1;


    const width =
      canvas.clientWidth || 600;


    const height =
      heightFunction(width);


    canvas.width =
      Math.round(
        width * ratio
      );


    canvas.height =
      Math.round(
        height * ratio
      );


    canvas.style.height =
      height + "px";


    const ctx =
      canvas.getContext("2d");


    ctx.setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
    );


    return {

      ctx,
      width,
      height

    };

  }


  // ==============================
  // PM2.5 近24小時趨勢圖
  // ==============================

  function drawTrend() {

    const canvas =
      document.getElementById(
        "trendChart"
      );


    if (!canvas) {
      return;
    }


    const {

      ctx,
      width,
      height

    } = prepareCanvas(

      canvas,

      width =>

        Math.max(
          250,
          Math.min(
            370,
            width * 0.36
          )
        )

    );


    // ==============================
    // 示範 PM2.5 數據
    //
    // 正式上線後
    // 可改成 API / JSON 即時資料
    // ==============================

    const values = [

      12,
      11,
      10,
      9,
      8,
      9,

      11,
      14,
      18,
      20,
      22,
      24,

      23,
      21,
      19,
      17,
      16,
      15,

      17,
      20,
      23,
      21,
      19,
      18

    ];


    const labels = [

      "14",
      "15",
      "16",
      "17",
      "18",
      "19",

      "20",
      "21",
      "22",
      "23",
      "00",
      "01",

      "02",
      "03",
      "04",
      "05",
      "06",
      "07",

      "08",
      "09",
      "10",
      "11",
      "12",
      "13"

    ];


    const padding = {

      left:
        43,

      right:
        18,

      top:
        20,

      bottom:
        34

    };


    const maxValue =
      40;


    const plotWidth =

      width -

      padding.left -

      padding.right;


    const plotHeight =

      height -

      padding.top -

      padding.bottom;


    // 清空畫布

    ctx.clearRect(
      0,
      0,
      width,
      height
    );


    ctx.font =
      '12px "Microsoft JhengHei", sans-serif';


    // ==============================
    // Y 軸
    // ==============================

    [

      0,
      10,
      20,
      30,
      40

    ].forEach(value => {


      const y =

        padding.top +

        plotHeight -

        (
          value /
          maxValue
        )
        *
        plotHeight;


      // 格線

      ctx.strokeStyle =
        "rgba(17,59,85,0.10)";


      ctx.lineWidth =
        1;


      ctx.beginPath();


      ctx.moveTo(
        padding.left,
        y
      );


      ctx.lineTo(

        width -
        padding.right,

        y

      );


      ctx.stroke();


      // Y軸數字

      ctx.fillStyle =
        "#71868d";


      ctx.textAlign =
        "left";


      ctx.fillText(

        String(value),

        8,

        y + 4

      );

    });


    // ==============================
    // X 軸時間
    // ==============================

    labels.forEach(
      (label, index) => {


        // 每3小時顯示一次

        if (

          index % 3 !== 0 &&

          index !==
          labels.length - 1

        ) {

          return;

        }


        const x =

          padding.left +

          (
            index /
            (
              labels.length -
              1
            )
          )
          *
          plotWidth;


        ctx.fillStyle =
          "#71868d";


        ctx.textAlign =
          "center";


        ctx.fillText(

          label + "時",

          x,

          height - 10

        );

      }

    );


    // ==============================
    // 折線圖底部漸層
    // ==============================

    const gradient =
      ctx.createLinearGradient(

        0,
        padding.top,

        0,
        height -
        padding.bottom

      );


    gradient.addColorStop(

      0,

      "rgba(38,139,133,0.28)"

    );


    gradient.addColorStop(

      1,

      "rgba(38,139,133,0.02)"

    );


    ctx.beginPath();


    values.forEach(
      (value, index) => {


        const x =

          padding.left +

          (
            index /
            (
              values.length -
              1
            )
          )
          *
          plotWidth;


        const y =

          padding.top +

          plotHeight -

          (
            value /
            maxValue
          )
          *
          plotHeight;


        if (
          index === 0
        ) {

          ctx.moveTo(
            x,
            y
          );

        }

        else {

          ctx.lineTo(
            x,
            y
          );

        }

      }

    );


    ctx.lineTo(

      width -
      padding.right,

      height -
      padding.bottom

    );


    ctx.lineTo(

      padding.left,

      height -
      padding.bottom

    );


    ctx.closePath();


    ctx.fillStyle =
      gradient;


    ctx.fill();


    // ==============================
    // PM2.5 折線
    // ==============================

    ctx.beginPath();


    values.forEach(
      (value, index) => {


        const x =

          padding.left +

          (
            index /
            (
              values.length -
              1
            )
          )
          *
          plotWidth;


        const y =

          padding.top +

          plotHeight -

          (
            value /
            maxValue
          )
          *
          plotHeight;


        if (
          index === 0
        ) {

          ctx.moveTo(
            x,
            y
          );

        }

        else {

          ctx.lineTo(
            x,
            y
          );

        }

      }

    );


    ctx.strokeStyle =
      "#268b85";


    ctx.lineWidth =
      3;


    ctx.lineJoin =
      "round";


    ctx.lineCap =
      "round";


    ctx.stroke();


    // ==============================
    // 最後一筆資料標記
    // ==============================

    const lastValue =

      values[
        values.length -
        1
      ];


    const lastX =

      width -
      padding.right;


    const lastY =

      padding.top +

      plotHeight -

      (
        lastValue /
        maxValue
      )
      *
      plotHeight;


    ctx.beginPath();


    ctx.arc(

      lastX,

      lastY,

      5,

      0,

      Math.PI * 2

    );


    ctx.fillStyle =
      "#ffffff";


    ctx.fill();


    ctx.strokeStyle =
      "#268b85";


    ctx.lineWidth =
      3;


    ctx.stroke();

  }


  // ==============================
  // 今日空品時數圓餅圖
  // ==============================

  function drawPie() {

    const canvas =
      document.getElementById(
        "pieChart"
      );


    if (!canvas) {
      return;
    }


    const {

      ctx,
      width,
      height

    } = prepareCanvas(

      canvas,

      width =>

        Math.min(

          250,

          Math.max(
            210,
            width
          )

        )

    );


    // ==============================
    // 示範資料
    //
    // 良好：9 小時
    // 普通：13 小時
    // 敏感族群：2 小時
    // ==============================

    const data = [

      {

        value:
          9,

        color:
          "#4ca56d"

      },

      {

        value:
          13,

        color:
          "#f0c64b"

      },

      {

        value:
          2,

        color:
          "#ed8c3c"

      }

    ];


    const total =

      data.reduce(

        (
          sum,
          item
        ) =>

          sum +
          item.value,

        0

      );


    const centerX =
      width / 2;


    const centerY =
      height / 2;


    const radius =

      Math.min(
        width,
        height
      )
      *
      0.37;


    const innerRadius =

      radius *
      0.61;


    let startAngle =
      -Math.PI / 2;


    ctx.clearRect(
      0,
      0,
      width,
      height
    );


    // ==============================
    // 畫甜甜圈圖
    // ==============================

    data.forEach(
      item => {


        const angle =

          (
            item.value /
            total
          )
          *
          Math.PI
          *
          2;


        ctx.beginPath();


        ctx.arc(

          centerX,

          centerY,

          radius,

          startAngle,

          startAngle +
          angle

        );


        ctx.arc(

          centerX,

          centerY,

          innerRadius,

          startAngle +
          angle,

          startAngle,

          true

        );


        ctx.closePath();


        ctx.fillStyle =
          item.color;


        ctx.fill();


        startAngle +=
          angle;

      }

    );


    // ==============================
    // 中間文字
    // ==============================

    ctx.textAlign =
      "center";


    ctx.fillStyle =
      "#113b55";


    ctx.font =
      '700 30px "Microsoft JhengHei", sans-serif';


    ctx.fillText(

      "24",

      centerX,

      centerY - 2

    );


    ctx.fillStyle =
      "#70838a";


    ctx.font =
      '13px "Microsoft JhengHei", sans-serif';


    ctx.fillText(

      "小時",

      centerX,

      centerY + 20

    );

  }


  // ==============================
  // 執行圖表
  // ==============================

  function drawAllCharts() {

    drawTrend();

    drawPie();

  }


  drawAllCharts();


  // ==============================
  // 手機 / 視窗改變大小時
  // 自動重畫
  // ==============================

  let resizeTimer;


  window.addEventListener(
    "resize",
    () => {


      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          () => {

            drawAllCharts();

          },
          150
        );

    }

  );


  // ==============================
  // 圖片無法顯示時
  // 顯示備援畫面
  // ==============================

  document
    .querySelectorAll("img")
    .forEach(img => {


      img.addEventListener(
        "error",
        () => {


          img.style.display =
            "none";


          const parent =
            img.parentElement;


          if (!parent) {
            return;
          }


          if (

            parent.querySelector(
              ".image-fallback"
            )

          ) {

            return;

          }


          const fallback =
            document.createElement(
              "div"
            );


          fallback.className =
            "image-fallback";


          fallback.style.cssText = `

            min-height:300px;

            display:grid;

            place-items:center;

            text-align:center;

            padding:30px;

            background:
            linear-gradient(
              135deg,
              #e9f8f7,
              #eaf5fa
            );

            color:#113b55;

            font-weight:900;

            font-size:20px;

          `;


          fallback.innerHTML = `

            <div>

              <div
                style="
                  font-size:54px;
                  margin-bottom:8px;
                "
              >
                🌤️
              </div>

              PM2.5 細懸浮微粒資訊

            </div>

          `;


          parent.prepend(
            fallback
          );

        }

      );

    });


});
