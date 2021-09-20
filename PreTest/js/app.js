var arrEmployees;
$.getJSON("https://www.swollenhippo.com/getStaffByAPIKey.php?APIKey=DuffManSays,Phrasing!", function(result){
    arrEmployees = result;
    $.each(result,function(i,person){
        $('#divEmployeeContainer').append(buildEmployeeCard(person));
        $('#tblEmployeePay tbody').append(buildEmployeeTableRow(person));
    })
    $('#tblEmployeePay').DataTable();
})

$(document).on('click','#btnHideWelcome',function(){
    $('#divWelcome').slideToggle();
    $('#divData').slideToggle();
    $('#btnViews').slideToggle();
})

$(document).on('click','#btnViews',function(){
    $('#divEmployeeContainer').slideToggle();
    $('#divTableContainer').slideToggle();
})

$(document).on('click','.btnCalculate',function(){
    let decWage = $(this).closest('.card').find('.spanRate').text();
    let decTax = $(this).closest('.card').find('.spanTax').text();
    let decGoal = $(this).closest('.card').find('.txtGoal').val();
    let decTaxedWage = decWage * (1.00 - decTax);
    let decHours = decGoal/decTaxedWage;
    if(decHours > 40){
        decGoal = decGoal - (40 * (decWage * (1.00 - decTax)));
        decHours = decGoal/((decWage * (1.00 - decTax)*1.5));
        decHours += 40;
    }
    $(this).closest('.card').find('.spanHours').text(Math.round((decHours + Number.EPSILON) * 100) / 100);
})

function calculateTotalPay(decPayRate, decHours, decTaxRate){
    decOverTime = 0.00;
    if(decHours > 40){
        decOvertime = decHours - 40;
        decHours = 40;
    }
    return Math.round(((((decHours * decPayRate) + (decOverTime * decPayRate * 1.5)) * (1- decTaxRate)) + Number.EPSILON) * 100) / 100;
}

function buildEmployeeTableRow(Employee){
    return '<tr><td>' + Employee.FirstName + '</td><td>' + Employee.LastName + '</td><td>' + Employee.Title + '</td><td>' + calculateTotalPay(Employee.HourlyWage,Employee.Hours,Employee.TaxRate) + '</td></tr>';
}

function buildEmployeeCard(Employee){
    strCardHTML = '<div class="card col-3 mt-3 ml-3 mb-3">';
    strCardHTML += '<div class="card-body">';
    strCardHTML += '<img src="./images/Profile.png" alt="Profile Pic" style="width:100%; border-radius: 50%;"></img>';
    strCardHTML += '<h2 class="text-center mb-0">' + Employee.FirstName + ' ' + Employee.LastName + '</h2>';
    strCardHTML += '<h4 class="text-center text-muted mt-0">' + Employee.Title + '</h4>';
    strCardHTML += '<h5 class="mt-5 text-bold">Contact Details</h5>';
    strCardHTML += '<p class="mb-0 ml-3">Phone Number: <a href="tel:' + Employee.Phone + '" class="aPhone">' + Employee.Phone + '</a></p>';
    strCardHTML += '<p class="mt-0 ml-3">Email: <a href="mailto:' + Employee.Email + '" class="aEmail">' + Employee.Email + '</a></p>';
    strCardHTML += '<h5 class="mt-4 text-bold">Address</h5>';
    strCardHTML += '<p class="pStreetAddress mb-0 ml-3">' + Employee.StreetAddress1 + '</p>';
    strCardHTML += '<p class="pCityState mt-0 ml-3">' + Employee.City + ', ' + Employee.State + 'TN</p>';
    strCardHTML += '<h5 class="mt-4 text-bold">Pay Details</h5>';
    strCardHTML += '<p class="ml-3 mb-0">Pay Rate: <span class="spanRate">' + Employee.HourlyWage + '<span></p>';
    strCardHTML += '<p class="ml-3 mb-0">Hours Worked: <span class="spanHours">--<span></p>';
    strCardHTML += '<p class="ml-3 mb-0">Tax Rate: <span class="spanTax">' + Employee.TaxRate + '<span></p>';
    strCardHTML += '<div class="form-group row ml-3 mt-4">';
    strCardHTML += '<label class="col-form-label">Goal Pay</label>';
    strCardHTML += '<div class="col">';
    strCardHTML += '<input type="number" class="form-control-plaintext txtGoal">';
    strCardHTML += '</div>';
    strCardHTML += '</div>';
    strCardHTML += '<button class="btn btn-primary btn-block btnCalculate">Find Hours For Goal</button>';
    strCardHTML += '</div>';
    strCardHTML += '</div>';
    return strCardHTML;
}