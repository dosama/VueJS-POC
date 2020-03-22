<template>
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                <h1>Directives Exercise</h1>
                <button v-myon:click="handleClickEvent">Click Me!</button>
                <!-- Exercise -->
                <!-- Build a Custom Directive which works like v-on (Listen for Events) -->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        directives:{
            'myon':{
                bind(el,bindings,vnode){
                    el.addEventListener(bindings.arg, bindings.value);
                }
            }
        },
        methods:{
            handleClickEvent(){
                alert("Cliecked !!!!")
            }
        }
    }
</script>

<style>
</style>
