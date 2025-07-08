using Microsoft.AspNetCore.Mvc;

namespace RealTimeDashboard.Controllers
{

    [Route("/home")]
    public class HomeController : Controller
    {
    [HttpGet("test")]

        public IActionResult Test() => Ok("its working");
    }
}
