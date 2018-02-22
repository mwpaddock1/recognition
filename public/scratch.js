function formatEmpInfo(employeeInfo) {
    const empInfoHTML = (
 `<div class="employee-boxes>        
     <div class="last-name-box" id="js-last-name">
         <h2>${employeeInfo.lastName}</h2> 
     </div>
     <div class="first-name-box name-box" id="js-first-name">
         <h2>${employeeInfo.firstName}</h2> 
     </div>
     <div class="points-received-box points-box" id="js-points-received">
          <h2>${employeeInfo.pointsReceived}</h2>
      </div>
      <div class="points-given-box points-box" id="js-points-given">
        <h2>${employeeInfo.pointsGiven}</h2>
      </div>
      <div class="points-remaining-box points-box" id="js-points-remaining">
        <h2> ${employeeInfo.pointsRemaining}</h2>
      </div>
    </div>`
    );
    return empInfoHTML;
}
function showEmpInfo(employees) {
    const outpuResults = $("#employee-list");
    outputResults
}

for (let currentEmployee = 0; currentEmployee < data.employees.length; currentEmployee++) {
    let employeeInfo = {
        lastName: data.employee.lastName,
        firstName: data.employee.firstName,
        pointsReceived: data.employee.pointsReceived,
        pointsGiven: data.employee.pointsGiven,
        pointsRemaining: data.employee.pointsRemaining
    }
    let htmlResults = formatEmpInfo(employeeInfo);

    outputResults.append(htmlResults);
}
