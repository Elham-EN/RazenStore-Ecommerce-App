import axios, { AxiosResponse } from "axios";
import { Product } from "../models/Product";

axios.defaults.baseURL = "http://localhost:5000/api/";

// Extract the data we are interested from the request body
function responseBody(response: AxiosResponse) {
  return response.data;
}

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
