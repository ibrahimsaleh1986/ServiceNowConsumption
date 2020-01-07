var FollowUpComponent = {
    data:function(){
        return{
                ticketNumber:'',

        }
    },
    methods:{
        findTicket: function(){
            var self = this;
            self.$emit('showTicket',{'ticketNo':self.ticketNumber,'referer':'followup'});
        },
    },
    template: `<div class="container pb-5">
    <div class="d-flex align-items-center justify-content-center">
        <div class="login-wrapper wd-300 wd-xs-350 pd-20 pd-xs-40 bg-white rounded shadow-base">
            <div class="form-horizontal">
                <div class="signin-logo tx-center tx-28 tx-bold tx-inverse mb-4">
                    <h4 class="default-color">
                        استعلام عن تذكرة
                    </h4>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="رقم البلاغ" v-model="ticketNumber">
                </div>

               <!-- <div id="followUp_Recaptcha">
                    @Html.Recaptcha(theme: Recaptcha.Web.RecaptchaTheme.Clean, language: "ar")
                </div>-->
                <div class="form-group text-center">
                    <button class="btn btn-sm btn-oblong btn-success float-l m-t-10" v-on:click="findTicket">
                        استعلام<i class="fa fa-chevron-left mg-r-10"></i>
                    </button>

                </div>

            </div> 
        </div>
    </div>

</div>`
}