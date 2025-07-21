const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Token management to handle auth tokens
const tokenManager = {
  save: (token) => {
    localStorage.setItem("authToken", token);
    document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
  },

  get: () => localStorage.getItem("authToken"),

  clear: () => {
    localStorage.removeItem("authToken");
    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = tokenManager.get();
  if (token) {
    config.headers.Authorization = token;
  }

  try {
    const response = await fetch(url, config);

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      // Handle cases where response is not JSON
      data = { message: `HTTP ${response.status}: ${response.statusText}` };
    }

    // Save token if came in response
    if (data.token) {
      tokenManager.save(data.token);
    }

    if (!response.ok) {
      console.log(
        `API Error: ${response.status} - ${data.message || response.statusText}`
      );

      // Handle authentication errors by clearing invalid tokens
      if (response.status === 401 || response.status === 403) {
        tokenManager.clear();

        // Dispatch event to notify AuthContext
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("auth-error", {
              detail: { status: response.status, message: data.message },
            })
          );
        }
      }
    }

    return data;
  } catch (error) {
    console.log("API Request failed:", error.message);
    return null;
  }
};

// Auth API functions
export const authAPI = {
  signup: async (userData) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  verifyEmail: async (email_code) => {
    return apiRequest("/auth/postcode", {
      method: "POST",
      body: JSON.stringify({ email_code }),
    });
  },

  login: async (email, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // Forgot password - expects email and sends code
  forgotPassword: async (email) => {
    return apiRequest("/auth/forgotPassword", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // verify reset code - use verifyEmail again for reset code verification too

  // Reset password
  resetPassword: async (newPassword) => {
    return apiRequest("/auth/resetPassword", {
      method: "POST",
      body: JSON.stringify({ password: newPassword }),
    });
  },
};

// Transaction API functions
export const transactionAPI = {
  getTransactions: async (filters = {}) => {
    const { start, end, page = 1, limit = 10 } = filters;
    const queryParams = new URLSearchParams();

    if (start) queryParams.append("start", start);
    if (end) queryParams.append("end", end);
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    return apiRequest(`/transaction/?${queryParams.toString()}`, {
      method: "GET",
    });
  },

  createTransaction: async (transactionData) => {
    return apiRequest("/transaction/", {
      method: "POST",
      body: JSON.stringify(transactionData),
    });
  },

  getTransaction: async (id) => {
    return apiRequest(`/transaction/${id}`, {
      method: "GET",
    });
  },

  updateTransaction: async (id, transactionData) => {
    return apiRequest(`/transaction/${id}`, {
      method: "PATCH",
      body: JSON.stringify(transactionData),
    });
  },

  deleteTransaction: async (id) => {
    return apiRequest(`/transaction/${id}`, {
      method: "DELETE",
    });
  },

  getAnalytics: async (type, start, end) => {
    const queryParams = new URLSearchParams();
    queryParams.append("type", type);
    queryParams.append("start", start);
    queryParams.append("end", end);

    return apiRequest(`/transaction/analytics?${queryParams.toString()}`, {
      method: "GET",
    });
  },

  extractTransactions: async (file, type = "expense") => {
    const formData = new FormData();
    formData.append("file", file);

    const queryParams = new URLSearchParams();
    queryParams.append("type", type);

    return apiRequest(`/transaction/extract?${queryParams.toString()}`, {
      method: "POST",
      body: formData,
    });
  },
};

// User API functions
export const userAPI = {
  getProfile: async () => {
    return apiRequest("/user/profile", {
      method: "GET",
    });
  },

  updateProfile: async (profileData) => {
    return apiRequest("/user/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },
};

export const authHelpers = {
  saveToken: tokenManager.save,
  getToken: tokenManager.get,
  clearAuth: tokenManager.clear,
};

export default apiRequest;
