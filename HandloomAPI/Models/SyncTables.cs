using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandloomAPI.Models
{
    public class SyncTables_ViewModel
    {
        public long TableID { get; set; }
        public string TableName { get; set; }
        public string Remarks { get; set; }
        public long? LastSyncBy { get; set; }
        public DateTime? LastSyncDate { get; set; }
        public string LastSyncByName { get; set; }
        public int OrderNo { get; set; }
        public string ModifiedByName { get; set; }
    }
    public class SyncTables_AddModel
    {
        public long TableID { get; set; }
        public DateTime SyncStartDate { get; set; }
        public DateTime SyncEndDate { get; set; }
    }
}
