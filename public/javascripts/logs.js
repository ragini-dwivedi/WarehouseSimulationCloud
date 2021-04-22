
(function ($) {
    "use strict";

})(jQuery);

function showlogDetails(logDetails) {
    let arn = logDetails.parentNode.parentNode.childNodes[0].innerHTML;
    let split_result = arn.split('/');
    let modalSimulationLog = document.getElementById("simulationLog");
    let modalRobotLog = document.getElementById("robotLog");

    $.ajax({
        url: '/aws_cloudwatch/get_logs_events',
        type: "POST",
        data: {
            streamName: split_result[0],
            simulationName: split_result[1]
        },
        dataType: "json",
        success: function (data) {
            let html = "";
            if (arn.includes("SimulationApplicationLogs")){
                for (let i = 0; i < data.message.simulation_delivery.events.length; i++){
                    html = html + "<tr>";
                    html = html + ' <td class="column">' + (i + 1) + '</td>';
                    html = html + ' <td class="column">' + data.message.simulation_delivery.events[i].message + '</td>';
                    html = html + "</tr>";
                }

                $("#tbodySimulationsLog").html(html);
                modalSimulationLog.style.display = "block";
            } else {
                for (let j = 0; j < data.message.robot_application.events.length; j++){
                    html = html + "<tr>";
                    html = html + ' <td class="column">' + (j + 1) + '</td>';
                    html = html + ' <td class="column">' + data.message.robot_application.events[j].message + '</td>';
                    html = html + "</tr>";
                }

                $("#tbodyRobotLog").html(html);
                modalRobotLog.style.display = "block";
            }
        },
        error: function (error) {
            console.log(`Error ${error}`);
        }
    });
}

function closeSimulationLogModal() {
    let modalSimulationLog = document.getElementById("simulationLog");
    modalSimulationLog.style.display = "none";
}

function closeRobotLogModal() {
    let modalRobotLog = document.getElementById("robotLog");
    modalRobotLog.style.display = "none";
}