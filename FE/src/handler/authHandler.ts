import axios from "axios";


export const registerHandler = async (values: any) => {
  try {
    const response = await axios.post("/api/auth/register", values);
    return { message: response.data.message, status: response.status };
  } catch (error: any) {
    if (error.response?.status == 409) {
      return { message: "User already exists", status: 409 };
    }
    return { message: "Server Error Occurred!", status: 500 };
  }
};

export const loginHandler = async (values: {email: string, password: string}) => {
  try {
    const res = await axios.post("/api/auth/login", values);
    const data = res.data;
    const refinedResponse = {
        email: data.user.user_name ?? data.name,
        role: data.user.role,
        message: data.message || "Login Successful",
    };

    return { refinedResponse, status: res.status };
  } catch (error: any) {
    const status = error.response ? error.response.status : 500;
    
    if (status == 401) {
      return { message: "Error! Incorrect email or password!", status };
    }
    if (status == 403) {
      return { message: "Please verify your email", status };
    }
    if (status == 404) {
      return { message: "User does not exist!", status: 403 }; // Kept your 403 mapping
    }
    
    return {
      message: error.message || "An error occurred",
      status: status,
    };
  }
};

export const logoutHandler = async () => {
  try {
    const response = await axios.post("/api/auth/logout");
    
    window.location.href = "/auth/login"; 
    
    return { data: response.data, status: response.status };
  } catch (error: any) {
    window.location.href = "/auth/login";
    return { message: error.message, status: 500 };
  }
};

export const validateOTP = async (values: any) => {
  try {
    const resp = await axios.post("/api/auth/otp", values);
    return { data: resp.data, status: resp.status };
  } catch (error: any) {
    return { message: error.message, status: error.response?.status || 500 };
  }
};

export const resendOTP = async (email: string) => {
  try {
    const resp = await axios.post("/api/auth/resend-otp", { email });
    return { data: resp.data };
  } catch (error: any) {
    return { message: error.message, status: error.response?.status || 500 };
  }
};