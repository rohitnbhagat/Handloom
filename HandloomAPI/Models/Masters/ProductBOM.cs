using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.ProductBOM
{
    public class ProductBOM_AddModel
    {
        public long ProductID { get; set; }
        public string Remarks { get; set; }
        public List<ProductBOM_Component_AddModel> Components { get; set; }
    }
    public class ProductBOM_Component_AddModel
    {
        public long ComponentID { get; set; }
        public List<ProductBOM_Process_AddModel> Processes { get; set; }
    }
    public class ProductBOM_Process_AddModel
    {
        public long ProcessID { get; set; }
    }
    public class ProductBOM_ViewModel
    {
        public long ProductBOMID { get; set; }
        public long ProductID { get; set; }
        public string ProductName { get; set; }
        public string Remarks { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
        public List<ProductBOM_Component_ViewModel> Components { get; set; }
    }
    public class ProductBOM_Component_ViewModel
    {
        public long ComponentID { get; set; }
        public string ComponentName { get; set; }
        public List<ProductBOM_Process_ViewModel> Processes { get; set; }
    }
    public class ProductBOM_Process_ViewModel
    {
        public long ComponentID { get; set; }
        public long ProcessID { get; set; }
        public string ProcessName { get; set; }
    }
}
