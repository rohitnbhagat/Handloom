using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HandloomSyncService
{
    public class DBConnection
    {
        public DBConnection()
        {
            SetConnection = System.Configuration.ConfigurationManager.AppSettings["Con"].ToString();
        }

        private SqlConnection objConnection;
        public string SetConnection
        {
            set { objConnection = new SqlConnection(value); }
        }

        public SqlConnection GetConnection
        {
            get { return objConnection; }
        }

        public DBConnection(string connectionString)
        {
            try
            {
                SetConnection = connectionString;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void OpenConnection()
        {
            try
            {
                if (GetConnection.State == System.Data.ConnectionState.Broken || GetConnection.State == System.Data.ConnectionState.Closed)
                    GetConnection.Open();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //This method use for Close connection 
        public void CloseConnection()
        {
            try
            {
                if (GetConnection.State != System.Data.ConnectionState.Closed && GetConnection.State != System.Data.ConnectionState.Broken)
                    GetConnection.Close();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


    }
}
