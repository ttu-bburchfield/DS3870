using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace ISISGetEmployee
{
    
    public static class getEmployee
    {
        private class Agency
        {
            public string Name { get; set; }
            public string Address { get; set; }
            public string Phone { get; set; }
            public Agency(string strAgencyName, string strAddress, string strPhone)
            {
                Name = strAgencyName;
                Address = strAddress;
                Phone = strPhone;
            }
    }
        private class Employee
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string CodeName { get; set; }
            public string Position { get; set; }
            public string Status { get; set; }
            public double WeeklyPay { get; set; }
            public Agency Agency { get; set; }
            public Employee(string strFirstName, string strLastName, string strCodeName, string strPosition, string strStatus, double dblPayRate, double dblHours, string strAgency, Agency agSpyAgency)
            {
                FirstName = strFirstName;
                LastName = strLastName;
                CodeName = strCodeName;
                Position = strPosition;
                Status = strStatus;
                WeeklyPay = dblPayRate * dblHours;
                Agency = agSpyAgency;
            }
        }

        [FunctionName("getEmployee")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            string strCodeName = req.Query["CodeName"];
            string strAgency = req.Query["Agency"];
            log.LogInformation("HTTP trigger on getEmployee processed a request for: " + strCodeName);

            Agency ISIS = new Agency("ISIS", "10 E Broad St", "(931) 526-2125");
            Agency CIA = new Agency("CIA", "10 E Broad St", "(931) 526-2125");

            Employee Archer = new Employee("Sterling", "Archer", "Duchess", "Field Agent", "Active",23.75,18.50,"ISIS", ISIS);
            Employee Lana = new Employee("Lana", "Kane", "Truckasaurus", "Field Agent", "Active",21.50,23.50, "ISIS", ISIS);
            Employee Pam = new Employee("Pam", "Poovey", "Snowball", "Human Resource Director", "Active",49.00,12, "ISIS", ISIS);
            Employee Barry = new Employee("Barry", "Cyborg", "Duchess", "Field Agent", "Active", 23.75, 18.50, "CIA", CIA);

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            Employee[] arrEmployees = new Employee[] { Archer, Lana, Pam, Barry };

            List<Employee> lstFoundEmployees = new List<Employee>();
            foreach(Employee empCurrent in arrEmployees)
            {
                if(strCodeName == empCurrent.CodeName)
                {
                    lstFoundEmployees.Add(empCurrent);
                }
            }
            if(lstFoundEmployees.Count > 0)
            {
                return new OkObjectResult(lstFoundEmployees);
            } else
            {
                return new OkObjectResult("Employee Not Found");
            }
            

        }
    }
}
