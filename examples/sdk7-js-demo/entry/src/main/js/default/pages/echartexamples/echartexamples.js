import device from '@system.device';
import * as echarts from 'echarts';
import HmCanvas from 'openharmony-polyfill/src/CanvasPolyfill.js';
import barData from "./bar-data.js";
import { lineData1, lineData2, lineData3 } from "./line-data.js";
import candlestickData from "./candlestick-data.js"
import scatterData from './scatter-data.js';

export default {
    data: {
        divHeight: "100%",
        dpr: 1,
        examples: [
            {
                title: "折线图", isLoaded: false, initFun: "showLine"
            },
            {
                title: "折线图2", isLoaded: false, initFun: "showLine2"
            },
            {
                title: "柱状图", isLoaded: false, initFun: "showBar"
            },
            {
                title: "饼图", isLoaded: false, initFun: "showPie"
            },
            {
                title: "散点图", isLoaded: false, initFun: "showScatter"
            },
            {
                title: "K线图", isLoaded: false, initFun: "showCandlestick"
            },
            {
                title: "树图", isLoaded: false, initFun: "showTree"
            }
        ]
    },
    onInit() {
        device.getInfo({
            success: (info) => {
                this.dpr = info.screenDensity;
            }
        })
        this.divHeight = this.examples.length * 390 + "px";
    },
    showChart(e) {
        const btnNo = e.target.attr.no;
        const ex = this.examples[btnNo];
        ex.isLoaded = true;

        let node = e.target;
        node.id = node.id || `canvas_${btnNo}`;
        while (node.previousSibling) {
            node = node.previousSibling;
            if (node.type == 'canvas') {
                break;
            }
        }
        this[ex.initFun](node);
    },
    showLine(node) {
        console.log("----------------init line-----------------------------");
        const ctx = node.getContext('2d');
        const canvas = new HmCanvas(ctx, node.id, node);
        echarts.setCanvasCreator(() => {
            return canvas;
        });

        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Email',
                    type: 'line',
                    stack: 'Total',
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: 'Union Ads',
                    type: 'line',
                    stack: 'Total',
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: 'Video Ads',
                    type: 'line',
                    stack: 'Total',
                    data: [150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name: 'Direct',
                    type: 'line',
                    stack: 'Total',
                    data: [320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name: 'Search Engine',
                    type: 'line',
                    stack: 'Total',
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };

        var myChart = echarts.init(canvas);

        myChart.setOption(option);
    },
    showLine2(node) {
        console.log("----------------init line2-----------------------------");
        const ctx = node.getContext('2d');
        const canvas = new HmCanvas(ctx, node.id, node);
        echarts.setCanvasCreator(() => {
            return canvas;
        });

        const option = {
            grid: {
                bottom: 80
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                }
            },
            legend: {
                data: ['Flow', 'Rainfall'],
                left: 10
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 65,
                    end: 85
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 65,
                    end: 85
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        onZero: false
                    },
                    // prettier-ignore
                    data: lineData1.map(function (str) {
                        return str.replace(' ', '\n');
                    })
                }
            ],
            yAxis: [
                {
                    name: 'Flow(m^3/s)',
                    type: 'value'
                },
                {
                    name: 'Rainfall(mm)',
                    nameLocation: 'start',
                    alignTicks: true,
                    type: 'value',
                    inverse: true
                }
            ],
            series: [
                {
                    name: 'Flow',
                    type: 'line',
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        },
                        data: [
                            [
                                {
                                    xAxis: '2009/9/12\n7:00'
                                },
                                {
                                    xAxis: '2009/9/22\n7:00'
                                }
                            ]
                        ]
                    },
                    // prettier-ignore
                    data: lineData2
                },
                {
                    name: 'Rainfall',
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        },
                        data: [
                            [
                                {
                                    xAxis: '2009/9/10\n7:00'
                                },
                                {
                                    xAxis: '2009/9/20\n7:00'
                                }
                            ]
                        ]
                    },
                    // prettier-ignore
                    data: lineData3
                }
            ]
        };

        var myChart = echarts.init(canvas);

        myChart.setOption(option);
    },
    showBar(node) {
        console.log("----------------init Pie-----------------------------");

        const ctx = node.getContext('2d');
        const canvas = new HmCanvas(ctx, node.id, node);
        echarts.setCanvasCreator(() => {
            return canvas;
        });

        const obama_budget_2012 = barData;
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true
                    }
                }
            },
            calculable: true,
            legend: {
                data: ['Growth', 'Budget 2011', 'Budget 2012']
            },
            grid: {
                top: '12%',
                left: '1%',
                right: '10%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: obama_budget_2012.names
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: function (a) {
                            a = +a;
                            return isFinite(a) ? echarts.format.addCommas(+a / 1000) : '';
                        }
                    }
                }
            ],
            dataZoom: [
                {
                    show: false,
                    start: 94,
                    end: 100
                },
                {
                    type: 'inside',
                    start: 94,
                    end: 100
                },
                {
                    show: false,
                    yAxisIndex: 0,
                    filterMode: 'empty',
                    width: 30,
                    height: '80%',
                    showDataShadow: false,
                    left: '93%'
                }
            ],
            series: [
                {
                    name: 'Budget 2011',
                    type: 'bar',
                    data: obama_budget_2012.budget2011List
                },
                {
                    name: 'Budget 2012',
                    type: 'bar',
                    data: obama_budget_2012.budget2012List
                }
            ]
        };

        var myChart = echarts.init(canvas);

        myChart.setOption(option);

    },
    showPie(node) {
        console.log("----------------init Pie-----------------------------");

        const ctx = node.getContext('2d');
        const canvas = new HmCanvas(ctx, node.id, node);
        echarts.setCanvasCreator(() => {
            return canvas;
        });


        const option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {},
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {
                            value: 1048, name: 'Search Engine'
                        },
                        {
                            value: 735, name: 'Direct'
                        },
                        {
                            value: 580, name: 'Email'
                        },
                        {
                            value: 484, name: 'Union Ads'
                        },
                        {
                            value: 300, name: 'Video Ads'
                        }
                    ]
                }
            ]
        };

        var myChart = echarts.init(canvas);

        myChart.setOption(option);
    },
    showScatter(node) {
        console.log("----------------init Scatter-----------------------------");

        const ctx = node.getContext('2d');
        const canvas = new HmCanvas(ctx, node.id, node);
        echarts.setCanvasCreator(() => {
            return canvas;
        });

        const option = {
            xAxis: {
                scale: true
            },
            yAxis: {
                scale: true
            },
            series: [
                {
                    type: 'effectScatter',
                    symbolSize: 20,
                    data: [
                        [172.7, 105.2],
                        [153.4, 42]
                    ]
                },
                {
                    type: 'scatter',
                    // prettier-ignore
                    data: scatterData
                }
            ]
        };

        var myChart = echarts.init(canvas);

        myChart.setOption(option);

    },
    showCandlestick(node) {
        console.log("----------------init Candlestick-----------------------------");

        const ctx = node.getContext('2d');
        const canvas = new HmCanvas(ctx, node.id, node);
        echarts.setCanvasCreator(() => {
            return canvas;
        });

        const upColor = '#ec0000';
        const upBorderColor = '#8A0000';
        const downColor = '#00da3c';
        const downBorderColor = '#008F28';
        // Each item: open，close，lowest，highest
        const data0 = splitData(candlestickData);

        function splitData(rawData) {
            const categoryData = [];
            const values = [];
            for (var i = 0; i < rawData.length; i++) {
                categoryData.push(rawData[i].splice(0, 1)[0]);
                values.push(rawData[i]);
            }
            return {
                categoryData: categoryData,
                values: values
            };
        }

        function calculateMA(dayCount) {
            var result = [];
            for (var i = 0, len = data0.values.length; i < len; i++) {
                if (i < dayCount) {
                    result.push('-');
                    continue;
                }
                var sum = 0;
                for (var j = 0; j < dayCount; j++) {
                    sum += +data0.values[i - j][1];
                }
                result.push(sum / dayCount);
            }
            return result;
        }

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                data: data0.categoryData,
                boundaryGap: false,
                axisLine: {
                    onZero: false
                },
                splitLine: {
                    show: false
                },
                min: 'dataMin',
                max: 'dataMax'
            },
            yAxis: {
                scale: true,
                splitArea: {
                    show: true
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 50,
                    end: 100
                },
                {
                    show: true,
                    type: 'slider',
                    top: '90%',
                    start: 50,
                    end: 100
                }
            ],
            series: [
                {
                    name: '日K',
                    type: 'candlestick',
                    data: data0.values,
                    itemStyle: {
                        color: upColor,
                        color0: downColor,
                        borderColor: upBorderColor,
                        borderColor0: downBorderColor
                    },
                    markPoint: {
                        label: {
                            formatter: function (param) {
                                return param != null ? Math.round(param.value) + '' : '';
                            }
                        },
                        data: [
                            {
                                name: 'Mark',
                                coord: ['2013/5/31', 2300],
                                value: 2300,
                                itemStyle: {
                                    color: 'rgb(41,60,85)'
                                }
                            },
                            {
                                name: 'highest value',
                                type: 'max',
                                valueDim: 'highest'
                            },
                            {
                                name: 'lowest value',
                                type: 'min',
                                valueDim: 'lowest'
                            },
                            {
                                name: 'average value on close',
                                type: 'average',
                                valueDim: 'close'
                            }
                        ],
                        tooltip: {
                            formatter: function (param) {
                                return param.name + '<br>' + (param.data.coord || '');
                            }
                        }
                    },
                    markLine: {
                        symbol: ['none', 'none'],
                        data: [
                            [
                                {
                                    name: 'from lowest to highest',
                                    type: 'min',
                                    valueDim: 'lowest',
                                    symbol: 'circle',
                                    symbolSize: 10,
                                    label: {
                                        show: false
                                    },
                                    emphasis: {
                                        label: {
                                            show: false
                                        }
                                    }
                                },
                                {
                                    type: 'max',
                                    valueDim: 'highest',
                                    symbol: 'circle',
                                    symbolSize: 10,
                                    label: {
                                        show: false
                                    },
                                    emphasis: {
                                        label: {
                                            show: false
                                        }
                                    }
                                }
                            ],
                            {
                                name: 'min line on close',
                                type: 'min',
                                valueDim: 'close'
                            },
                            {
                                name: 'max line on close',
                                type: 'max',
                                valueDim: 'close'
                            }
                        ]
                    }
                },
                {
                    name: 'MA5',
                    type: 'line',
                    data: calculateMA(5),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                },
                {
                    name: 'MA10',
                    type: 'line',
                    data: calculateMA(10),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                },
                {
                    name: 'MA20',
                    type: 'line',
                    data: calculateMA(20),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                },
                {
                    name: 'MA30',
                    type: 'line',
                    data: calculateMA(30),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5
                    }
                }
            ]
        };

        var myChart = echarts.init(canvas);

        myChart.setOption(option);
    },
    showTree(node) {
        console.log("----------------init Tree-----------------------------");

        const ctx = node.getContext('2d');
        const canvas = new HmCanvas(ctx, node.id, node);
        echarts.setCanvasCreator(() => {
            return canvas;
        });

        var data = {
            name: 'flare',
            children: [
                {
                    name: 'flex',
                    children: [{
                        name: 'FlareVis', value: 4116
                    }]
                },
                {
                    name: 'scale',
                    children: [
                        {
                            name: 'IScaleMap', value: 2105
                        },
                        {
                            name: 'LinearScale', value: 1316
                        },
                        {
                            name: 'LogScale', value: 3151
                        },
                        {
                            name: 'OrdinalScale', value: 3770
                        },
                        {
                            name: 'QuantileScale', value: 2435
                        },
                        {
                            name: 'QuantitativeScale', value: 4839
                        },
                        {
                            name: 'RootScale', value: 1756
                        },
                        {
                            name: 'Scale', value: 4268
                        },
                        {
                            name: 'ScaleType', value: 1821
                        },
                        {
                            name: 'TimeScale', value: 5833
                        }
                    ]
                },
                {
                    name: 'display',
                    children: [{
                        name: 'DirtySprite', value: 8833
                    }]
                }
            ]
        };
        const option = {
            series: [
                {
                    type: 'tree',
                    name: 'tree2',
                    data: [data],
                    label: {
                        position: 'left',
                        verticalAlign: 'middle'
                    },
                    leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    },
                    expandAndCollapse: true,
                    emphasis: {
                        focus: 'descendant'
                    },
                    animationDuration: 550,
                    animationDurationUpdate: 750
                }
            ]
        };

        var myChart = echarts.init(canvas);

        myChart.setOption(option);
    }
}
