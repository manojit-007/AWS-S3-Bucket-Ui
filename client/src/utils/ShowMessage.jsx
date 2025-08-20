import { toast } from "sonner";

//   Safe Thunk Response Handler
export const handleThunkResponse = async (dispatch, thunkFn, payload, options = {}) => {
  try {
    const res = await dispatch(thunkFn(payload)).unwrap();

    // Normalize server message
    let serverMessage = "";
    if (res?.message) {
      serverMessage =
        typeof res.message === "string" ? res.message : JSON.stringify(res.message);
    }

    // Show toast if success: false
    if (res?.success === false) {
      toast.error(serverMessage || options.errorMessage || "Something went wrong");
      return res;
    }

    // Show success toast
    const successMsg = options.successMessage || serverMessage || "Action completed successfully";
    toast.success(successMsg);

    return res;
  } catch (err) {
      //console.log(err);

    // Normalize error message
    let errMsg =
      err?.message ||
      (err?.response?.data?.message
        ? typeof err.response.data.message === "string"
          ? err.response.data.message
          : JSON.stringify(err.response.data.message)
        : "Something went wrong");

    toast.error(errMsg);

    return null;
  }
};
