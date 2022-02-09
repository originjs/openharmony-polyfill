import router from '@system.router';


export default {
    data: {
        title: ""
    },
    onInit() {
    },
    gotoEchartExamples() {
        router.push ({
          uri: 'pages/echartexamples/echartexamples',
        });
    }
}
