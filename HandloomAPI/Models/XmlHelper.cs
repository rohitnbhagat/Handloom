using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Xml.Serialization;

namespace HandloomAPI
{
    public class XmlHelper
    {
        public static string ConvertToXml<T>(List<T> list)
        {
            var serializer = new XmlSerializer(typeof(List<T>));
            using (var stringWriter = new StringWriter())
            {
                serializer.Serialize(stringWriter, list);
                return stringWriter.ToString();
            }
        }
    }
}
