using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrabullsAPI.Models
{
    public class FormSaveModel
    {
        public long ID { get; set; }
        public string Message { get; set; }
        public bool HasError { get; set; }
    }
}
