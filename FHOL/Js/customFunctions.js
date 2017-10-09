﻿/**
 * 
 * @author: Pramveer
 * @date: 09th Oct 2017
 * @desc: file for the custom javascript functions
 */

$(document).ready(function () {
    // remove the credits from the highcharts.
    if (Highcharts) {
        Highcharts.defaultOptions.credits.enabled = false;
    }
       
    getEnrolledPatientStatusData();
    getRxTrendAndActivatedData();
    getActivePatientsData();

});


// ajax call to get the enrolled patients data
let getEnrolledPatientStatusData = () => {
    $.ajax({
        type: "POST",
        url: "PhysicianDashBoard.aspx/getEnrolledPatientStatusData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            chartLoadComplete('enrolledPatientsChart');
            renderEnrolledStatusChart(response);
        }
    });
};


// ajax call to get the active patients data
let getActivePatientsData = () => {
    $.ajax({
        type: "POST",
        url: "PhysicianDashBoard.aspx/getActivePatientsData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            chartLoadComplete('activePatientsChart');
            renderActivePatientsChart(response);
        }
    });
}


// ajax call for rx Trend and Activated  data
let getRxTrendAndActivatedData = () => {
    $.ajax({
        type: "POST",
        url: "PhysicianDashBoard.aspx/getRxTrendAndActivatedData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            chartLoadComplete('rxTrendAndActivatedChart');
            renderRxTrendAndActivatedChart(response);
        }
    });
}



// function to render the enrolled status chart
let renderEnrolledStatusChart = (dataObj) => {
    let container = "enrolledPatientsChart";

    dataObj = JSON.parse(dataObj.d);
    dataObj = dataObj[0];
    let allCount = dataObj.allCount;

    let chartData = [];

    for (let keys in dataObj) {
        if (keys != 'allCount') {
            let obj = {};
            obj.name = getRefinedKeyNames(keys);
            obj.y = dataObj[keys];

            chartData.push(obj);
        }
    }

    Highcharts.chart(container, {
        chart: {
            type: 'pie'
        },
        title: {
            text: ''
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.1f} %',
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Enrolled Status',
            colorByPoint: true,
            data: chartData
        }]
    });

    // set the totalCount in the HeaderBar
    $('.enrolledValue').html(allCount);


    function getRefinedKeyNames(keyName) {
        let keysData = {
            "bpCount": "BaseLine Progress",
            "neverTestedCount": "Never Tested",
            "isCeblCount": "CEBL",
            "actPCount": "Active Patients",
        };

        return keysData[keyName];
    }
};


// function to render the Active patients charts
let renderActivePatientsChart = (dataObj) => {
    let container = "activePatientsChart";

    dataObj = JSON.parse(dataObj.d);

    let categories = [], chartData = [];
    let actCount = 0;

    for (let i = 0; i < dataObj.length; i++) {
        let currObj = dataObj[i];
        let currMonth = getMonthName(currObj.month).name;

        categories.push(currMonth);
        chartData.push({ name: currMonth, y: currObj.pCount });

        actCount += currObj.pCount;
    }

    // render chart
    Highcharts.chart(container, {
        chart: {
            type: 'line'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: '# of Patients'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                name: 'Active',
                data: chartData
            }
        ]

    });

    $('.activatedValue').html(actCount);
};

// function to render the Rx trend and activated chart
let renderRxTrendAndActivatedChart = (dataObj) => {

    let container = "rxTrendAndActivatedChart";

    dataObj = JSON.parse(dataObj.d);

    let categories = [], rxData = [], activeData = [];
    let rxtotal = 0;

    for (let i = 0; i < dataObj.length; i++) {
        let currObj = dataObj[i];
        let currMonth = getMonthName(currObj.Month).name;

        categories.push(currMonth);
        rxData.push({ name: currMonth, y: currObj.pCount});
        activeData.push({ name: currMonth, y: currObj.newAct });

        rxtotal += currObj.pCount;
    }

    // render chart
    Highcharts.chart(container, {
        chart: {
            type: 'line'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: '# of Patients'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                name: 'Rx',
                data: rxData
            },
            {
                name: 'Active',
                data: activeData
            }
        ]

    });

    $('.prescribedValue').html(rxtotal);
}


// function to get the MonthName From Month Id
let getMonthName = (monthId) => {
    let monthsArray = [
        { id: 1, name: 'Jan', fullName: 'January' },
        { id: 2, name: 'Feb', fullName: 'February' },
        { id: 3, name: 'Mar', fullName: 'March' },
        { id: 4, name: 'Apr', fullName: 'April' },
        { id: 5, name: 'May', fullName: 'May' },
        { id: 6, name: 'Jun', fullName: 'June' },
        { id: 7, name: 'July', fullName: 'July' },
        { id: 8, name: 'Aug', fullName: 'August' },
        { id: 9, name: 'Sep', fullName: 'September' },
        { id: 10, name: 'Oct', fullName: 'October' },
        { id: 11, name: 'Nov', fullName: 'November' },
        { id: 12, name: 'Dec', fullName: 'December' }
    ];

    return monthsArray[monthId - 1];
}

// function to toggle the loading for the dataloading of chart
let chartLoadComplete = (chartId) => {
    $('#' + chartId + '-Loading').hide();
    $('#' + chartId).show();
}