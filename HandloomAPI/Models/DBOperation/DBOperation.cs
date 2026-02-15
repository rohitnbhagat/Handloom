using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace TrabullsAPI.Models.DBOperation
{
    public class DBOperation
    {
        private readonly IConfiguration _configuration;
        private DBConnection objConnection;
        private int Timeout = 500;

        public DBOperation(IConfiguration configuration, ContextData contextData)
        {
            _configuration = configuration;
            objConnection = new DBConnection(_configuration, contextData.ClientCode);
            if (_configuration.GetSection("DBConnectionTimeout") != null)
            {
                Timeout = _configuration.GetValue<int>("DBConnectionTimeout");
            }
        }
        public DBOperation(IConfiguration configuration)
        {
            _configuration = configuration;
            objConnection = new DBConnection(_configuration, "Master");
            if (_configuration.GetSection("DBConnectionTimeout") != null)
            {
                Timeout = _configuration.GetValue<int>("DBConnectionTimeout");
            }
        }

        public SqlConnection ConnectionObject
        {
            get { return objConnection.GetConnection; }
        }

        public void CloseConnection()
        {
            try
            {
                if (ConnectionObject.State != ConnectionState.Broken & ConnectionObject.State != ConnectionState.Closed)
                    objConnection.CloseConnection();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        // This method use for exceute Sql command (insert,update,delete) which is return no. of Updated rows 
        public clsResult executeNonQuery(string CommandString)
        {
            clsResult objclsResult = new clsResult();

            SqlCommand objSqlCommand = new SqlCommand();
            objSqlCommand.CommandTimeout = Timeout;

            try
            {
                objSqlCommand.CommandText = CommandString;
                objSqlCommand.CommandType = CommandType.StoredProcedure;
                objSqlCommand.Connection = objConnection.GetConnection;
                if (objConnection.GetConnection.State == ConnectionState.Closed)
                    objConnection.OpenConnection();
                objSqlCommand.ExecuteNonQuery();
                objclsResult.SetHasError = false;
            }
            catch (Exception ex)
            {
                objclsResult.SetHasError = true;
                objclsResult.SetException = ex;
            }
            finally
            {
                objConnection.CloseConnection();
            }

            return objclsResult;
        }

        // This method use for exceute Sql command (select) which is return rows 
        public clsResult execute(string CommandString)
        {
            clsResult objclsResult = new clsResult();

            DataSet dsResult = default(DataSet);
            SqlCommand objSqlCommand = new SqlCommand();
            objSqlCommand.CommandTimeout = Timeout;
            SqlDataAdapter objSqlDataAdapter = new SqlDataAdapter();
            try
            {
                objSqlCommand.CommandText = CommandString;
                objSqlCommand.CommandType = CommandType.StoredProcedure;
                objSqlCommand.Connection = objConnection.GetConnection;

                objSqlDataAdapter.SelectCommand = objSqlCommand;

                dsResult = new DataSet();
                objSqlDataAdapter.Fill(dsResult);
                objclsResult.SetHasError = false;
                objclsResult.SetDataSet = dsResult;
            }
            catch (Exception ex)
            {
                objclsResult.SetHasError = true;
                objclsResult.SetException = ex;
                objclsResult.SetDataSet = dsResult;
            }
            finally
            {
                objConnection.CloseConnection();
            }
            return objclsResult;
        }

        // This method use for exceute Sql command (insert,update,delete) with Parameter which is return no. of Updated rows 
        public clsResult executeNonQuery(string CommandString, ICollection parameter)
        {
            clsResult objclsResult = new clsResult();

            IEnumerator objIEnumerator = default(IEnumerator);
            SqlCommand objSqlCommand = new SqlCommand();
            objSqlCommand.CommandTimeout = Timeout;
            try
            {
                objIEnumerator = parameter.GetEnumerator();
                objSqlCommand.CommandText = CommandString;
                objSqlCommand.CommandType = CommandType.StoredProcedure;
                objSqlCommand.Connection = objConnection.GetConnection;
                objSqlCommand.Parameters.Clear();
                while (objIEnumerator.MoveNext())
                {
                    objSqlCommand.Parameters.Add(objIEnumerator.Current);
                }
                objConnection.OpenConnection();
                objSqlCommand.ExecuteNonQuery();
                objclsResult.SetHasError = false;
            }
            catch (Exception ex)
            {
                objclsResult.SetHasError = true;
                objclsResult.SetException = ex;
            }
            finally
            {
                objConnection.CloseConnection();
            }

            return objclsResult;
        }

        // This method use for exceute Sql command (select) with Parameter which is return rows 
        public clsResult execute(string CommandString, ICollection parameter)
        {
            clsResult objclsResult = new clsResult();
            DataSet dsResult = default(DataSet);
            IEnumerator objIEnumerator = default(IEnumerator);
            SqlCommand objSqlCommand = new SqlCommand();
            objSqlCommand.CommandTimeout = Timeout;
            SqlDataAdapter objSqlDataAdapter = new SqlDataAdapter();
            try
            {
                objIEnumerator = parameter.GetEnumerator();
                objSqlCommand.CommandText = CommandString;
                objSqlCommand.CommandType = CommandType.StoredProcedure;
                objSqlCommand.Connection = objConnection.GetConnection;
                objSqlCommand.Parameters.Clear();
                while (objIEnumerator.MoveNext())
                {
                    objSqlCommand.Parameters.Add(objIEnumerator.Current);
                }
                objSqlDataAdapter.SelectCommand = objSqlCommand;
                dsResult = new DataSet();

                objSqlDataAdapter.Fill(dsResult);
                objclsResult.SetHasError = false;
                objclsResult.SetDataSet = dsResult;
            }
            catch (Exception ex)
            {
                dsResult = null;
                objclsResult.SetHasError = true;
                objclsResult.SetException = ex;
                objclsResult.SetDataSet = dsResult;
            }
            finally
            {
                objConnection.CloseConnection();
            }
            return objclsResult;
        }

    }
}
