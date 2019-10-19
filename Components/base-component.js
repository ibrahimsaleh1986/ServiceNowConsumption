var BaseComponent = {
    data: function () {
        return {
            currentTab: 'create-ticket',
            tabs: ['create-ticket', 'tickets-list'],
            tabsTitles: ['تذكرة جديدة', 'قائمة التذاكر'],
        }
    },
    created: function () {

        this.setTabs();
    },
    methods: {
        setTabs: function () {
            if (!this.loggedinuser) {
                this.tabs = ['create-ticket', 'follow-up-ticket'];
                this.tabsTitles = ['تذكرة جديدة', 'متابعة تذكرة'];
            }
        }
    },
    computed: {
        currentTabComponent: function () {
            return "tab-" + this.currentTab.toLowerCase();
        },
    },
    props: { loggedinuser: Boolean },
    components: {
        'tab-create-ticket': CreateTicketComponent,
        'tab-tickets-list': TicketsListComponent,
        'tab-follow-up-ticket': FollowUpComponent
    },
    template: `<div><button v-for="(tab,index) in tabs" v-bind:key="tab" v-bind:class="['tab-button',{active:currentTab === tab}]" v-on:click="currentTab = tab">
        {{tabsTitles[index]}}
    </button>
    <transition name="fade">
        <!--@*<transition name="custom-classes-transition"
                      enter-active-class="animated tada"
                      leave-active-class="animated bounceOutRight">
            *@-->
        <keep-alive>
            <component v-bind:is="currentTabComponent" v-bind:loggedinuser="loggedinuser" class="tab"></component>
        </keep-alive>
    </transition></div>`
}