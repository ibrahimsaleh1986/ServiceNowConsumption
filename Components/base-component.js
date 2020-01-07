var BaseComponent = {
    data: function () {
        return {
            currentTab: 'create-ticket',
            tabs: ['create-ticket', 'user-tickets'],
            tabsTitles: ['تذكرة جديدة', 'قائمة التذاكر'],
            displayError:'none',
            errorMessage:'',
            successMessage:'',
            errorStyle: {
                display: 'none'
              },
              successStyle:{
                  display: 'none'
              },
            ticketNumber:'',
        }
    },
    created: function () {

        this.setTabs();
    },
    methods: {
        setTabs: function () {
            if (this.customdata.loggedinuser) {
                this.tabs = ['create-ticket', 'user-tickets'];
                this.tabsTitles = ['تذكرة جديدة', 'قائمة التذاكر'];
            }
            else{
                this.tabs = ['create-ticket', 'follow-up-ticket'];
                this.tabsTitles = ['تذكرة جديدة', 'متابعة تذكرة'];                
            }
        },
        showResult:function(args){
            if(args.status == 'failure')
                this.showError(args);
            else
                this.showSuccess(args);       
        },
        showError:function(args){
            this.successStyle= {display: 'none'};
            this.errorStyle = {};
            this.errorMessage = args.message;
        },
        showSuccess:function(args){
            this.errorStyle= {display: 'none'};
            this.successStyle = {};
            this.successMessage = args.message;
        },
        closeErrorMessage:function(){
            this.errorStyle= {display: 'none'};
        },
        closeSuccessMessage:function(){
            this.successStyle= {display: 'none'};
        },
        //
        showTicket:function(args){
            debugger
            this.customdata.ticketNumber = args.ticketNo;
            this.customdata.referer = args.referer;
            this.currentTab = 'view-ticket';
        },
        closeTicket:function(){
            if(this.customdata.referer == 'usertickets')
                this.currentTab = 'user-tickets';
            else
                this.currentTab = 'follow-up-ticket';
        }

    },
    computed: {
        currentTabComponent: function () {
            return "tab-" + this.currentTab.toLowerCase();
        },
    },
    props: { customdata: Object },
    components: {
        'tab-create-ticket': CreateTicketComponent,
        'tab-user-tickets': UserTicketsComponent,
        'tab-follow-up-ticket': FollowUpComponent,
        'tab-view-ticket': ViewTicketComponent
    },
    template: `<div><button v-for="(tab,index) in tabs" v-bind:key="tab" v-bind:class="['tab-button',{active:currentTab === tab}]" v-on:click="currentTab = tab">
        {{tabsTitles[index]}}
    </button>
    <div class="alert alert-danger" role="alert" v-bind:style="errorStyle">
    <button type="button" class="close" v-on:click="closeErrorMessage" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
    </button>
    <div id="ticket_errors">{{errorMessage}}</div>
</div>
<div class="alert alert-success" role="alert" v-bind:style="successStyle">
    <button type="button" class="close" v-on:click="closeSuccessMessage" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
    </button>
    <div id="ticket_success">
        {{successMessage}}
    </div>
</div>
    <transition name="fade">   
        <!--@*<transition name="custom-classes-transition"
                      enter-active-class="animated tada"
                      leave-active-class="animated bounceOutRight">
            *@-->
        <keep-alive>
            <component v-on:showResult="showResult" v-on:showTicket="showTicket" v-on:closeTicket="closeTicket" v-bind:is="currentTabComponent" v-bind:customdata="customdata" class="tab"></component>
        </keep-alive>
    </transition></div>`
}