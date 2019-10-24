var CreateTicketComponent = {
    data: function () {
        return {
            fullName: '',
            identityNumber: '',
            mobileNumber: '',
            eMail: '',
            categoryId: null,
            subCategoryId: 2,
            shortDescription: '',
            description: '',
            attachment: '',
            image: '/Content/img/male.jpeg',
            categories: [
            ],
            subCategories: [
                {
                    Value: '1',
                    Label: 'التسجيل1'
                },
                {
                    Value: '2',
                    Label: 'التسجيل2'
                }
            ]
        }
    },
    props: { loggedinuser: Boolean },
    created() {

        this.getLookUps();

    },
    methods: {
        getLookUps: function () {
            var self = this;
            var username = 'rest_user_tetco';
            var password = '123';

            type: 'GET',
                $.ajax({
                    url: 'https://ssupport.tetco.sa/api/sn_customerservice/csmtetcoapi/category/massar',
                    data: { source: 'massar' },
                    dataType: 'json',
                    crossDomain: true,
                    headers: {
                        'Authorization': 'Basic ' + btoa(username + ':' + password),
                        'Access-Control-Allow-Credentials':'true'
                    },
                    success: function (response) {
                        debugger
                        self.categories = response;
                        self.categories.unshift({ Label: '------اختر------', Value: null });
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
        }
    },
    template: `<div id="div_ticket">
    <div v-if="!loggedinuser" class="col-12 row m-0">
        <div class="form-group col-md-6">
            <label class="form-control-label" for="">الاســم</label>
            <input id="fullName" type="text" placeholder="الاســم" class="form-control" v-model="fullName" />
        </div>
        <div class="form-group col-md-6">
            <label class="form-control-label" for="">رقم الهوية</label>
            <input id="identityNumber" type="text" placeholder="رقم الهوية" class="form-control" maxlength="10" v-model="identityNumber" />
        </div>
    </div>
    <div v-if="!loggedinuser" class="col-12 row m-0">
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
            <select id="categoryId" class="form-control" v-model="categoryId">
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
                <input type="file" accept=".jpg,.jpeg,.gif,.png" id="attachment" v-on:change="previewFile($event)" />
                <img id="userImageEdit" :src="image" width="50" height="50" />
            </div>
        </div>
    </div>
</div>`
}