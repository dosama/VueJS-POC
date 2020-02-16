<template>
    <div class="col-xs-12 col-sm-6" 
                   >
        <ul class="list-group">
            <li 
                    class="list-group-item"
                    v-for="value in servers"  @click="serverItemClick(value)">  
                Server # {{ value.name }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
   data:function(){
        return {
            servers:[{id:"0", name:"Server 0"},
            {id:"1", name:"Server 1"},
            {id:"2", name:"Server 2"},
            {id:"03", name:"Server 3"}]
        }
    },
    methods:{
        serverItemClick:function(value){
             this.$emit('update-server', value)
        }
    }
}
</script>

<style>

</style>
