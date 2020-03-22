<template>
    <div class="container">
        <form>
            <div class="row" v-if="!submitted">
                <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 form-group">

                    <!-- Exercise 1 -->
                    <!-- Create a Signup Form where you retrieve the following Information -->
                    <!-- Full Name (First Name + Last Name) -->
                    <!-- Mail -->
                    <!-- Password -->
                    <!-- Store Data? Yes/No -->

    <!-- <label for="firstName">First Name</label>
    <input id="firstName" type="text" v-model="firstName"  class="form-control">
    <label for="lastName">Last Name</label>
    <input id="lastName" type="text" v-model="lastName" class="form-control">  -->

                   <app-full-name v-model="userData.fullName"></app-full-name>
                    <label for="email">Email address</label>
                    <input id="email" type="email" v-model="userData.email" class="form-control">
                    <label for="password">Password</label>
                    <input id="password" type="password" v-model="userData.password" class="form-control">       
                     <label for="storeData">Store Data</label>
                    <input id="storeData" type="checkbox" v-model="storeData">

                    <!-- Exercise 2 -->
                    <!-- Only display the Form if it has NOT been submitted -->
                    <!-- Display the Data Summary ONCE the Form HAS been submitted -->
                 
                    <button class="form-control btn-primary" @click.prevent="submit()">Submit</button>
              

                    <!-- Exercise 3 -->
                    <!-- Edit the Example from above and create a custom "Full Name" Control -->
                    <!-- which still holds the First Name and Last Name Input Field -->
                </div>
                        
                                 
                                
         
                 

            </div>
        </form>
        <hr>
        <div class="row" v-if="submitted" >
            <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4>Your Data</h4>
                    </div>
                    <div class="panel-body">
                        <p>Full Name: {{userData.fullName}}</p>
                        <p>Mail: {{userData.email}} </p>
                        <p>Password: {{userData.password}}</p>
                        <p>Store in Database?: {{storeData}} </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import fullNameComponent  from "./FullName.vue";
    export default {
     components:{
                 appFullName:fullNameComponent
                 },
        data:function(){
        return {
                userData:{
                    // firstName:'',
                    // lastName:'',
                    fullName:'',
                    email:'',
                    password:''
                },
                storeData:false,
                submitted:false
            }
         },
         methods:{
             submit(){
                 this.submitted = true;
                 }
             }
            
    }
</script>

<style>
</style>
