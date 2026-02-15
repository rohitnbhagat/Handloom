using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace TrabullsAPI
{
    public class ContextData
    {
        public string ClientCode { get; set; }
        public long UserID { get; set; }
    }
    public class Common
    {
        public static ContextData GetContextData(HttpRequest Request)
        {
            ContextData contextData = new ContextData();
            Microsoft.Extensions.Primitives.StringValues vs = new Microsoft.Extensions.Primitives.StringValues();
            if (Request != null && Request.Headers.TryGetValue("Context", out vs))
            {
                if (vs.Count > 0)
                {
                    string context = vs[0];
                    var json = JsonConvert.DeserializeObject<JObject>(context);
                    contextData.ClientCode = Convert.ToString(json.GetValue("ClientCode"));
                    contextData.UserID = Convert.ToInt64(json.GetValue("UserID"));
                }
            }

            return contextData;
        }

        public static ContextData GetContextData(string ClientCode, long UserID)
        {
            ContextData contextData = new ContextData();
            contextData.ClientCode = ClientCode;
            contextData.UserID = UserID;

            return contextData;
        }

        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                dataTable.Columns.Add(prop.Name);
            }

            if (items != null)
            {
                foreach (T item in items)
                {
                    var values = new object[Props.Length];
                    for (int i = 0; i < Props.Length; i++)
                    {
                        values[i] = Props[i].GetValue(item, null);
                    }
                    dataTable.Rows.Add(values);
                }
            }
            return dataTable;
        }

        public static DataTable ToDataTable<T>(List<T> items, string[] columns)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (string str in columns)
            {
                bool r = false;
                foreach (PropertyInfo i in Props)
                {
                    if (str == i.Name)
                    {
                        if (i.PropertyType.Name.Contains("Nullable"))
                            dataTable.Columns.Add(str);
                        else
                            dataTable.Columns.Add(str, i.PropertyType);
                        r = true;
                    }
                }
                if (!r)
                    dataTable.Columns.Add(str);
            }

            if (items != null)
            {
                foreach (T item in items)
                {
                    DataRow values = dataTable.NewRow();
                    for (int i = 0; i < Props.Length; i++)
                    {
                        if (dataTable.Columns.Contains(Props[i].Name))
                        {
                            values[Props[i].Name] = Props[i].GetValue(item, null);
                        }
                    }
                    dataTable.Rows.Add(values);
                }
            }
            return dataTable;
        }

        public static List<System.Data.SqlClient.SqlParameter> GetSQLParameter<T>(T item, List<string> ExcludedProp = null)
        {
            List<System.Data.SqlClient.SqlParameter> lstsqlParameter = new List<System.Data.SqlClient.SqlParameter>();

            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            if (item != null)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    if (ExcludedProp == null || (ExcludedProp.Count > 0 && !ExcludedProp.Contains(Props[i].Name)))
                    {
                        values[i] = Props[i].GetValue(item, null);
                        lstsqlParameter.Add(new System.Data.SqlClient.SqlParameter("@" + Props[i].Name, values[i]));
                    }
                }

            }
            return lstsqlParameter;
        }

        public static T DeserializeXML<T>(string xml)
        {
            try
            {
                var xmlserializer = new XmlSerializer(typeof(T), new XmlRootAttribute("Attributes")); ;
                var stringReader = new StringReader(xml);
                using (var reader = XmlReader.Create(stringReader))
                {
                    return (T)xmlserializer.Deserialize(reader);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public static string ListToXmlString<T>(List<T> list)
        {
            var xmlSerializer = new XmlSerializer(typeof(List<T>));

            using (var stringWriter = new StringWriter())
            {
                xmlSerializer.Serialize(stringWriter, list);
                return stringWriter.ToString();
            }
        }
        public static List<T> XmlStringToList<T>(string xmlString)
        {
            var xmlSerializer = new XmlSerializer(typeof(List<T>));

            using (var stringReader = new StringReader(xmlString))
            {
                return (List<T>)xmlSerializer.Deserialize(stringReader);
            }
        }
    }
}
