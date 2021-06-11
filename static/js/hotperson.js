// Show the default chart when page is initialized.
call_ajax();

$("input[name='cateradio']").on('change', function () {
    call_ajax();
}); //event function

$("input[name='topkradio']").on('change', function () {
    call_ajax();
}); //event function

// Here is the Ajax function to draw chart
function call_ajax() {

    const cate = $("input[name='cateradio']:checked").val();
    const topk = $("input[name='topkradio']:checked").val();

    $.ajax({
        type: "POST",
        url: "https://charles-newsanalysis-api.df.r.appspot.com/api_get_hotPerson/",
        //url: "api_get_hotPerson/",
        data: {
            "news_category": cate,
            "topk": topk
        },
        success: function (received) {
            let chart_data = received.chart_data;
            let wf_pairs = received.wf_pairs;
            console.log(wf_pairs);

            showChart(chart_data);
            showTopKeys(wf_pairs);

        } //ajax function
    }); //ajax
}; //call_ajax

//* 顯示關鍵詞資料函數
function showTopKeys(items) {
    //先清除前一次的資料
    $('#topkeys').empty();

    //將內容加上li標籤附加起來，顯示在顯示區"topkeys"
    for (let i = 0; i < items.length; i++) {
        let item_li = "<li>" + items[i] + "</li>";
        $('#topkeys').append(item_li);
    }
} //function

//**繪圖函數showChart()
function showChart(chart_data) {

    // 畫圖需要的數據資料
    let values = chart_data.values;
    let labels = chart_data.labels;
    let category = chart_data.category;

    //第1個變數: 餵給chart的資料
    let data = {
        labels: labels,
        datasets: [{
            label: category,
            data: values,
            backgroundColor: randomColors(values.length),
            borderColor: randomColors(values.length),
            borderWidth: 1,
        }],
    };

    //第2個變數: chart的選項  指定y坐標軸從零開始顯示
    let options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
    };

    //取得在前面html區域欲顯示的圖代號
    let canvas_mychrat = document.getElementById("mychart");


    //**先清除前一個圖 再繪新圖
    // 可以印出barchart物件是否存在
    // console.log(window.barchart);
    //先清除前一個圖 再繪新圖 if 有以下兩種寫法皆可
    // if (window.barchart)  //若存在則為true
    // if (typeof (barchart) != "undefined"){
    if (window.barchart) {
        barchart.destroy();
    }

    //**繪圖(產生一個圖物件變數名稱為barchart)
    // 必須全域變數--注意:前面不要有let, var, const等修飾詞
    // 理由: 我們要讓它存在於網頁全域變數，
    // 這樣我們才方便判斷是否有前一次的圖，如果存在有，要刪除之，否則，很多張圖會疊在一起 
    barchart = new Chart(canvas_mychrat, {
        type: 'bar',
        data: data,
        options: options,
    });


    //** 產生隨機顏色
    function randomColors(num_colors) {
        let colors = [];

        for (i = 0; i < num_colors; i++) {

            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            let rgb = `rgba(${r},${g},${b},0.5)` // (red, green, blue, alfa) alfa透明度

            colors.push(rgb);
        }
        return colors;
    }
} //show chart function