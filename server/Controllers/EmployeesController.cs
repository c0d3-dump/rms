using rms.Data;
using rms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace rms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class EmployeesController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetEmployees()
    {
      return Ok(await database.Employees.ToListAsync());
    }

    [HttpGet]
    [Route("{employeeId:int}")]
    public async Task<IActionResult> GetEmployee([FromRoute] int employeeId)
    {
      var employee = await database.Employees.FindAsync(employeeId);

      if (employee == null)
      {
        return NotFound();
      }
      return Ok(employee);
    }

    [HttpPost]
    public async Task<IActionResult> AddEmployee(AddEmployeeRequest addEmployeeRequest)
    {
      var newEmployee = new Employee()
      {
        Name = addEmployeeRequest.Name,
        Contact = addEmployeeRequest.Contact
      };

      await database.Employees.AddAsync(newEmployee);
      await database.SaveChangesAsync();

      return Ok(newEmployee);
    }

    [HttpDelete]
    [Route("{employeeId:int}")]
    public async Task<IActionResult> DeleteEmployee([FromRoute] int employeeId)
    {

      var employee = await database.Employees.FindAsync(employeeId);
      if (employee != null)
      {
        database.Remove(employee);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}