var UserTicketsComponent = {
    data : function(){
        return{
            userTickets:[],
            orderType:'asc',
            ticketNumber:null,
            fromDate:null,
            toDate:null,

        }
    },
    props:{customdata:Object},
    created(){
        this.getUserTickets();
    },
    methods:{
        getUserTickets: function()
        {
            var self = this;
            debugger
            // $('#ticketSearch_errors').parent().slideUp();
            debugger
            var source = self.customdata.source; 
            var identityNumber = self.customdata.identityno;
            var ticketNumber = self.ticketNumber;
            var fromDate = self.fromDate;
            var toDate = self.toDate;
            var orderType = self.orderType;
            var data = JSON.stringify({
                'source': source,
                'identityNumber': identityNumber,
                'ticketNumber': ticketNumber,
                'fromDate': fromDate,
                'toDate': toDate,
                'orderType': orderType
            });
            $.ajax({
                url: 'https://ssupport.tetco.sa/api/sn_customerservice/csmtetcoapi/'+self.customdata.source+'/'+self.customdata.identityno,
                headers: {
                    'Authorization': 'Basic ' + btoa(self.customdata.serviceusername + ':' + self.customdata.servicepassword),
                },
                success: function (response) {    
                    if(response.result.Status.toLowerCase() == "failure")    
                    {      
                        self.$emit('showResult',{'status':'failure', 'message':'.حدث خطأ أثناء استرجاع تذاكر الدعم الخاصة بك'});
                    }
                     else{
                         self.userTickets = response.result.Response;
                     }

                },
                error: function (err) {
                    self.$emit('showResult',{'status':'failure', 'message':'.حدث خطأ أثناء استرجاع تذاكر الدعم الخاصة بك'});
                }

            })    
            if (self.orderType != '') {
                self.ToggleOrderFields();
            }
        },
        ToggleOrderFields: function() {
            var self =this;
            if (self.orderType == 'asc') {
                // $("#orderLink").html('ترتيب - الأحدث <i class="fa fa-arrow-up"></i>');// to be bound
                self.orderType = 'desc';
            }
            else {
                // $("#orderLink").html('ترتيب - الأقدم <i class="fa fa-arrow-down"></i>');// to be bound
                self.orderType = 'asc';
            }
        },
        getTicket: function(ticketNo){
            debugger
            var self =this;
            self.$emit('showTicket',{'ticketNo':ticketNo,'referer':'usertickets'});
        },
    },
    template:`
    <div>
    <ul class="list-group list-group-flush px-4 pb-4 pt-2">
 
    <li class="list-group-item new-ticket" v-for="ticket in userTickets">
        <div class="col-12 row m-0 p-0 hero-ticket">
            <div class="col-12 col-md-4 col-lg-2 p-0">
                <label class="p-1 ticket-no">{{ticket.Number}}</label>
                <div class="tag-block px-2 status" v-bind:style="{'background-color':ticket.StateColor}">{{ticket.State}}</div>
            </div>
            <div class="col-12 col-md-8 col-lg-10 d-flex align-items-center">
                <h5 class="title">
                  {{ticket.Short_Description}}
                </h5>
            </div>
        </div>
        <hr class="col-12 p-0 m-0" />
        <div class="col-12 row m-0 p-0 bottom-ticket">         
            <div class="col-12 col-sm-4 col-md-3 col-lg-2">
               بواسطة
                <label>{{ticket.Customer_Name}}</label>
            </div>
            <div class="col-12 col-sm-4 col-md-3 col-lg-2">
                <span>تاريخ</span>
                <label>{{ticket.Created_On}}</label>
            </div>
            <div class="col-12 col-sm-4 col-md-3 col-lg-2">
                <label>اخر تحديث</label>
                <label>{{ticket.Last_Updated}}</label>
            </div>
            <div class="col-12 col-sm-4 col-md-3 col-lg-2">
                <span></span>
                <a class="mx-auto btn btn-sm btn-success" v-on:click="getTicket(ticket.Number)" >التفاصيل</a>          
            </div>
        </div>
    </li>

</ul>
</div>
    `
}



