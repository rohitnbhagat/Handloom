using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace TrabullsAPI
{
    public class ApiKeyMiddleware
    {
        private readonly ILogger<ApiKeyMiddleware> _logger;
        private readonly RequestDelegate _next;
        private const string APIkey = "XApiKey";

        public ApiKeyMiddleware(RequestDelegate next, ILogger<ApiKeyMiddleware> logger) {
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context) {
            _logger.LogInformation("Method InvokeAsunc");
            if (!context.Request.Headers.TryGetValue(APIkey, out var extractedApiKey)) {
                _logger.LogInformation("Method InvokeAsunc - 1");
                context.Response.StatusCode = 401;
                dynamic exo = new System.Dynamic.ExpandoObject();
                exo.success = false;
                exo.message = "API key was not provided";
                exo.data = null;
                string msg = Newtonsoft.Json.JsonConvert.SerializeObject(exo);
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(msg);
                return;
            }
            if (!context.Request.Headers.TryGetValue("Context", out var Context))
            {
                _logger.LogInformation("Method InvokeAsunc - 2");
                context.Response.StatusCode = 401;
                dynamic exo = new System.Dynamic.ExpandoObject();
                exo.success = false;
                exo.message = "Context was not provided";
                exo.data = null;
                string msg = Newtonsoft.Json.JsonConvert.SerializeObject(exo);
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(msg);
                return;
            }
            else {
                _logger.LogInformation("Method InvokeAsunc - 3");
                ContextData contextData = Common.GetContextData(context.Request);
                //var appSettings = context.RequestServices.GetRequiredService<IConfiguration>();
                //var apiKey = appSettings.GetValue<string>(APIkey);
                if (!Data.lstUsers.Any(t=>t.ClientCode.Equals(contextData.ClientCode) && t.APIKey.Equals(extractedApiKey)))
                {
                    _logger.LogInformation("Method InvokeAsunc - 4");
                    context.Response.StatusCode = 401;
                    dynamic exo = new System.Dynamic.ExpandoObject();
                    exo.success = false;
                    exo.message = "Unauthorized client";
                    exo.data = null;
                    string msg = Newtonsoft.Json.JsonConvert.SerializeObject(exo);
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(msg);
                    return;
                }
                await _next(context);
            }
        }
    }
}
