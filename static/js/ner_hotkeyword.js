 // Show the page with default setting when page is initialized.
 call_ajax();

 //** submit event
 $('#btn_ok').on('click', function () {
     call_ajax();
 }); //event function

 $("input[name='cateradio']").on('change', function () {
     call_ajax();
 }); //event function

 $("input[name='nerradio']").on('change', function () {
     call_ajax();
 }); //event function

 function call_ajax() {
     //var call_ajax = function() {
     // get user's input
     const ner_value = $("input[name='nerradio']:checked").val();
     console.log(ner_value);

     const cate = $("input[name='cateradio']:checked").val();

     var topk = $('#topk_keys').val();
     console.log(topk);

     // send and get data
     $.ajax({
         type: "POST",

         //url: "/ner_hotkeyword/api_get_ner_hot_keyword/",
         url: "https://charles-newsanalysis-api.df.r.appspot.com/ner_hotkeyword/api_get_ner_hot_keyword/",
         data: {
             "news_category": cate,
             "topk": topk,
             "ner_value": ner_value,
         },
         success: function (received) {

             // clear previous top words
             $('#topkeys').empty();
             // clear previous cloud chart
             $('#cloud').empty();

             console.log(received.data);
             if (received.data.length == 0) {
                 $('#cloud').append("<h4>No Data!</h4>");
                 $('#topkeys').append("<h4>No Data!</h4>");
                 return
             }

             const data_barchart = received.data.data_barchart;
             showChart(data_barchart);

             const wf_pairs = received.data.wf_pairs;
             showTopKeys(wf_pairs);

             topWordToDraw = received.data.data_cloud;
             drawCloud(topWordToDraw, '#cloud');

         } //ajax function
     }); //ajax
 } //call_ajax


 //** cloud chart
 function drawCloud(topWordToDraw, element_id) {

     // You should set a proper box size to show cloud chart
     // 在此設定雲圖在網頁中的適當大小
     const width = 500;
     const height = 500;

     // First define your cloud data, using `text` and `size` properties:
     // Next you need to use the layout script to calculate the placement, rotation and size of each word:
     // Constructs a new cloud layout instance.
     d3.layout.cloud()
         .size([width, height])
         .words(topWordToDraw) //data for cloud chart
         .rotate(function () {
             //return ~~(Math.random() * 2) * 90; //~~1.5 => 1  (same as Math.floor(1.5))
             return 0; // don't rotate
         })
         .font("Impact")
         .fontSize(function (d) {
             return d.size;
         })
         .on("end", draw) //call function draw()
         .start();

     // Finally implement `draw`, which performs the D3 drawing
     function draw(words) {

         const fill = d3.scale.category20();

         // append the svg object to the body of the page
         d3.select(element_id).append("svg") // element_id such as "#cloud"
             .attr("width", width)
             .attr("height", height)
             .append("g")
             .attr("transform", "translate(" + ~~(width / 2) + "," + ~~(height / 2) + ")")
             .selectAll("text")
             .data(words)
             .enter().append("text")
             .style("font-size", function (d) {
                 return d.size + "px";
             })
             .style("-webkit-touch-callout", "none")
             .style("-webkit-user-select", "none")
             .style("-khtml-user-select", "none")
             .style("-moz-user-select", "none")
             .style("-ms-user-select", "none")
             .style("user-select", "none")
             .style("cursor", "default")
             .style("font-family", "Impact")
             .style("fill", function (d, i) {
                 return fill(i);
             })
             .attr("text-anchor", "middle")
             .attr("transform", function (d) {
                 return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
             })
             .text(function (d) {
                 return d.text;
             });
     } //draw
 } //drawCloud()



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