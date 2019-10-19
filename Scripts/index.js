
var router = new VueRouter({
    mode: 'history',
    routes: []
});
var app = new Vue({
    router,
    el: '#contactUsApp',
    data: {
        loggedinuser:false,

    },
    created: function () {

    },
    mounted: function () {

    },
    methods: {
      
    },
    computed: {

      
    },
    components: {
        'base_component': BaseComponent,
    }
})

        //Vue.component('ticket-Create', {
        //    data: function () {
        //        return {

        //        }
        //    },
        //    template: ''
        //})
