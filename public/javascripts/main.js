
(function ($) {
    "use strict";

    function load_simulations() {
        $.ajax({
            url: '/aws_robomaker/get_simulation',
            type: "GET",
            dataType: "json",
            success: function (data) {
                let html = "";
                for (let i = 0; i < data.message.simulations.length; i++){
                    let sim = data.message.simulations[i].arn.split('/');
                    html = html + "<tr>";
                    html = html + ' <td class="column">' + sim[1] + '</td>';
                    html = html + ' <td class="column">' + data.message.simulations[i].robotApplicationNames[0] + '</td>';
                    html = html + ' <td class="column">' + data.message.simulations[i].arn + '</td>';
                    html = html + ' <td class="column">Ragini</td>';
                    if (data.message.simulations[i].status == "Canceled"){
                        html = html + ' <td class="column" style="color: chocolate">' + data.message.simulations[i].status + '</td>';
                    } else if (data.message.simulations[i].status == "Failed"){
                        html = html + ' <td class="column" style="color: #721c24">' + data.message.simulations[i].status + '</td>';
                    } else {
                        html = html + ' <td class="column" style="color: #1e7e34">' + data.message.simulations[i].status + '</td>';
                    }

                    html = html + ' <td class="column">' + data.message.account_id + '</td>';
                    html = html + ' <td class="column"><a id="td=' + sim[1] + '" href="#" onclick="loadSimulationDetails(this);">Details</a></td>';
                    html = html + "</tr>";
                }
                $("#tbodySimulations").html(html)
            },
            error: function (error) {
                console.log(`Error ${error}`);
            }
        });
    }

    load_simulations();

})(jQuery);

function loadSimulationDetails(sim) {
    let simulation_id = sim.id.split('=');
    window.location.href = "/aws_cloudwatch/view_simulation_logs/" + simulation_id[1];
}