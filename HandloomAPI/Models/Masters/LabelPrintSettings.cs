using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models.Masters.LabelPrintSettings
{
    public class LabelPrintSettings_AddModel
    {
        public long SettingID { get; set; }
        public string SettingName { get; set; }
        public long printerDPI { get; set; }
        public long width { get; set; }
        public long height { get; set; }
        public long columns { get; set; }
        public long columnSpace { get; set; }
        public long rowSpace { get; set; }
    }
    public class LabelPrintSettings_ViewModel
    {
        public long SettingID { get; set; }
        public string SettingName { get; set; }
        public long printerDPI { get; set; }
        public long width { get; set; }
        public long height { get; set; }
        public long columns { get; set; }
        public long columnSpace { get; set; }
        public long rowSpace { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
