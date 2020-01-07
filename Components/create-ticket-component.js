var CreateTicketComponent = {
    data: function () {
        return {
            source : 'massar',
            fullName: '',
            identityNumber: '',
            mobileNumber: '',
            eMail: '',
            categoryId: null,
            subCategoryId: null,
            shortDescription: '',
            description: '',
            attachment: '',
            image: '/Content/img/male.jpeg',
            binaryFile:[],
            categories: [
            ],
            subCategories: [             
            ],
            username : 'rest_user_tetco',
            password : '123',
        }
    },
    props: { customdata: Object },
    created() {
        this.getCategories();
    },
    methods: {
        prepareTicketObject: function(){
            var self = this;
            var ticketObject = {};
            ticketObject.u_source = self.source;
            ticketObject.category = self.categoryId;
            ticketObject.subcategory = self.subCategoryId;
            ticketObject.u_customer_name = self.fullName;
            ticketObject.short_description = self.shortDescription;
            ticketObject.u_customer_email = self.eMail;
            ticketObject.u_id = self.identityNumber;
            ticketObject.u_mobile = '+'+self.mobileNumber;
            ticketObject.description = self.description;

            return ticketObject;
        },
        createTicket: function () {
            var self = this;            
            var ticketObject = self.prepareTicketObject();
            var ticketObjectJson = JSON.stringify(ticketObject);
                $.ajax({
                    url: 'https://ssupport.tetco.sa/api/sn_customerservice/csmtetcoapi/sn_customerservice_case',
                    data: ticketObjectJson ,
                    type:'POST',
                    dataType: 'json',
                    crossDomain: true,
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Authorization': 'Basic ' + btoa(self.customdata.serviceusername + ':' + self.customdata.servicepassword),
                        'Access-Control-Allow-Credentials':'true'
                    },
                    success: function (response) {   
                        debugger
                        self.uploadFile2('33922a2faf8504507f4542b2a827492f'); 
                        // if(response.result.Status.toLowerCase() == "failure")
                        // {
                        //      self.$emit('showResult',{'status':'failure', 'message':'.حدث خطأ أثناء إنشاء التذكرة ، يرجى المحاولة مرة أخرى'})                           
                        // }   
                        // else
                        // {
                        //     debugger
                        //     self.uploadFile(response.result.Response.sys_id); 
                        //      self.$emit('showResult',{'status':'success', 'message': 'تم إنشاء تذكرة دعم فني بنجاح ورقمها هو'+response.result.Response.Number})                                                   
                        // }              
                        
                    },
                    error: function (err) {    
                        debugger 
                        self.uploadFile('33922a2faf8504507f4542b2a827492f');                   
                        // self.$emit('showResult',{'status':'failure', 'message':'.حدث خطأ أثناء إنشاء التذكرة ، يرجى المحاولة مرة أخرى'})                           
                    }
                });
        },
        uploadFile2:function(){
            var formData = new FormData();
            formData.append('table_name', 'sn_customerservice_case');
            formData.append('table_sys_id', '33922a2faf8504507f4542b2a827492f');
            var fileInput = $('#attachment');
            if (fileInput[0].files[0] != null) {
                debugger
                formData.append('file', fileInput[0].files[0]);                     
            }
            var xhr = new XMLHttpRequest();
            var uri = 'https://ssupport.tetco.sa/api/now/attachment/upload';
            xhr.open('POST', uri, true);
            xhr.setRequestHeader("Authorization", "Basic " + btoa('rest_user_tetco:123'));
            xhr.setRequestHeader("Content-Type", 'multipart/form-data');
            xhr.setRequestHeader("Accept", 'application/json');
            // Fire!
            xhr.send(formData);
        },
        uploadFile:function(sysId){
            var self = this;
            var formData = new FormData();
            formData.append('table_name', 'sn_customerservice_case');
            formData.append('table_sys_id', sysId);
            formData.append('file', '');
            var fileInput = $('#attachment');
            if (fileInput[0].files[0] != null) {
                formData.append(fileInput[0].files[0].name, fileInput[0].files[0]);           
            }

            $.ajax({
                url: 'https://ssupport.tetco.sa/api/now/attachment/upload',                
                type:'POST',
                dataType: 'json',
                processData: false,
                data: formData,              
                contentType: 'multipart/form-data', 
                headers: {
                    'Authorization': 'Basic ' + btoa(self.username + ':' + self.password),  
                    'Content-Type' : 'multipart/form-data'              
                },
                success: function (response) {   
                    debugger
                    alert(response.result.Status);
                },
                error: function(err){
                    debugger
                    alert(err);
                }
            });
            debugger
        },
        getCategories: function () {
            var self = this;            

                $.ajax({
                    url: 'https://ssupport.tetco.sa/api/sn_customerservice/csmtetcoapi/category/massar',               
                    headers: {
                        'Authorization': 'Basic ' + btoa(self.customdata.serviceusername + ':' + self.customdata.servicepassword),                       
                    },
                    success: function (response) {                        
                        self.categories = response.result.Response;
                        self.categories.unshift({ Label: '------اختر------', Value: null });
                    },
                    error: function (err) {
                    }
                });
        },
        getSubCategories: function () {
            var self = this;            
            
                $.ajax({
                    url: 'https://ssupport.tetco.sa/api/sn_customerservice/csmtetcoapi/subcategory/massar/'+self.categoryId,                
                    headers: {
                        'Authorization': 'Basic ' + btoa(self.customdata.serviceusername + ':' + self.customdata.servicepassword),
                    },
                    success: function (response) {                        
                        self.subCategories = response.result.Response;
                        self.subCategories.unshift({ Label: '------اختر------', Value: null });
                    },
                    error: function (err) {
                    }
                });
        },
        previewFile: function (e) {
            var self = this;
            self.attachment = e.target.files[0];
            var reader = new FileReader();
            reader.onload = (e) => {
                self.image = e.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
            
            var binaryReader = new FileReader();
            binaryReader.onload = (e) => {
                
                var arrayBuffer = e.target.result;
                var array = new Uint8Array(arrayBuffer);
                self.binaryFile =  String.fromCharCode.apply(null, array);                
            }
            binaryReader.readAsArrayBuffer(e.target.files[0]);
        }
    },
    template: `<div id="div_ticket">
    <div v-if="!customdata.loggedinuser" class="col-12 row m-0">
        <div class="form-group col-md-6">
            <label class="form-control-label" for="">الاســم</label>
            <input id="fullName" type="text" placeholder="الاســم" class="form-control" v-model="fullName" />
        </div>
        <div class="form-group col-md-6">
            <label class="form-control-label" for="">رقم الهوية</label>
            <input id="identityNumber" type="text" placeholder="رقم الهوية" class="form-control" maxlength="10" v-model.number="identityNumber" />
        </div>
    </div>
    <div v-if="!customdata.loggedinuser" class="col-12 row m-0">
        <div class="form-group col-md-6">
            <label class="form-control-label" for="">رقم الجوال</label>
            <input id="mobileNumber" type="text" placeholder="966xxxxxxxxx" class="form-control" maxlength="12" v-model="mobileNumber" />
        </div>
        <div class="form-group col-md-6">
            <label class="form-control-label" for="">البريد الألكتروني</label>
            <input id="eMail" type="text" placeholder="البريد الألكتروني" class="form-control" v-model="eMail" />
        </div>
    </div>
    <div class="col-12 row m-0">
        <div class="form-group col-md-6">
            <label class="form-control-label" for="">تصنيف البلاغ</label>
            <select id="categoryId" class="form-control" v-model="categoryId" v-on:change="getSubCategories">
                <option v-for="item in categories" v-bind:value="item.Value">
                    {{item.Label}}
                </option>
            </select>
        </div>
        <div class="form-group col-md-6">
            <label class="form-control-label" for="">تصنيف البلاغ الفرعي</label>
            <select id="subCategoryId" class="form-control" v-model="subCategoryId">
                <option v-for="item in subCategories" v-bind:value="item.Value">
                    {{item.Label}}
                </option>
            </select>
        </div>
        <div class="col-12">
            <div class="form-group col-md-12">
                <label class="form-control-label" for="">العنوان</label>
                <input id="shortDescription" type="text" placeholder="العنوان" class="form-control" maxlength="70" v-model="shortDescription" />
            </div>
        </div>
        <div class="col-12">
            <div class="form-group col-md-12">
                <label class="form-control-label" for="">الوصف</label>
                <textarea id="description" placeholder="الوصف" class="form-control" v-model="description"></textarea>
            </div>
        </div>
        <div class="col-12">
            <div class="form-group col-md-12">
                <input type="file" accept=".jpg,.jpeg,.gif,.png" id="attachment" name="attachment" v-on:change="previewFile($event)" />
                <img id="userImageEdit" :src="image" width="50" height="50" />
            </div>
        </div>
        <div class="col-12">
            <div class="col-12 text-center">
                <button type="button" id="btn_CreateTicket" v-on:click="uploadFile2" class="btn btn-outline-success my-3 px-5">ارسال </button>
            </div>
        </div>
    </div>
</div>`
}