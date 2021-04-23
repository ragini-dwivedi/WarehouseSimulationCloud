
(function ($) {
    "use strict";

})(jQuery);

function edituser(e) {
    let name = e.parentNode.parentNode.childNodes[0].innerHTML;
    $.ajax({
        url: '/aws_user/get_user_detail/' + name,
        type: "GET",
        dataType: "json",
        success: function (data) {
            $("#txtusername").val(data.message.data.LoginProfile.UserName);
            $("#txtpassword").val("");
            let modalUserDetails = document.getElementById("userDetails");
            modalUserDetails.style.display = "block";
        },
        error: function (error) {
            console.log(`Error ${error}`);
        }
    });
}

function deleteuser(e) {
    let r = confirm("Are you sure, you want to delete the user?");
    if (r === true) {
        delete_aws_user(e);
    }
}

function delete_aws_user(e) {
    let name = e.parentNode.parentNode.childNodes[0].innerHTML;
    $.ajax({
        url: '/aws_user/delete_account',
        type: "POST",
        data:{
            username: name
        },
        dataType: "json",
        success: function (data) {
            alert("User deleted successfully");
            window.location.href = "/aws_user/view_user_details/" +name;
        },
        error: function (error) {
            console.log(`Error ${error}`);
        }
    });
}

function adduser() {
    let modalUserDetails = document.getElementById("adduserDetails");
    modalUserDetails.style.display = "block";
}

function adduserdetails() {
    $.ajax({
        url: '/aws_user/create_account',
        type: "POST",
        data:{
            username: $("#txtAddusername").val(),
            password: $("#txtAddpassword").val()
        },
        dataType: "json",
        success: function (data) {
            alert("User added successfully");
            let modalUserDetails = document.getElementById("adduserDetails");
            modalUserDetails.style.display = "none";
            window.location.href = "/aws_user/view_user_details/" + $("#txtAddusername").val();
        },
        error: function (error) {
            console.log(`Error ${error}`);
        }
    });
}

function saveuser(e) {
    $.ajax({
        url: '/aws_user/update_password',
        type: "POST",
        data:{
            username: $("#txtusername").val(),
            password: $("#txtpassword").val()
        },
        dataType: "json",
        success: function (data) {
            alert("User updated successfully");
            let modalUserDetails = document.getElementById("userDetails");
            modalUserDetails.style.display = "none";
            window.location.href = "/aws_user/view_user_details/" + $("#txtusername").val();
        },
        error: function (error) {
            console.log(`Error ${error}`);
        }
    });
}


function closeusermodal(e) {
    let modalUserDetails = document.getElementById("userDetails");
    modalUserDetails.style.display = "none";
}

function closeaddusermodal() {
    let modalUserDetails = document.getElementById("adduserDetails");
    modalUserDetails.style.display = "none";
}