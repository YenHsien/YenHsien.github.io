 $(function () {
     $('#btn_get_house').on('click', function () {
         callAjax();
         $(this).button('loading').delay(2000).queue(function () {
             $(this).button('reset');
             $(this).dequeue();
         });
     });
 });




 function callAjax() {
     $('#thead').empty();
     $('#tbody').empty();
     let city_name = $('#city_name').val();
     let low_price = $('#low_price').val();
     let high_price = $('#high_price').val();



     jQuery.ajax({
         type: "POST",
         url: "https://charles-house-api.df.r.appspot.com/api_get_house/",
         data: {
             "city_name": city_name,
             "low_price": low_price,
             "high_price": high_price,

         }, //pass to server
         success: function (received) {
             //console.log(received);
             let result = received.house_details;

             let data_length = result.length

             $('#show_data_length').empty();
             $('#show_data_length').append("符合搜尋條件的共有" + data_length + "筆房屋資料");

             if ($(window).width() <= 414) {
                 for (let i = 0; i < result.length; i++) {
                     let item_td = "<tr><td>" + result[i].category + "</td>" +
                         "<td><a href=" + result[i].link + ">" + result[i].title + "</td>" +
                         "<td>" + result[i].land_area + "</td>" +
                         "<td>" + result[i].house_area + "</td>" +
                         "<td>" + result[i].price + "</td></tr>";
                     $('#tbody').append(item_td);
                 }
                 let thead_item = "<tr>" +
                     "<th>種類</th>" +
                     "<th>物件名稱</th>" +
                     "<th>地坪</th>" +
                     "<th>建坪</th>" +
                     "<th>售價(萬)</th>" +
                     "</tr>"
                 $('#thead').append(thead_item);
             } else if ($(window).width() < 660 && $(window).width() > 414) {
                 for (let i = 0; i < result.length; i++) {
                     let item_td = "<tr><td>" + result[i].category + "</td>" +
                         "<td><a href=" + result[i].link + ">" + result[i].title + "</td>" +
                         "<td>" + result[i].land_area + "</td>" +
                         "<td>" + result[i].house_area + "</td>" +
                         "<td>" + result[i].pattern + "</td>" +
                         "<td>" + result[i].price + "</td></tr>";
                     $('#tbody').append(item_td);
                 }
                 let thead_item = "<tr>" +
                     "<th>種類</th>" +
                     "<th>物件名稱</th>" +
                     "<th>地坪</th>" +
                     "<th>建坪</th>" +
                     "<th>格局</th>" +
                     "<th>售價(萬)</th>" +
                     "</tr>"
                 $('#thead').append(thead_item);
             } else {
                 for (let i = 0; i < result.length; i++) {
                     let item_td = "<tr><td>" + result[i].category + "</td>" +
                         "<td><a href=" + result[i].link + ">" + result[i].title + "</td>" +
                         "<td>" + result[i].location + "</a></td>" +
                         "<td>" + result[i].house_year + "</td>" +
                         "<td>" + result[i].land_area + "</td>" +
                         "<td>" + result[i].house_area + "</td>" +
                         "<td>" + result[i].floor + "</td>" +
                         "<td>" + result[i].pattern + "</td>" +
                         "<td>" + result[i].price + "</td></tr>";
                     $('#tbody').append(item_td);
                 }
                 let thead_item = "<tr>" +
                     "<th>種類</th>" +
                     "<th>物件名稱</th>" +
                     "<th>地址</th>" +
                     "<th>屋齡</th>" +
                     "<th>地坪</th>" +
                     "<th>建坪</th>" +
                     "<th>樓層</th>" +
                     "<th>格局</th>" +
                     "<th>售價(萬)</th>" +
                     "</tr>"
                 $('#thead').append(thead_item);
             }
         }, //success function
     }); //ajax
 } // btn on click event