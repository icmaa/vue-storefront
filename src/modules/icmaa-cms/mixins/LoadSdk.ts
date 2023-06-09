import Vue from 'vue'

export default Vue.extend({
  methods: {
    loadSdkScript (src: string, windowKey: string) {
      return new Promise<void>(resolve => {
        if ((window as any)[windowKey]) return resolve()
        const script = document.createElement('script')
        script.async = true
        script.src = src
        script.onload = () => { resolve() }
        document.body.appendChild(script)
      })
    }
  }
})
