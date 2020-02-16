<template>
    <div class="col-xs-12 col-sm-6">
       <p v-if="serverName">Server Details for server {{serverName}} are updated</p>
       <p v-else>Server Details are currently not updated</p>
    </div>

</template>

<script>
	export default{
   
         props: {
    serverName: String
  }
  }
</script>

<style>

</style>
