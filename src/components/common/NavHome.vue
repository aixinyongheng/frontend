<template>
    <div class="wrapper">

    </div>
</template>

<script>
  
    import bus from './bus';
    export default {
        data(){
            return {
                tagsList: [],
                collapse: true
            }
        },
       
        // created(){
        //     bus.$on('collapse', msg => {
        //         this.collapse = msg;
        //     })
        // }
    }
</script>
