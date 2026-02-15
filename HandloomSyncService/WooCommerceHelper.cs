using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WooCommerceNET;
using WooCommerceNET.WooCommerce.v3;

namespace HandloomSyncService
{
    public class WooCommerceHelper
    {
        private string url = "";
        private string consumerKey = "";
        private string consumerSecret = "";
        public WooCommerceHelper()
        {
            url = System.Configuration.ConfigurationManager.AppSettings["WooCommerce_URL"].ToString();
            consumerKey = System.Configuration.ConfigurationManager.AppSettings["WooCommerce_ConsumerKey"].ToString();
            consumerSecret = System.Configuration.ConfigurationManager.AppSettings["WooCommerce_ConsumerSecret"].ToString();
        }

        public async Task<WooCommerceProductSyncResult> GetProducts()
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            WooCommerceProductSyncResult wooCommerceProductSyncResult = new WooCommerceProductSyncResult();

            RestAPI restAPI = new RestAPI(url, consumerKey, consumerSecret);
            WCObject wc = new WCObject(restAPI);

            List<Product> allProducts = new List<Product>();
            int page = 1;
            int perPage = 100;
            List<Product> products;

            do
            {
                Dictionary<string, string> arg = new Dictionary<string, string>();
                arg.Add("page", page.ToString());
                arg.Add("per_page", perPage.ToString());
                products = await wc.Product.GetAll(arg);

                allProducts.AddRange(products);

                page++;
            }
            while (products.Count == perPage);

            int total = allProducts.Count();
            wooCommerceProductSyncResult.success = true;
            wooCommerceProductSyncResult.TotalRows = total;
            wooCommerceProductSyncResult.Products = allProducts;
            return wooCommerceProductSyncResult;
        }
        public async Task<WooCommerceProductVariationSyncResult> GetProductVariations(ulong productID)
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            WooCommerceProductVariationSyncResult wooCommerceProductSyncResult = new WooCommerceProductVariationSyncResult();

            RestAPI restAPI = new RestAPI(url, consumerKey, consumerSecret);
            WCObject wc = new WCObject(restAPI);

            List<Variation> allVariations = new List<Variation>();
            int page = 1;
            int perPage = 100;
            List<Variation> variations;

            do
            {
                Dictionary<string, string> arg = new Dictionary<string, string>();
                arg.Add("page", page.ToString());
                arg.Add("per_page", perPage.ToString());
                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                variations = await wc.Product.Variations.GetAll(productID, arg);

                allVariations.AddRange(variations);

                page++;
            }
            while (variations.Count == perPage);

            int total = allVariations.Count();
            wooCommerceProductSyncResult.success = true;
            wooCommerceProductSyncResult.TotalRows = total;
            wooCommerceProductSyncResult.Variations = allVariations;
            return wooCommerceProductSyncResult;
        }
        public async Task<WooCommerceProductWithVariationSyncResult> GetProductWithVariations()
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

            WooCommerceProductWithVariationSyncResult wooCommerceProductSyncResult = new WooCommerceProductWithVariationSyncResult();

            RestAPI restAPI = new RestAPI(url, consumerKey, consumerSecret);
            WCObject wc = new WCObject(restAPI);

            List<Product> allProducts = new List<Product>();
            int page = 1;
            int perPage = 100;
            List<Product> products;

            do
            {
                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                Dictionary<string, string> arg = new Dictionary<string, string>();
                arg.Add("page", page.ToString());
                arg.Add("per_page", perPage.ToString());
                products = await wc.Product.GetAll(arg);
                allProducts.AddRange(products);
                page++;
            }
            while (products.Count == perPage);

            List<ProductVariation> allProductVariations = new List<ProductVariation>();
            foreach (Product product in allProducts)
            {
                WooCommerceProductVariationSyncResult wooCommerceProductVariationSyncResult = await this.GetProductVariations(product.id.Value);
                if (wooCommerceProductVariationSyncResult.success)
                    allProductVariations.Add(new ProductVariation() { Product = product, Variations = wooCommerceProductVariationSyncResult.Variations });
            }



            int total = allProducts.Count();
            wooCommerceProductSyncResult.success = true;
            wooCommerceProductSyncResult.TotalRows = total;
            wooCommerceProductSyncResult.Products = allProductVariations;
            return wooCommerceProductSyncResult;
        }
        public async Task<WooCommerceTaxClassSyncResult> GetTaxClass()
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            WooCommerceTaxClassSyncResult wooCommerceTaxClassSyncResult = new WooCommerceTaxClassSyncResult();
            try
            {
                RestAPI restAPI = new RestAPI(url, consumerKey, consumerSecret);
                WCObject wc = new WCObject(restAPI);

                List<TaxClass> allTaxClasses = new List<TaxClass>();


                Dictionary<string, string> arg = new Dictionary<string, string>();
                allTaxClasses = await wc.TaxClass.GetAll(arg);

                wooCommerceTaxClassSyncResult.success = true;
                wooCommerceTaxClassSyncResult.TotalRows = allTaxClasses.Count();
                wooCommerceTaxClassSyncResult.Message = "success";
                wooCommerceTaxClassSyncResult.TaxClasses = allTaxClasses;
            }
            catch (Exception ex)
            {
                wooCommerceTaxClassSyncResult.success = false;
                wooCommerceTaxClassSyncResult.TotalRows = 0;
                wooCommerceTaxClassSyncResult.Message = ex.Message;
                wooCommerceTaxClassSyncResult.TaxClasses = new List<TaxClass>();
            }

            return wooCommerceTaxClassSyncResult;
        }
        public async Task<WooCommerceTaxRateSyncResult> GetTaxRate()
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            WooCommerceTaxRateSyncResult wooCommerceTaxClassSyncResult = new WooCommerceTaxRateSyncResult();
            try
            {
                RestAPI restAPI = new RestAPI(url, consumerKey, consumerSecret);
                WCObject wc = new WCObject(restAPI);

                List<TaxRate> allTaxRates = new List<TaxRate>();
                int page = 1;
                int perPage = 100;
                List<TaxRate> products;

                do
                {
                    Dictionary<string, string> arg = new Dictionary<string, string>();
                    arg.Add("page", page.ToString());
                    arg.Add("per_page", perPage.ToString());
                    products = await wc.TaxRate.GetAll(arg);

                    allTaxRates.AddRange(products);

                    page++;
                }
                while (products.Count == perPage);

                wooCommerceTaxClassSyncResult.success = true;
                wooCommerceTaxClassSyncResult.TotalRows = allTaxRates.Count();
                wooCommerceTaxClassSyncResult.TaxRates = allTaxRates;
                return wooCommerceTaxClassSyncResult;
            }
            catch (Exception ex)
            {
                wooCommerceTaxClassSyncResult.success = false;
                wooCommerceTaxClassSyncResult.TotalRows = 0;
                wooCommerceTaxClassSyncResult.Message = ex.Message;
                wooCommerceTaxClassSyncResult.TaxRates = new List<TaxRate>();
            }

            return wooCommerceTaxClassSyncResult;
        }
        public async Task<WooCommerceCustomerSyncResult> GetCustomers()
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            WooCommerceCustomerSyncResult wooCommerceCustomerSyncResult = new WooCommerceCustomerSyncResult();
            try
            {
                RestAPI restAPI = new RestAPI(url, consumerKey, consumerSecret);
                WCObject wc = new WCObject(restAPI);

                List<Customer> allCustomers = new List<Customer>();


                int page = 1;
                int perPage = 100;
                List<Customer> customers;

                do
                {
                    Dictionary<string, string> arg = new Dictionary<string, string>();
                    arg.Add("page", page.ToString());
                    arg.Add("per_page", perPage.ToString());
                    customers = await wc.Customer.GetAll(arg);

                    allCustomers.AddRange(customers);

                    page++;
                }
                while (customers.Count == perPage);


                wooCommerceCustomerSyncResult.success = true;
                wooCommerceCustomerSyncResult.TotalRows = allCustomers.Count();
                wooCommerceCustomerSyncResult.Message = "success";
                wooCommerceCustomerSyncResult.Customers = allCustomers;
            }
            catch (Exception ex)
            {
                wooCommerceCustomerSyncResult.success = false;
                wooCommerceCustomerSyncResult.TotalRows = 0;
                wooCommerceCustomerSyncResult.Message = ex.Message;
                wooCommerceCustomerSyncResult.Customers = new List<Customer>();
            }

            return wooCommerceCustomerSyncResult;
        }
        public async Task<WooCommerceOrderSyncResult> GetOrders()
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            WooCommerceOrderSyncResult wooCommerceOrderSyncResult = new WooCommerceOrderSyncResult();
            try
            {
                RestAPI restAPI = new RestAPI(url, consumerKey, consumerSecret);
                WCObject wc = new WCObject(restAPI);

                List<Order> allOrders = new List<Order>();


                int page = 1;
                int perPage = 100;
                List<Order> orders;

                do
                {
                    Dictionary<string, string> arg = new Dictionary<string, string>();
                    arg.Add("page", page.ToString());
                    arg.Add("per_page", perPage.ToString());
                    orders = await wc.Order.GetAll(arg);

                    allOrders.AddRange(orders);

                    page++;
                }
                while (orders.Count == perPage);


                wooCommerceOrderSyncResult.success = true;
                wooCommerceOrderSyncResult.TotalRows = allOrders.Count();
                wooCommerceOrderSyncResult.Message = "success";
                wooCommerceOrderSyncResult.Orders = allOrders;
            }
            catch (Exception ex)
            {
                wooCommerceOrderSyncResult.success = false;
                wooCommerceOrderSyncResult.TotalRows = 0;
                wooCommerceOrderSyncResult.Message = ex.Message;
                wooCommerceOrderSyncResult.Orders = new List<Order>();
            }

            return wooCommerceOrderSyncResult;
        }
    }

    public class WooCommerceProductSyncResult
    {
        public bool success { get; set; }
        public int TotalRows { get; set; }
        public List<Product> Products { get; set; }


    }
    public class WooCommerceProductVariationSyncResult
    {
        public bool success { get; set; }
        public int TotalRows { get; set; }
        public List<Variation> Variations { get; set; }
    }
    public class WooCommerceProductWithVariationSyncResult
    {
        public bool success { get; set; }
        public int TotalRows { get; set; }
        public string Message { get; set; }
        public List<ProductVariation> Products { get; set; }
    }
    public class ProductVariation
    {
        public Product Product { get; set; }
        public List<Variation> Variations { get; set; }
        public ProductVariation()
        {
            Product = new Product();
            Variations = new List<Variation>();
        }
    }
    public class WooCommerceTaxClassSyncResult
    {
        public bool success { get; set; }
        public string Message { get; set; }
        public int TotalRows { get; set; }
        public List<TaxClass> TaxClasses { get; set; }
    }
    public class WooCommerceTaxRateSyncResult
    {
        public bool success { get; set; }
        public string Message { get; set; }
        public int TotalRows { get; set; }
        public List<TaxRate> TaxRates { get; set; }
    }
    public class WooCommerceCustomerSyncResult
    {
        public bool success { get; set; }
        public string Message { get; set; }
        public int TotalRows { get; set; }
        public List<Customer> Customers { get; set; }
    }
    public class WooCommerceOrderSyncResult
    {
        public bool success { get; set; }
        public string Message { get; set; }
        public int TotalRows { get; set; }
        public List<Order> Orders { get; set; }
    }
}
