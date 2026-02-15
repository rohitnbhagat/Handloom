using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace TrabullsAPI.Models.DBOperation
{
    public static class clsConvert
    {
        public static List<T> ConvertDataTable<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    T item = GetItem<T>(row);
                    data.Add(item);
                }
            }
            return data;
        }

        public static T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in dr.Table.Columns)
            {
                foreach (PropertyInfo pro in temp.GetProperties())
                {
                    if (pro.Name == column.ColumnName)
                        if (dr[column.ColumnName] != DBNull.Value)
                            pro.SetValue(obj, dr[column.ColumnName], null);
                        else
                            pro.SetValue(obj, null, null);
                    else
                        continue;
                }
            }

            return obj;
        }

    }

    public class PropertyCopier<TParent, TChild>
        where TParent : class
        where TChild : class
    {
        public static void Copy(TParent parent, TChild child)
        {
            var parentProperties = parent.GetType().GetProperties();
            var childPropertied = child.GetType().GetProperties();

            foreach (var ParentProperty in parentProperties)
            {
                foreach (var ChildProperty in parentProperties)
                {
                    if (ParentProperty.Name == ChildProperty.Name)
                    {
                        ChildProperty.SetValue(child, ParentProperty.GetValue(parent));
                        break;
                    }
                }
            }

        }
    }
}
