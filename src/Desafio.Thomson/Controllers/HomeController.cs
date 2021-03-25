using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Desafio.Bitium.Models;

namespace Desafio.Bitium.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }     

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
