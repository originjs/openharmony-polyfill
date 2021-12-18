import 'openharmony-polyfill'
import axios from 'axios'

export default {
    data: {
        result: ""
    },
    onClickAxios() {
        this.result = 'request...'
        axios.get('https://developer.harmonyos.com/cn/develop/')
            .then((res) => {
                console.log('---------')
                console.log(res.data)
                this.result = res.statusText
            }).catch(error => {
            this.result = error
        });
    },

    onClickFetch() {
        this.response = 'request...'
        console.log('---------')
        fetch('https://developer.harmonyos.com/cn/develop/')
            .then(res => {
                console.log('-----------')
                console.log(res.data)
                this.response = res.statusText;
            });
    }
}
