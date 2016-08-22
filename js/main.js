(function ($) {

  'use strict'

  $.fn.datepicker.dates['zh-TW'] = {
    days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    daysShort: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
    daysMin: ['日', '一', '二', '三', '四', '五', '六'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    today: '今天',
    format: 'yyyy年mm月dd日',
    weekStart: 1,
    clear: '清除'
  }

  $.date = function (dateObject) {
    var d = new Date(dateObject)
    var day = d.getDate()
    var month = d.getMonth() + 1
    var year = d.getFullYear()
    if (day < 10) {
      day = "0" + day
    }
    if (month < 10) {
      month = "0" + month
    }
    var date = year + "/" + month + "/" + day

    return date
  }

  var state = {
    category: "normal",
    month: 1,
    week: [],
    interval: [9, 17],
    oilprice: "1",
    rainfall: "1",
    temperature: "1",
    date: $.date(new Date())
  }

  var $month = $('#month')
  var monthContent = '<div class="btn-group" role="group">' +
    '<label class="btn btn-primary">' +
    '<input type="radio" name="month" autocomplete="off" value="#{val}">#{label}' +
    '</label>' +
    '</div>'

  var $week = $('#week')
  var weekContent = '<div class="btn-group" role="group">' +
    '<label class="btn btn-primary">' +
    '<input type="checkbox" name="week" autocomplete="off" value="#{val}">#{label}' +
    '</label>' +
    '</div>'

  var $calendar = $('#calendar')
  var $rainfall = $('#rainfall')
  var $temperature = $('#temperature')
  var $oilprice = $('#oilprice')
  var simpleContent = '<label class="btn btn-primary">' +
    '<input type="radio" name="#{name}" autocomplete="off" value="#{val}">#{label}' +
    '</label>'

  var $interval = $('#interval')

  jQuery(function ($) {

    $('.nav-tabs a:first').tab('show')

    $('#category').find('.btn').on('click', function () {
      state['category'] = $(this).find('input[name="category"]').val()
      switch (state['category']) {
      case 'normal':
        $month.removeClass('hide')
        $week.removeClass('hide')
        $calendar.addClass('hide')
        break
      case 'unusual':
        $month.addClass('hide')
        $week.addClass('hide')
        $calendar.removeClass('hide')
        break
      }
    })

    // 月份.
    var monthHtmlAry = []

    for (var i = 1; i < 13; i++) {
      monthHtmlAry.push(monthContent.replace(/#\{label\}/g, '' + i).replace(/#\{val\}/g, '' + i))
    }
    $month.find('.btn-group').html(monthHtmlAry.join('')).children(':first').find('.btn').click()

    // 星期.
    var weekHtmlAry = []
    $.map(['一', '二', '三', '四', '五', '六', '日'], function (v, i) {
      weekHtmlAry.push(weekContent.replace(/#\{label\}/g, v).replace(/#\{val\}/g, i + 1))
    })

    // 預設禮拜一
    $week.find('.btn-group').html(weekHtmlAry.join(''))
      .find('.btn').on('click', function () {
        setTimeout(function () {
          syncWeekState()
        }, 0)
      }).end()
      .children(':first').find('.btn').click()

    // 時段.
    $interval.slider({
      id: 'slider-interval',
      min: 0,
      max: 23,
      range: true,
      tooltip: 'always',
      value: [9, 17],
      formatter: function formatter(val) {
        if (Array.isArray(val)) {
          return val[0] + '點 ~ ' + val[1] + '點'
        } else {
          return val
        }
      }
    })

    $interval.on('slide', function (slideEvt) {
      state.interval = slideEvt.value
    })

    // 雨量.
    var rainfallHtmlAry = []
    $.map(['等級1', '等級2', '等級3', '等級4'], function (v, i) {
      rainfallHtmlAry.push(
        simpleContent
          .replace(/#\{name\}/g, 'rainfall')
          .replace(/#\{label\}/g, v)
          .replace(/#\{val\}/g, i + 1)
      )
    })
    $rainfall.html(rainfallHtmlAry.join(''))

    // 氣溫.
    var temperatureHtmlAry = []

    $.map(['等級1', '等級2', '等級3', '等級4'], function (v, i) {
      temperatureHtmlAry.push(
        simpleContent
          .replace(/#\{name\}/g, 'temperature')
          .replace(/#\{label\}/g, v)
          .replace(/#\{val\}/g, i + 1)
      )
    })
    $temperature.html(temperatureHtmlAry.join(''))

    // 油價.
    var oilpriceHtmlAry = []
    $.map(['等級1', '等級2', '等級3', '等級4'], function (v, i) {
      oilpriceHtmlAry.push(
        simpleContent
          .replace(/#\{name\}/g, 'oilprice')
          .replace(/#\{label\}/g, v)
          .replace(/#\{val\}/g, i + 1)
      )
    })
    $oilprice.html(oilpriceHtmlAry.join(''))

    syncState()

    // 搜尋.
    $('button[type="submit"]').on('click', function () {
      console.log(JSON.stringify(state))
    })

    // 日期.
    $calendar.find('div').datepicker({
        language: "zh-TW",
        format: "yyyy/mm/dd",
        todayHighlight: true
      })
      .on('changeDate', function (e) {
        state.date = e.format()
      })

  })

  function syncWeekState() {
    state.week.length = 0
    $week.find('.btn.active').find('input').each(function (index) {
      state.week.push($(this).val())
    })
  }

  function syncState() {
    $('.sync').each(function (index) {
      var $el = $(this)
      var key = $el.attr('id')
      $el.find('.btn').on('click', function () {
        state['' + key + ''] = $(this).find('input[name=' + key + ']').val()
      })
    })
  }

})(jQuery)
