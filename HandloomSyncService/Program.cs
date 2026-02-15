using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace HandloomSyncService
{
    public static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main()
        {
            Log("Main Method called");
            ServiceBase[] ServicesToRun;
            ServicesToRun = new ServiceBase[]
            {
                new Service1()
            };
            //ServiceBase.Run(ServicesToRun);
            if (Environment.UserInteractive)
            {
                Log("Environment.UserInteractive == True");
                Console.WriteLine("Service running, press to stop.");
                ((Service1)ServicesToRun[0]).Start(null);
                Console.ReadLine();
                ((Service1)ServicesToRun[0]).Stop();
            }
            else
            {
                Log("Environment.UserInteractive == False");
                ServiceBase.Run(ServicesToRun);
            }
        }

        public static void Log(string message)
        {
            string filePath = System.Configuration.ConfigurationManager.AppSettings["LogPath"].ToString();
            DirectoryInfo directoryInfo = new DirectoryInfo(filePath);
            if (!directoryInfo.Exists)
            {
                directoryInfo.Create();
            }
            filePath = System.IO.Path.Combine(filePath, DateTime.Now.ToString("ddMMyyyy") + ".txt");
            // Append log entries to the file with a timestamp
            string logMessage = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}";

            try
            {
                // Append the message to the log file
                File.AppendAllText(filePath, logMessage + Environment.NewLine);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to write log: {ex.Message}");
            }
        }
    }
}
