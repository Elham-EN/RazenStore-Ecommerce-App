import axios, { AxiosError, AxiosResponse } from "axios";
import { Product } from "../models/Product";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}

axios.defaults.baseURL = "http://localhost:5000/api/";

// Extract the data we are interested from the request body
function responseBody(response: AxiosResponse) {
  return response.data;
}

// You can intercept out-going requests or incoming responses
// before they are handled by then or catch
axios.interceptors.response.use(
  async (response) => {
    await sleep();
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            //etc, Problem1, Problem2...
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          //Get just two strings
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 500:
        router.navigate("/server-error", {
          state: { error: data },
        });
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  }
);

// Different of request, that we're going to use axios for
const requests = {
  get: async function (url: string) {
    const response = await axios.get(url);
    return responseBody(response);
  },
  // Sent data to the server, that goes in the body
  post: async function (url: string, body: {}) {
    const response = await axios.post(url, body);
    return responseBody(response);
  },
  put: async function (url: string, body: {}) {
    const response = await axios.put(url, body);
    return responseBody(response);
  },
  delete: async function (url: string) {
    const response = await axios.delete(url);
    return responseBody(response);
  },
};

const Catalog = {
  // Get list of products '/products'
  list: function (): Promise<Product[]> {
    return requests.get("products");
  },
  details: function (id: number) {
    return requests.get(`products/${id}`);
  },
};

const TestErrors = {
  get400Error: function () {
    return requests.get("buggy/bad-request");
  },
  get401Error: function () {
    return requests.get("buggy/unauthorised");
  },
  get404Error: function () {
    return requests.get("buggy/not-found");
  },
  get500Error: function () {
    return requests.get("buggy/server-error");
  },
  getValidationError: function () {
    return requests.get("buggy/validation-error");
  },
};

const agent = {
  Catalog,

  TestErrors,
};

export default agent;
