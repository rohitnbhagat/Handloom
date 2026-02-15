using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HandloomSyncService
{
    public class clsResult
    {
        private DataSet _dsResultSet;
        private DataTable _dsResultDataTable;
        private bool _HasError;
        private bool _HasData;
        private Exception _exception;

        public clsResult()
        {
            _dsResultSet = null;
            _HasError = true;
            _HasData = false;
            _exception = null;
        }

        public DataSet SetDataSet
        {
            set
            {
                this._dsResultSet = value;
                this._dsResultDataTable = null;
                this._HasData = false;
                if (value != null)
                {
                    this._dsResultDataTable = value.Tables[0].Copy();
                    this._HasData = (value.Tables[0].Rows.Count > 0) ? true : false;
                }
            }
        }
        public bool SetHasError
        {
            set
            {
                this._HasError = value;
                if (value)
                {
                    this._dsResultSet = null;
                    this._dsResultDataTable = null;
                    this._HasData = false;
                }
            }
        }
        public Exception SetException
        {
            set
            {
                this._exception = value;
            }
        }
        public Exception GetException
        {
            get
            {
                return this._exception;
            }
        }


        public bool HasError { get { return _HasError; } }
        public bool HasData { get { return _HasData; } }
        public DataTable ResultDataTable { get { return _dsResultDataTable; } }
        public DataSet ResultDataSet { get { return _dsResultSet; } }

        public List<T> GetDataList<T>()
        {
            return clsConvert.ConvertDataTable<T>(this.ResultDataTable);
        }
        public T GetData<T>()
        {
            if (this.ResultDataTable != null && this.ResultDataTable.Rows.Count > 0)
                return clsConvert.GetItem<T>(ResultDataTable.Rows[0]);

            return default(T);
        }
    }
}
