using Microsoft.AspNetCore.Mvc;

namespace RealTimeDashboard.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/index.html"), "text/html");
    }
}