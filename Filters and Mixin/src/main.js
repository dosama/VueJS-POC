import Vue from 'vue'
import App from './App.vue'

Vue.filter('to-lowercase', function(value) {
    return value.toLowerCase();
});

Vue.filter('show-counts', function(value) {
    let splitString = value.split("");
      
      return `${value} (${splitString.length})` ; 
});

Vue.mixin({
    created() {
        console.log('Global Mixin - Created Hook');
    },
    data: function(){
        return{
            text:"Hello World"
        }

     },
  computed:{
      countedText: function(){
          let splitString = this.text.split("");
      return `${this.text} (${splitString.length})` ; 
      }
  }
});

new Vue({
  el: '#app',
  render: h => h(App)
})
