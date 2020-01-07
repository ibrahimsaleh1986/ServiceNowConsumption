var ViewTicketComponent = {
    data:function(){
        return {
            ticketObj:{},
            ticketComment:'',
        }
    },
    props:{customdata:Object},
    created(){
        debugger
        this.getTicket(this.customdata.ticketNumber);
    },
    methods:{
        getTicket:function(ticketNo){
            debugger
            var self = this;
            $.ajax({
                url:'https://ssupport.tetco.sa/api/sn_customerservice/csmtetcoapi/massar/case_id/'+ticketNo,
                headers: {
                    'Authorization': 'Basic ' + btoa(self.customdata.serviceusername + ':' + self.customdata.servicepassword),
                },
                success: function (response) {    
                    debugger
                    if(response.result.Status.toLowerCase() == "failure")    
                    {      
                        self.$emit('showResult',{'status':'failure', 'message':'.حدث خطأ أثناء استرجاع تذكرة الدعم'});   
                    }
                     else{
                         debugger
                         self.ticketObj = response.result.Response;
                         self.ticketObj.StateColor = self.getStateColor(self.ticketObj.State_Id);
                         self.ticketObj.StateAr = self.getArabicState(self.ticketObj.State_Id);
                     }

                },
                error: function (err) {
                    debugger
                    self.$emit('showResult',{'status':'failure', 'message':'.حدث خطأ أثناء استرجاع تذكرة الدعم'});   
                }

            })
        
        },
        addComment:function(){
            debugger
            var self = this;
            // $('#addComment_errors').parent().slideUp();
                if (self.ticketComment.trim() == '') {
                    self.$emit('showResult',{'status':'failure', 'message':'.فضلاً أدخل البيانات المطلوبة'});   
                    return;
                }
                var commentObj = {};
                commentObj.comments = self.ticketComment;
                var commentObjJson = JSON.stringify(commentObj);
            $.ajax({
                type: 'POST',
                url: 'https://ssupport.tetco.sa/api/sn_customerservice/csmtetcoapi/sn_customerservice_case/'+self.ticketObj.Sys_Id,                
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Basic ' + btoa(self.customdata.serviceusername + ':' + self.customdata.servicepassword),
                },
                data: commentObjJson,
                success: function (response) {
                    if (response.result.Status.toLowerCase() == "failure") {      
                        self.$emit('showResult',{'status':'failure', 'message':'.حدث خطأ أثناء إضافة التعليق ، يرجى المحاولة مرة أخرى'}); 
                    }
                    else {
                        self.$emit('showResult',{'status':'success', 'message':self.ticketObj.Number+' تم إضافة التعليق بنجاح للطلب رقم'}); 
                    }
                },
                error: function () {
                    self.$emit('showResult',{'status':'failure', 'message':'.حدث خطأ أثناء إضافة التعليق ، يرجى المحاولة مرة أخرى'}); 
                }
            });
        },
        closeTicket:function(){
            var self = this;
            self.$emit('closeTicket');
        },
        getArabicState:function(stateId){
            if(stateId == 1) return 'جديد';
            if(stateId == 2) return 'جاري العمل';
            if(stateId == 3) return 'مغلق';
            if(stateId == 13) return 'قيد الانتظار';
            if(stateId == 6) return 'تم الحل';
            else
                return 'جديد';
        },
        getStateColor:function(stateId){
            if(stateId == 1) return "#BDC3C7";
            if(stateId == 2) return "#F39C12";
            if(stateId == 3) return "#34495E";
            if(stateId == 13) return "#C0392B";
            if(stateId == 6) return "#27AE60";
            else
            return "#BDC3C7";
        },
    },
    template:`
    <div id="div_ticket_Show">
    <input type="text" class="form-control" :value="ticketObj.Sys_id" hidden="hidden">
    <div class="col-12 row m-0">
        <div class="form-group col-md-4">
            <label class="form-control-label" for="">رقم البلاغ:</label>&nbsp;
            <label>{{ticketObj.Number}}</label>
        </div>
        <div class="form-group col-md-4">
            <label class="form-control-label" for="">حالة البلاغ:</label>&nbsp;
            <label :style="{'background-color':ticketObj.StateColor}">{{ticketObj.StateAr}}</label>
        </div>
        <div class="form-group col-md-4">
            <label class="form-control-label" for="">تاريخه:</label>&nbsp;
            <label>{{ticketObj.Created_On}}</label>
        </div>
    </div>
    <div class="col-12">
        <div class="form-group col-md-6">
            <label class="form-control-label" for="inputBasicFirstName">اسم الخدمة</label>
            <input type="text" class="form-control" :value="customdata.sourceAr" disabled>
        </div>
    </div>
    <div class="col-12">
        <div class="form-group col-md-6">
            <label class="form-control-label" for="inputBasicFirstName">تصنيف البلاغ</label>
            <input type="text" class="form-control" :value="ticketObj.Category" disabled>
        </div>
        <div class="form-group col-md-6">
            <label class="form-control-label" for="inputBasicFirstName">تصنيف البلاغ الفرعي</label>
            <input type="text" class="form-control" :value="ticketObj.Subcategory" disabled>
        </div>
    </div>
    <div class="col-12">
        <div class="form-group col-md-12">
            <label class="form-control-label" for="">العنوان</label>
            <input type="text" class="form-control" :value="ticketObj.Short_Description" disabled>
        </div>
    </div>
    <div class="col-12">
        <div class="form-group col-md-12">
            <label class="form-control-label" for="">الوصف</label>
            <textarea type="text" class="form-control" disabled>{{ticketObj.Description}}</textarea>
        </div>
    </div>
    <div class="col-12 row m-0">
        <div class="form-group col-md-6">
            <label class="form-control-label" for="">تم بواسطة:</label>
            <label id="createdBy">{{ticketObj.Customer_Name}}</label>
        </div>
        <div class="form-group col-md-6">
            <label class="form-control-label" for="">بتاريخ:</label>
            <label id="createdDate">{{ticketObj.Created_On}}</label>
        </div>
    </div> 
    <div class="col-12">
        <div class="form-group col-md-12">
            <label class="form-control-label" for="">اكتب رد</label>
            <textarea type="text" class="form-control" v-model="ticketComment"></textarea>
        </div>
    </div>

    <div class="col-12 row m-0" >
        <div class="col-4 text-center">          
        </div>
        <div class="col-4 text-center">
            <button type="button" class="btn btn-outline-success my-3 px-5" v-on:click="addComment">ارسال</button>
            <button type="button" class="btn btn-outline-success my-3 px-5" v-on:click="closeTicket">الغاء</button>
        </div>
    </div>
</div>
    `
}
