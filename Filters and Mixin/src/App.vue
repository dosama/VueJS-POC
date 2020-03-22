<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <h1>Filters</h1>
       
        <!-- Exercise 1) -->
        <!-- Build a local Filter which reverses the Text it is applied on -->
         <div>{{text | reverse}}</div>
        
        <!-- Exercise 2 -->
        <!-- Build a global Filter which counts the length of a word and it appends it -->
        <!-- Like this: "Test" => Gets Filtered to => "Test (4)" -->
        <div>{{text | show-counts}}</div>
        <!-- Exercise 3 -->
        <!-- Do the same as in Exercises 1 & 2, now with Computed Properties -->
             <h1>Computed Properties</h1>
       <div>{{this.reversedText}}</div>
   
        <!-- Exercise 4 -->
        <!-- Share the Computed Property rebuilding Exercise 2 via a Mixin -->
            
      <div>{{this.countedText}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
 data: function(){
        return{
            text:"Hello"
        }

     },
  filters: {
    reverse(value) {
      
    let splitString = value.split("");
      let reverseArray = splitString.reverse();
      let joinArray = reverseArray.join("");
      return joinArray; 
       
     }
  },
  methods:{
     reverseText(value) {
      let splitString = value.split("");
      let reverseArray = splitString.reverse();
      let joinArray = reverseArray.join("");
      return joinArray; 
     }
  },
  computed:{
      reversedText:function(){
    return this.reverseText(this.text);
      }
  }
};
</script>

<style></style>
