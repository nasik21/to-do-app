DashboardHelper.preLoaderShow();

(new Dashboard()).getTask();

let postDataAdd = {
    name: null,
    due_date: null,
    responsible_user: null,
    status: null
}
let postDataEdit = {
    id: null,
    name: null,
    due_date: null,
    responsible_user: null,
    status: null
}
$(document).on("submit", "#addTaskForm", function (e) {
    e.preventDefault();
    let taskData = DashboardHelper.serializeObject($(this));
    postDataAdd.task = taskData.task;   
    (new Dashboard()).addTask();
})

$(document).on("submit", "#updateTaskForm", function (e) {
    e.preventDefault();
    let taskData = DashboardHelper.serializeObject($(this));
    postDataEdit.task = taskData.task;
    postDataEdit.status = taskData.status;
    (new Dashboard()).updateTask();
})

function Dashboard() {
    this.getTask = () => {
        $("#showTask").html('')
        DashboardClient.get(DashboardClient.domainUrl() + "/v1/todo")
            .then((response) => {
                if (response.status === true) {
                    let data = response.data;
                    $.each(data, function (key, val) {
                        let status_value = "Incomplete";
                        let status_color = "secondary";
                        if (val.status == 1) {
                            status_value = "Complete";
                            status_color = "success";
                        }
                        $("#showTask").append(`
                            <tr>
                                    <td>
                                        <div class="d-flex px-2">
                                            <div class="my-auto">
                                                <h6 class="mb-0 text-sm">${val.id ? val.id : '--'}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex px-2">
                                            <div class="my-auto">
                                                <h6 class="mb-0 text-sm">${val.task ? val.task : '--'}</h6>
                                            </div>
                                        </div>
                                    </td>                                                                       
                                    <td>
                                        <span class="badge badge-sm bg-gradient-${status_color ? status_color : status_color}">${status_value ? status_value : '--'}</span>                                       
                                    </td>                                   
                                    <td class="align-middle text-center">
                                        <div class="d-flex">
                                            <span class="me-2 text-xs font-weight-bold">${val.created_at ? val.created_at : '--'}</span>
                                        </div>
                                    </td>
                                    <td>
                                    <div data-toggle="modal" data-target="#editTask" style="display: inline">
                                        <a class="btn btn-link text-dark px-3 mb-0" href="javascript: editTask(${val.id});"  ><i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true"></i></a>
                                    </div>                                                                              
                                        <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript: deleteTask(${val.id});"><i class="far fa-trash-alt" aria-hidden="true"></i></a>
                                    </td>
                                </tr>
                        `);
                    });
                }
                DashboardHelper.preLoaderHide();
            })
            .catch((error) => {
                $("#showTask").html(`
                            <tr class="text-center">
                                <td colspan="10" class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Data Not Fount...</td>
                            </tr>
                        `);
                if(error.status === 401){
                    DashboardHelper.unAuthorize();
                }
                DashboardHelper.preLoaderHide();
                console.log(error.responseJSON)
            })
    };
    this.addTask = () => {
        console.log(postDataAdd)
        DashboardClient.post(DashboardClient.domainUrl() + "/v1/todo", postDataAdd)
            .then((response) => {
                if (response.status === true) {
                    toastr.info(response.message, "info", DashboardHelper.toastOption());
                    $("#close_1").click();
                    $(this).trigger("reset")
                    (new Dashboard().getTask());
                }
            })
            .catch((error) => {
                toastr.error(error.responseJSON.message, "error", DashboardHelper.toastOption());
            })
    };
    this.updateTask = () => {
        console.log(postDataEdit)
        DashboardClient.put(DashboardClient.domainUrl() + "/v1/todo", postDataEdit)
            .then((response) => {
                if (response.status === true) {
                    toastr.info(response.message, "info", DashboardHelper.toastOption());
                    $("#close_2").click();
                    $(this).trigger("reset")
                    (new Dashboard().getTask());
                }
            })
            .catch((error) => {
                toastr.error(error.responseJSON.message, "error", DashboardHelper.toastOption());
            })
    };
    this.deleteTask = (id) => {
        console.log(id)
        DashboardClient.delete(DashboardClient.domainUrl() + "/v1/todo/" + id)
            .then((response) => {
                if (response.status === true) {
                    toastr.info(response.message, "info", DashboardHelper.toastOption());
                    (new Dashboard()).getTask();
                }
            })
            .catch((error) => {
                toastr.error(error.responseJSON.message, "error", DashboardHelper.toastOption());
            })
    };
    this.getTaskById = (id) => {
        DashboardClient.get(DashboardClient.domainUrl() + "/v1/todo/" + id)
            .then((response) => {
                if (response.status === true) {
                    let data = response.data;
                    $("#edit_name").val(data.task) 
                    let todoStatus = (data.status)? 1: 0;
                    $('#edit_status').val(todoStatus);
                }
            })
            .catch((error) => {
                console.log(error.responseJSON)
            })
    };
}

function editTask(id) {
    postDataEdit.id = id;
    (new Dashboard()).getTaskById(id);
}

function deleteTask(id) {
    (new Dashboard()).deleteTask(id);
}