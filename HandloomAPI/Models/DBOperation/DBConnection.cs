using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace TrabullsAPI.Models.DBOperation
{
    public enum Database
    {
        Client = 1
    }
    public class DBConnection
    {
        private readonly IConfiguration _configuration;
        public DBConnection(IConfiguration configuration, string ClientCode = "")
        {
            _configuration = configuration;
            SetConnection = _configuration.GetValue<string>("DBConnectionString:" + ClientCode);
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
