<template>
<div >
    <label for="firstName">First Name</label>
    <input id="firstName" type="text" v-model="firstName" @input="updateFullName()" class="form-control">
    <label for="lastName">Last Name</label>
    <input id="lastName" type="text" v-model="lastName" @input="updateFullName()" class="form-control"> 
</div>
</template>
<script>
export default {
    props:['value'],
    data: function(){
        return{
            firstName:'',
            lastName:''
            }
        },
    methods:{
    updateFullName(){
    
    const fullName = `${this.firstName} ${this.lastName}`;
    console.log(fullName);
    this.$emit('input',fullName);
    }
  }
}
</script>