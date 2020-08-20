using CRUD_Net_Framework.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRUD_Net_Framework.Controllers
{
    public class HomeController : Controller
    {
        kalbeEntities db = new kalbeEntities();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult AddObat()
        {
            return View();
        }

        [HttpPost]
        public ActionResult addObats(OBAT obat)
        {
            var obatModel = new OBAT();
            obatModel.nama_obat = obat.nama_obat;
            obatModel.jenis_obat = obat.jenis_obat;
            obatModel.harga_obat = obat.harga_obat;
            db.OBAT.Add(obatModel);
            db.SaveChanges();

            return RedirectToAction("ViewDataObat");
        }

        public ActionResult ViewDataObat()
        {
            var getData = db.OBAT.ToList();
            return View(getData);
        }


        public ActionResult DeleteObat(int id)
        {
            var getIdPrimary = db.OBAT.Find(id);
            db.OBAT.Remove(getIdPrimary);
            db.SaveChanges();
            return RedirectToAction("ViewDataObat");
        }

        public ActionResult EditObat(int id)
        {
            var getData = db.OBAT.SingleOrDefault(x => x.id == id);
            return View(getData);
        }

        [HttpPost]
        public ActionResult EditObats(OBAT obat)
        {
            var getDataUpdate = db.OBAT.SingleOrDefault(x => x.id == obat.id);

            if (getDataUpdate != null)
            {
                getDataUpdate.nama_obat = obat.nama_obat;
                getDataUpdate.jenis_obat = obat.jenis_obat;
                getDataUpdate.harga_obat = obat.harga_obat;
            }
            db.SaveChanges();

            return RedirectToAction("ViewDataObat");
        }

        public ActionResult Details(int id)
        {
            var getData = db.OBAT.Find(id);
            return View(getData);
        }

    }
}