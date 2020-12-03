using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Plumsail_work.Controllers
{
    public class AutorizeControllers : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        //[HttpGet]
        public IActionResult Buy(int? id)
        {
            if (id == null) return RedirectToAction("Index");
            return View();
        }
        //[HttpPost]
        
    }
}
