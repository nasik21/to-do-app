DashboardHelper.authAlive()
var n;
$(document).on("submit", "#register", function (e) {
    e.preventDefault()
    let loginData = DashboardHelper.serializeObject($(this));
    let postData = {
        name: loginData.name,
        email: loginData.email,
        password: loginData.password,
    }

    DashboardClient.post(DashboardClient.domainUrl() + "/v1/register", postData)
        .then((response) => {
            if (response.status === true) {
                DashboardHelper.setAccessToken(response.token);
                toastr.info(response.message, "info", DashboardHelper.toastOption());
                window.location.href = "user/index.php";
            }
        })
        .catch((error) => {
            
            var message = error.responseJSON.message;
            
            if(error.status == 422){
                var errorArr = error.responseJSON.message;
                                
                message = '';
                for (let prop in errorArr) {
                    message += '' + errorArr[prop][0] + '<br>';
                }

            }
            
            toastr.error(message, "Error", DashboardHelper.toastOption());
            
        })
});