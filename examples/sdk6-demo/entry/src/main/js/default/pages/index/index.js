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

    onClickXhr() {
        this.result = 'request...'
        const xhr = new XMLHttpRequest()
        xhr.addEventListener('loadend',()=>{
            this.result = xhr.statusText
            let head =xhr.getResponseHeader('content-type')
            console.warn(head)
        })
        xhr.open('GET','https://www.baidu.com/')
        xhr.send()
    },

    onClickFetch() {
        this.response = 'request...'
        console.log('----------')
        fetch('https://developer.harmonyos.com/cn/develop/')
            .then(res => {
                console.log('-----------')
                console.log(res.data)
                this.response = res.statusText;
            });
    }
}
